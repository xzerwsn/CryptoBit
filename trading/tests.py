import json
from decimal import Decimal
from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.test import TestCase, override_settings
from django.urls import reverse

from .services import sync_market_assets
from .models import Asset, Trade, UserProfile
from .views import build_portfolio


User = get_user_model()


class AuthFlowTests(TestCase):
    def test_dashboard_requires_login(self):
        response = self.client.get(reverse("dashboard"))
        self.assertEqual(response.status_code, 302)
        self.assertIn(reverse("login"), response.url)

    @patch("trading.views.get_top_10_market_data")
    def test_registration_creates_user_profile_and_logs_user_in(self, market_data_mock):
        market_data_mock.return_value = [
            {
                "sym": "BTC",
                "name": "Bitcoin",
                "price": 65000,
                "change_24h": 2.5,
                "mcap": 1200000000000,
                "color": "#f7931a",
                "previous_price": 63400,
            }
        ]

        response = self.client.post(
            reverse("register"),
            {
                "username": "alice",
                "first_name": "Alice",
                "last_name": "Walker",
                "email": "alice@example.com",
                "nickname": "MoonFox",
                "password1": "StrongPassword123",
                "password2": "StrongPassword123",
            },
        )

        self.assertRedirects(response, reverse("dashboard"))
        user = User.objects.get(username="alice")
        profile = UserProfile.objects.get(user=user)

        self.assertEqual(profile.nickname, "MoonFox")
        self.assertEqual(int(self.client.session["_auth_user_id"]), user.id)


class DashboardTradeTests(TestCase):
    def setUp(self):
        self.asset = Asset.objects.create(
            ticker="BTC",
            name="Bitcoin",
            category="Crypto",
            description="",
        )
        self.user = User.objects.create_user(
            username="trader",
            password="StrongPassword123",
            email="trader@example.com",
        )
        self.other_user = User.objects.create_user(
            username="other",
            password="StrongPassword123",
            email="other@example.com",
        )
        self.client.login(username="trader", password="StrongPassword123")

    @patch("trading.views.get_top_10_market_data")
    def test_buy_order_adds_coin_to_portfolio(self, market_data_mock):
        market_data_mock.return_value = [
            {
                "sym": "BTC",
                "name": "Bitcoin",
                "price": 65000,
                "change_24h": 2.5,
                "mcap": 1200000000000,
                "color": "#f7931a",
                "previous_price": 63400,
            }
        ]

        response = self.client.post(
            reverse("dashboard"),
            {
                "asset": self.asset.id,
                "trade_type": "BUY",
                "amount": "0.5",
                "price": "1",
            },
        )

        self.assertRedirects(response, reverse("dashboard"))

        trade = Trade.objects.get()
        self.assertEqual(trade.user, self.user)
        self.assertEqual(trade.price, Decimal("65000"))

        follow_up = self.client.get(reverse("dashboard"))
        payload = json.loads(follow_up.context["django_data_json"])

        self.assertEqual(len(payload["holdings"]), 1)
        self.assertEqual(payload["holdings"][0]["sym"], "BTC")
        self.assertEqual(payload["holdings"][0]["qty"], "0.5000")
        self.assertEqual(payload["holdings"][0]["avgPrice"], "65000.0000")

    @patch("trading.views.get_top_10_market_data")
    def test_ajax_order_returns_json_payload_without_redirect(self, market_data_mock):
        market_data_mock.return_value = [
            {
                "sym": "BTC",
                "name": "Bitcoin",
                "price": 65000,
                "change_24h": 2.5,
                "mcap": 1200000000000,
                "color": "#f7931a",
                "previous_price": 63400,
            }
        ]

        response = self.client.post(
            reverse("dashboard"),
            {
                "asset": self.asset.id,
                "trade_type": "BUY",
                "amount": "0.25",
                "price": "1",
            },
            HTTP_X_REQUESTED_WITH="XMLHttpRequest",
        )

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertEqual(payload["holdings"][0]["sym"], "BTC")
        self.assertEqual(payload["marketTrades"][0]["side"], "buy")
        self.assertEqual(payload["userTrades"][0]["side"], "buy")

    @patch("trading.views.get_top_10_market_data")
    def test_ajax_order_uses_server_price_when_client_sends_high_precision_value(self, market_data_mock):
        market_data_mock.return_value = [
            {
                "sym": "BTC",
                "name": "Bitcoin",
                "price": 65000.123456,
                "change_24h": 2.5,
                "mcap": 1200000000000,
                "color": "#f7931a",
                "previous_price": 63400,
            }
        ]

        response = self.client.post(
            reverse("dashboard"),
            {
                "asset": self.asset.id,
                "trade_type": "BUY",
                "amount": "0.25",
                "price": "65000.123456789",
            },
            HTTP_X_REQUESTED_WITH="XMLHttpRequest",
        )

        self.assertEqual(response.status_code, 200)
        trade = Trade.objects.get()
        self.assertEqual(trade.price, Decimal("65000.1235"))

    def test_build_portfolio_recalculates_average_price_after_multiple_buys(self):
        Trade.objects.create(
            user=self.user,
            asset=self.asset,
            trade_type="BUY",
            amount=Decimal("1"),
            price=Decimal("60000"),
        )
        Trade.objects.create(
            user=self.user,
            asset=self.asset,
            trade_type="BUY",
            amount=Decimal("2"),
            price=Decimal("75000"),
        )

        portfolio = build_portfolio(Trade.objects.filter(user=self.user))

        self.assertEqual(len(portfolio), 1)
        self.assertEqual(portfolio[0]["ticker"], "BTC")
        self.assertEqual(portfolio[0]["balance"], Decimal("3"))
        self.assertEqual(portfolio[0]["avg_price"], Decimal("70000"))

    @patch("trading.views.get_top_10_market_data")
    def test_cannot_sell_coin_that_is_not_in_portfolio(self, market_data_mock):
        market_data_mock.return_value = [
            {
                "sym": "BTC",
                "name": "Bitcoin",
                "price": 65000,
                "change_24h": 2.5,
                "mcap": 1200000000000,
                "color": "#f7931a",
                "previous_price": 63400,
            }
        ]

        response = self.client.post(
            reverse("dashboard"),
            {
                "asset": self.asset.id,
                "trade_type": "SELL",
                "amount": "0.1",
                "price": "1",
            },
            HTTP_X_REQUESTED_WITH="XMLHttpRequest",
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(Trade.objects.count(), 0)
        self.assertIn("amount", response.json()["errors"])

    @patch("trading.views.get_top_10_market_data")
    def test_cannot_sell_more_than_portfolio_balance(self, market_data_mock):
        market_data_mock.return_value = [
            {
                "sym": "BTC",
                "name": "Bitcoin",
                "price": 65000,
                "change_24h": 2.5,
                "mcap": 1200000000000,
                "color": "#f7931a",
                "previous_price": 63400,
            }
        ]

        Trade.objects.create(
            user=self.user,
            asset=self.asset,
            trade_type="BUY",
            amount=Decimal("0.5"),
            price=Decimal("60000"),
        )

        response = self.client.post(
            reverse("dashboard"),
            {
                "asset": self.asset.id,
                "trade_type": "SELL",
                "amount": "0.8",
                "price": "1",
            },
            HTTP_X_REQUESTED_WITH="XMLHttpRequest",
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(Trade.objects.count(), 1)
        self.assertIn("amount", response.json()["errors"])

    @patch("trading.views.get_top_10_market_data")
    def test_dashboard_shows_only_current_users_trades(self, market_data_mock):
        market_data_mock.return_value = [
            {
                "sym": "BTC",
                "name": "Bitcoin",
                "price": 65000,
                "change_24h": 2.5,
                "mcap": 1200000000000,
                "color": "#f7931a",
                "previous_price": 63400,
            }
        ]

        Trade.objects.create(
            user=self.user,
            asset=self.asset,
            trade_type="BUY",
            amount=Decimal("0.2"),
            price=Decimal("61000"),
        )
        Trade.objects.create(
            user=self.other_user,
            asset=self.asset,
            trade_type="BUY",
            amount=Decimal("4"),
            price=Decimal("50000"),
        )

        response = self.client.get(reverse("dashboard"))
        payload = json.loads(response.context["django_data_json"])

        self.assertEqual(len(payload["userTrades"]), 1)
        self.assertEqual(payload["userTrades"][0]["qty"], 0.2)
        self.assertEqual(len(payload["marketTrades"]), 2)


class MarketAssetSyncTests(TestCase):
    def test_sync_market_assets_bulk_updates_existing_assets(self):
        asset = Asset.objects.create(
            ticker="BTC",
            name="Outdated Name",
            category="Legacy",
            description="",
        )

        sync_market_assets(force=True)

        asset.refresh_from_db()
        self.assertEqual(asset.name, "Bitcoin")
        self.assertEqual(asset.category, "Crypto")


@override_settings(
    SUPPORT_EMAIL_PROVIDER="console",
    SUPPORT_FROM_EMAIL="CryptoBit Support <support@example.com>",
)
class SupportRequestTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="client",
            password="StrongPassword123",
            email="client@example.com",
            first_name="Client",
            last_name="User",
        )
        self.admin = User.objects.create_user(
            username="admin",
            password="StrongPassword123",
            email="admin@example.com",
            is_staff=True,
        )
        self.second_admin = User.objects.create_user(
            username="owner",
            password="StrongPassword123",
            email="owner@example.com",
            is_superuser=True,
            is_staff=True,
        )
        self.client.login(username="client", password="StrongPassword123")

    @patch("builtins.print")
    def test_support_request_sends_email_to_all_admins(self, print_mock):
        with patch("trading.views.support_email_backend_is_ready", return_value=True):
            response = self.client.post(
                reverse("support_request_api"),
                {
                    "subject": "Проблема со входом",
                    "message": "После ввода пароля страница зависает.",
                },
                HTTP_X_REQUESTED_WITH="XMLHttpRequest",
            )

        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(print_mock.call_count, 2)

    def test_support_request_requires_contact_email_when_user_has_no_email(self):
        self.user.email = ""
        self.user.save(update_fields=["email"])

        with patch("trading.views.support_email_backend_is_ready", return_value=True):
            response = self.client.post(
                reverse("support_request_api"),
                {
                    "subject": "Нужна помощь",
                    "message": "Не получается обновить профиль.",
                    "contact_email": "",
                },
                HTTP_X_REQUESTED_WITH="XMLHttpRequest",
            )

        self.assertEqual(response.status_code, 400)
        self.assertIn("contact_email", response.json()["errors"])

    def test_support_request_fails_when_admins_have_no_email(self):
        self.admin.email = ""
        self.admin.save(update_fields=["email"])
        self.second_admin.email = ""
        self.second_admin.save(update_fields=["email"])

        with patch("trading.views.support_email_backend_is_ready", return_value=True):
            response = self.client.post(
                reverse("support_request_api"),
                {
                    "subject": "Проверка",
                    "message": "Некому отправлять.",
                },
                HTTP_X_REQUESTED_WITH="XMLHttpRequest",
            )

        self.assertEqual(response.status_code, 400)
        self.assertIn("__all__", response.json()["errors"])

    @override_settings(SUPPORT_EMAIL_PROVIDER="sendgrid", SENDGRID_API_KEY="")
    def test_support_request_returns_error_when_provider_is_not_configured(self):
        response = self.client.post(
            reverse("support_request_api"),
            {
                "subject": "Почта",
                "message": "Проверка конфигурации.",
            },
            HTTP_X_REQUESTED_WITH="XMLHttpRequest",
        )

        self.assertEqual(response.status_code, 503)
        self.assertIn("__all__", response.json()["errors"])
