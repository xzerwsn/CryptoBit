import logging
import math

import yfinance as yf
from django.conf import settings
from django.core.cache import cache
from django.db import transaction

from .models import Asset, Trade


logger = logging.getLogger(__name__)

MARKET_DATA_CACHE_KEY = "trading.market_data.v2"
MARKET_ASSET_SYNC_CACHE_KEY = "trading.market_assets_synced.v2"

COIN_COLORS = {
    "BTC": "#f7931a",
    "ETH": "#627eea",
    "SOL": "#9945ff",
    "BNB": "#f3ba2f",
    "XRP": "#00aae4",
    "ADA": "#0033ad",
    "DOGE": "#c2a633",
    "AVAX": "#e84142",
    "LINK": "#2a5ada",
    "DOT": "#e6007a",
    "LTC": "#a6a9b6",
}

MARKET_TICKERS = [
    {"yf": "BTC-USD", "ticker": "BTC", "name": "Bitcoin"},
    {"yf": "ETH-USD", "ticker": "ETH", "name": "Ethereum"},
    {"yf": "BNB-USD", "ticker": "BNB", "name": "BNB"},
    {"yf": "XRP-USD", "ticker": "XRP", "name": "XRP"},
    {"yf": "ADA-USD", "ticker": "ADA", "name": "Cardano"},
    {"yf": "SOL-USD", "ticker": "SOL", "name": "Solana"},
    {"yf": "DOGE-USD", "ticker": "DOGE", "name": "Dogecoin"},
    {"yf": "DOT-USD", "ticker": "DOT", "name": "Polkadot"},
    {"yf": "LTC-USD", "ticker": "LTC", "name": "Litecoin"},
    {"yf": "AVAX-USD", "ticker": "AVAX", "name": "Avalanche"},
    {"yf": "LINK-USD", "ticker": "LINK", "name": "Chainlink"},
    {"yf": "TRX-USD", "ticker": "TRX", "name": "TRON"},
    {"yf": "BCH-USD", "ticker": "BCH", "name": "Bitcoin Cash"},
    {"yf": "XLM-USD", "ticker": "XLM", "name": "Stellar"},
    {"yf": "ATOM-USD", "ticker": "ATOM", "name": "Cosmos"},
    {"yf": "ETC-USD", "ticker": "ETC", "name": "Ethereum Classic"},
    {"yf": "FIL-USD", "ticker": "FIL", "name": "Filecoin"},
    {"yf": "ICP-USD", "ticker": "ICP", "name": "Internet Computer"},
]

FALLBACK_MARKET_DATA = [
    {"sym": "BTC", "name": "Bitcoin", "price": 65000, "change_24h": 2.5, "mcap": 1200000000000, "color": "#f7931a", "previous_price": 63400},
    {"sym": "ETH", "name": "Ethereum", "price": 3500, "change_24h": 1.8, "mcap": 420000000000, "color": "#627eea", "previous_price": 3440},
    {"sym": "BNB", "name": "BNB", "price": 580, "change_24h": -0.5, "mcap": 89000000000, "color": "#f3ba2f", "previous_price": 583},
    {"sym": "XRP", "name": "XRP", "price": 0.52, "change_24h": 0.3, "mcap": 28000000000, "color": "#00aae4", "previous_price": 0.518},
    {"sym": "ADA", "name": "Cardano", "price": 0.45, "change_24h": -1.2, "mcap": 16000000000, "color": "#0033ad", "previous_price": 0.455},
    {"sym": "SOL", "name": "Solana", "price": 140, "change_24h": 5.2, "mcap": 62000000000, "color": "#9945ff", "previous_price": 133},
    {"sym": "DOGE", "name": "Dogecoin", "price": 0.12, "change_24h": 1.5, "mcap": 17000000000, "color": "#c2a633", "previous_price": 0.118},
    {"sym": "DOT", "name": "Polkadot", "price": 6.8, "change_24h": -0.8, "mcap": 8900000000, "color": "#e6007a", "previous_price": 6.85},
    {"sym": "LTC", "name": "Litecoin", "price": 82, "change_24h": -1.5, "mcap": 6100000000, "color": "#a6a9b6", "previous_price": 83.2},
    {"sym": "AVAX", "name": "Avalanche", "price": 39, "change_24h": 2.1, "mcap": 16000000000, "color": "#e84142", "previous_price": 38.2},
    {"sym": "LINK", "name": "Chainlink", "price": 18.5, "change_24h": 1.7, "mcap": 10800000000, "color": "#2a5ada", "previous_price": 18.19},
    {"sym": "TRX", "name": "TRON", "price": 0.13, "change_24h": 0.8, "mcap": 11300000000, "color": "#ff3b3b", "previous_price": 0.129},
    {"sym": "BCH", "name": "Bitcoin Cash", "price": 510, "change_24h": -0.4, "mcap": 10100000000, "color": "#8dc351", "previous_price": 512},
    {"sym": "XLM", "name": "Stellar", "price": 0.11, "change_24h": 1.1, "mcap": 3300000000, "color": "#14b8a6", "previous_price": 0.109},
    {"sym": "ATOM", "name": "Cosmos", "price": 8.7, "change_24h": -0.9, "mcap": 3400000000, "color": "#4f46e5", "previous_price": 8.78},
    {"sym": "ETC", "name": "Ethereum Classic", "price": 31, "change_24h": 0.6, "mcap": 4600000000, "color": "#16a34a", "previous_price": 30.81},
    {"sym": "FIL", "name": "Filecoin", "price": 6.2, "change_24h": -1.3, "mcap": 3600000000, "color": "#06b6d4", "previous_price": 6.28},
    {"sym": "ICP", "name": "Internet Computer", "price": 13.9, "change_24h": 2.4, "mcap": 6500000000, "color": "#ec4899", "previous_price": 13.57},
]


def _is_nan(value):
    try:
        return value is None or math.isnan(float(value))
    except (TypeError, ValueError):
        return True


def _safe_float(value, default=0.0):
    return default if _is_nan(value) else float(value)


def _safe_int(value, default=0):
    return default if _is_nan(value) else int(float(value))


def _clone_market_row(row):
    current_price = _safe_float(row.get("price"))
    previous_price = _safe_float(row.get("previous_price"), current_price)
    return {
        "sym": row["sym"],
        "name": row["name"],
        "price": current_price,
        "change_24h": _safe_float(row.get("change_24h")),
        "mcap": _safe_int(row.get("mcap")),
        "color": row.get("color", COIN_COLORS.get(row["sym"], "#7b7bff")),
        "previous_price": previous_price,
        "open_price": _safe_float(row.get("open_price"), previous_price),
        "high_price": _safe_float(row.get("high_price"), max(current_price, previous_price)),
        "low_price": _safe_float(row.get("low_price"), min(current_price, previous_price)),
        "volume": _safe_int(row.get("volume")),
    }


def get_fallback_market_data():
    return [_clone_market_row(row) for row in FALLBACK_MARKET_DATA]


def get_market_data_cache_ttl():
    return getattr(settings, "MARKET_DATA_CACHE_TTL", 15)


def get_market_asset_sync_ttl():
    return getattr(settings, "MARKET_ASSET_SYNC_TTL", 3600)


def sync_market_assets(*, force=False):
    if not force and cache.get(MARKET_ASSET_SYNC_CACHE_KEY):
        return

    supported_tickers = {item["ticker"] for item in MARKET_TICKERS}
    existing_assets = {
        asset.ticker: asset
        for asset in Asset.objects.only("id", "ticker", "name", "category")
    }
    stale_asset_ids = [asset.id for ticker, asset in existing_assets.items() if ticker not in supported_tickers]
    assets_to_create = []
    assets_to_update = []

    for market_item in MARKET_TICKERS:
        asset = existing_assets.get(market_item["ticker"])
        if asset is None:
            assets_to_create.append(
                Asset(
                    ticker=market_item["ticker"],
                    name=market_item["name"],
                    category="Crypto",
                )
            )
            continue

        if asset.name != market_item["name"] or asset.category != "Crypto":
            asset.name = market_item["name"]
            asset.category = "Crypto"
            assets_to_update.append(asset)

    with transaction.atomic():
        if stale_asset_ids:
            Trade.objects.filter(asset_id__in=stale_asset_ids).delete()
            Asset.objects.filter(id__in=stale_asset_ids).delete()
        if assets_to_create:
            Asset.objects.bulk_create(assets_to_create, ignore_conflicts=True)
        if assets_to_update:
            Asset.objects.bulk_update(assets_to_update, ["name", "category"])

    cache.set(MARKET_ASSET_SYNC_CACHE_KEY, True, get_market_asset_sync_ttl())
    cache.delete(MARKET_DATA_CACHE_KEY)


def _extract_ticker_frame(downloaded_data, formatted_ticker):
    if hasattr(downloaded_data.columns, "levels"):
        try:
            return downloaded_data[formatted_ticker]
        except KeyError:
            return None
    return downloaded_data


def _build_market_data_from_download(downloaded_data):
    fallback_map = {row["sym"]: _clone_market_row(row) for row in FALLBACK_MARKET_DATA}
    market_data = []

    for market_item in MARKET_TICKERS:
        symbol = market_item["ticker"]
        fallback = fallback_map[symbol]
        frame = _extract_ticker_frame(downloaded_data, market_item["yf"])

        if frame is None or frame.empty:
            market_data.append(fallback)
            continue

        close_series = frame["Close"].dropna() if "Close" in frame else None
        if close_series is None or close_series.empty:
            market_data.append(fallback)
            continue

        last_row = frame.iloc[-1]
        current_price = _safe_float(close_series.iloc[-1], fallback["price"])
        previous_price = (
            _safe_float(close_series.iloc[-2], fallback["previous_price"])
            if len(close_series) > 1
            else fallback["previous_price"]
        )
        if previous_price <= 0:
            previous_price = current_price

        change_24h = 0.0
        if previous_price > 0:
            change_24h = ((current_price - previous_price) / previous_price) * 100

        market_data.append(
            {
                "sym": symbol,
                "name": market_item["name"],
                "price": current_price,
                "change_24h": change_24h,
                "mcap": fallback["mcap"],
                "color": COIN_COLORS.get(symbol, fallback["color"]),
                "previous_price": previous_price,
                "open_price": _safe_float(last_row.get("Open"), previous_price),
                "high_price": _safe_float(last_row.get("High"), max(current_price, previous_price)),
                "low_price": _safe_float(last_row.get("Low"), min(current_price, previous_price)),
                "volume": _safe_int(last_row.get("Volume")),
            }
        )

    return market_data


def get_top_10_market_data(*, force_refresh=False):
    if not force_refresh:
        cached_payload = cache.get(MARKET_DATA_CACHE_KEY)
        if cached_payload:
            return [_clone_market_row(row) for row in cached_payload]

    try:
        downloaded_data = yf.download(
            tickers=[item["yf"] for item in MARKET_TICKERS],
            period="2d",
            interval="5m",
            group_by="ticker",
            auto_adjust=False,
            progress=False,
            threads=True,
        )
        market_data = _build_market_data_from_download(downloaded_data)
    except Exception:
        logger.exception("Failed to fetch market data from yfinance")
        market_data = get_fallback_market_data()

    cache.set(MARKET_DATA_CACHE_KEY, market_data, get_market_data_cache_ttl())
    return [_clone_market_row(row) for row in market_data]
