import time
from datetime import timedelta
from decimal import Decimal, ROUND_HALF_UP

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.conf import settings
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone

from trading.models import Asset, PriceHistory
from trading.services import get_top_10_market_data


class Command(BaseCommand):
    help = "Optimized price updater with controlled polling and history persistence."

    def add_arguments(self, parser):
        parser.add_argument(
            "--interval",
            type=float,
            default=getattr(settings, "PRICE_UPDATER_POLL_INTERVAL", 15),
            help="Seconds between market refreshes.",
        )
        parser.add_argument(
            "--history-interval",
            type=float,
            default=getattr(settings, "PRICE_HISTORY_WRITE_INTERVAL", 60),
            help="Seconds between persisted PriceHistory snapshots.",
        )
        parser.add_argument(
            "--retention-hours",
            type=int,
            default=getattr(settings, "PRICE_HISTORY_RETENTION_HOURS", 72),
            help="How long to keep historical rows.",
        )
        parser.add_argument(
            "--once",
            action="store_true",
            help="Run a single refresh cycle and exit.",
        )

    def handle(self, *args, **options):
        poll_interval = max(float(options["interval"]), 5.0)
        history_interval = max(float(options["history_interval"]), poll_interval)
        retention_hours = max(int(options["retention_hours"]), 1)
        run_once = options["once"]

        self.stdout.write(self.style.SUCCESS("--- OPTIMIZED PRICE UPDATER STARTED ---"))
        channel_layer = get_channel_layer()
        last_history_write_at = None
        last_cleanup_at = None
        last_sent_prices = {}

        while True:
            try:
                assets = {
                    asset.ticker.upper(): asset
                    for asset in Asset.objects.only("id", "ticker")
                }
                if not assets:
                    time.sleep(5)
                    if run_once:
                        break
                    continue

                market_data = get_top_10_market_data(force_refresh=True)
                now = timezone.now()
                should_write_history = (
                    last_history_write_at is None
                    or (now - last_history_write_at).total_seconds() >= history_interval
                )
                price_history_batch = []

                for market_row in market_data:
                    asset = assets.get(market_row["sym"].upper())
                    if asset is None:
                        continue

                    current_price = Decimal(str(market_row["price"])).quantize(
                        Decimal("0.000000"),
                        rounding=ROUND_HALF_UP,
                    )
                    asset_key = asset.ticker.upper()
                    if last_sent_prices.get(asset_key) != current_price:
                        async_to_sync(channel_layer.group_send)(
                            "crypto_prices",
                            {
                                "type": "price_update",
                                "ticker": asset_key,
                                "price": f"{float(current_price):.5f}",
                                "change_24h": market_row.get("change_24h", 0),
                                "price_24h": market_row.get("previous_price", market_row["price"]),
                                "high_24h": market_row.get("high_price", market_row["price"]),
                                "low_24h": market_row.get("low_price", market_row["price"]),
                                "volume": market_row.get("volume", 0),
                            },
                        )
                        last_sent_prices[asset_key] = current_price

                    if should_write_history:
                        price_history_batch.append(
                            PriceHistory(
                                asset=asset,
                                date=now,
                                price_open=Decimal(str(market_row.get("open_price", market_row["previous_price"]))).quantize(
                                    Decimal("0.000000"),
                                    rounding=ROUND_HALF_UP,
                                ),
                                price_close=current_price,
                                price_high=Decimal(str(market_row.get("high_price", market_row["price"]))).quantize(
                                    Decimal("0.000000"),
                                    rounding=ROUND_HALF_UP,
                                ),
                                price_low=Decimal(str(market_row.get("low_price", market_row["price"]))).quantize(
                                    Decimal("0.000000"),
                                    rounding=ROUND_HALF_UP,
                                ),
                                volume=max(int(market_row.get("volume", 0)), 0),
                            )
                        )

                if should_write_history and price_history_batch:
                    with transaction.atomic():
                        PriceHistory.objects.bulk_create(price_history_batch, batch_size=200)
                    last_history_write_at = now
                    self.stdout.write(
                        f"[{now.strftime('%H:%M:%S')}] Saved {len(price_history_batch)} history rows."
                    )

                if last_cleanup_at is None or (now - last_cleanup_at).total_seconds() >= 3600:
                    cutoff = now - timedelta(hours=retention_hours)
                    deleted_count, _ = PriceHistory.objects.filter(date__lt=cutoff).delete()
                    last_cleanup_at = now
                    if deleted_count:
                        self.stdout.write(
                            f"[{now.strftime('%H:%M:%S')}] Deleted old rows: {deleted_count}."
                        )

            except Exception as exc:
                self.stdout.write(self.style.ERROR(f"Critical error: {exc}"))

            if run_once:
                break

            time.sleep(poll_interval)
