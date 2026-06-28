import json
import pprint
import smtplib
from decimal import Decimal

import requests
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth import login as auth_login, logout as auth_logout
from django.contrib.auth.decorators import login_required
from django.core.mail import EmailMessage
from django.core.serializers.json import DjangoJSONEncoder
from django.db import transaction
from django.db.models import Q
from django.http import JsonResponse
from django.shortcuts import redirect, render
from django.views.decorators.http import require_http_methods

from .forms import LoginForm, RegistrationForm, SupportRequestForm, TradeForm
from .models import Asset, Trade, UserProfile
from .services import get_top_10_market_data as get_top_10_market_data_service
from .services import sync_market_assets as sync_market_assets_service


User = get_user_model()
NON_DELIVERY_EMAIL_BACKENDS = {
    "django.core.mail.backends.console.EmailBackend",
    "django.core.mail.backends.filebased.EmailBackend",
    "django.core.mail.backends.locmem.EmailBackend",
    "django.core.mail.backends.dummy.EmailBackend",
}


def get_or_create_profile(request):
    user = request.user
    profile, _ = UserProfile.objects.get_or_create(
        user=user,
        defaults={
            "nickname": user.first_name or user.username,
            "phone": "",
            "bio": "",
            "email_visibility": UserProfile.VISIBILITY_PRIVATE,
            "phone_visibility": UserProfile.VISIBILITY_PRIVATE,
            "full_name_visibility": UserProfile.VISIBILITY_PUBLIC,
            "theme": UserProfile.THEME_DARK,
        },
    )
    return profile


def serialize_market_coin(coin):
    return {
        "sym": coin["sym"],
        "name": coin["name"],
        "price": coin["price"],
        "mcap": coin["mcap"],
        "color": coin["color"],
        "chg": round(coin["change_24h"], 2),
    }


def serialize_trade(trade):
    return {
        "id": f"T-{trade.id}",
        "date": trade.timestamp.isoformat(),
        "sym": trade.asset.ticker.upper(),
        "side": "buy" if trade.trade_type == "BUY" else "sell",
        "qty": float(trade.amount),
        "price": float(trade.price),
        "total": float(trade.amount * trade.price),
        "status": "filled",
    }


def build_dashboard_payload(top_10_coins, assets, market_trades, user_trades, portfolio):
    coins_json = [serialize_market_coin(coin) for coin in top_10_coins]
    holdings_json = [
        {"sym": item["ticker"], "qty": item["balance"], "avgPrice": item["avg_price"]}
        for item in portfolio
    ]
    market_trades_json = [serialize_trade(trade) for trade in market_trades]
    user_trades_json = [serialize_trade(trade) for trade in user_trades]
    assets_for_form_json = [
        {"id": asset.id, "ticker": asset.ticker.upper(), "name": asset.name}
        for asset in assets
    ]
    return {
        "coins": coins_json,
        "holdings": holdings_json,
        "marketTrades": market_trades_json,
        "userTrades": user_trades_json,
        "assetsForForm": assets_for_form_json,
    }


def build_portfolio(trades):
    portfolio_map = {}

    for trade in trades:
        ticker = trade.asset.ticker.upper()
        item = portfolio_map.setdefault(
            ticker,
            {
                "ticker": ticker,
                "name": trade.asset.name,
                "balance": Decimal("0"),
                "avg_price": Decimal("0"),
            },
        )

        if trade.trade_type == "BUY":
            current_cost = item["balance"] * item["avg_price"]
            buy_cost = trade.amount * trade.price
            new_balance = item["balance"] + trade.amount
            item["avg_price"] = (current_cost + buy_cost) / new_balance if new_balance > 0 else Decimal("0")
            item["balance"] = new_balance
            continue

        new_balance = item["balance"] - trade.amount
        if new_balance <= 0:
            item["balance"] = Decimal("0")
            item["avg_price"] = Decimal("0")
        else:
            item["balance"] = new_balance

    return [item for item in portfolio_map.values() if item["balance"] > 0]


def get_portfolio_balance_map(trades):
    return {item["ticker"]: item["balance"] for item in build_portfolio(trades)}


def sync_market_assets(force=False):
    sync_market_assets_service(force=force)


def get_top_10_market_data(force_refresh=False):
    return get_top_10_market_data_service(force_refresh=force_refresh)


def get_trade_queryset():
    return Trade.objects.select_related("asset").only(
        "id",
        "trade_type",
        "amount",
        "price",
        "timestamp",
        "asset__ticker",
        "asset__name",
    )


def get_user_trade_history(user):
    return list(get_trade_queryset().filter(user=user).order_by("timestamp", "id"))


def get_recent_market_trades(limit=10):
    return list(get_trade_queryset().order_by("-timestamp", "-id")[:limit])


def get_recent_user_trades(trade_history, limit=10):
    return list(reversed(trade_history[-limit:]))


def build_dashboard_state(user, *, top_10_coins=None):
    top_10_coins = top_10_coins or get_top_10_market_data()
    assets = list(Asset.objects.only("id", "ticker", "name").order_by("ticker"))
    trade_history = get_user_trade_history(user)
    portfolio = build_portfolio(trade_history)
    user_trades = get_recent_user_trades(trade_history)
    market_trades = get_recent_market_trades()
    payload = build_dashboard_payload(top_10_coins, assets, market_trades, user_trades, portfolio)
    return payload, trade_history


def normalize_trade_form_data(post_data, market_prices):
    normalized_data = post_data.copy()
    asset_id = normalized_data.get("asset")
    if not asset_id:
        return normalized_data

    try:
        asset = Asset.objects.only("ticker").get(pk=asset_id)
    except (Asset.DoesNotExist, ValueError, TypeError):
        return normalized_data

    market_price = market_prices.get(asset.ticker.upper())
    if market_price is not None:
        normalized_data["price"] = f"{market_price:.4f}"

    return normalized_data


def auth_page_context(*, title, subtitle, form, submit_label, alternate_label, alternate_url):
    return {
        "title": title,
        "subtitle": subtitle,
        "form": form,
        "submit_label": submit_label,
        "alternate_label": alternate_label,
        "alternate_url": alternate_url,
    }


def get_support_recipient_emails():
    return list(
        User.objects.filter(Q(is_staff=True) | Q(is_superuser=True), is_active=True)
        .exclude(email="")
        .values_list("email", flat=True)
        .distinct()
    )


def support_email_backend_is_ready():
    provider = getattr(settings, "SUPPORT_EMAIL_PROVIDER", "smtp")

    if provider == "console":
        return True
    if provider == "resend":
        return bool(settings.RESEND_API_KEY and settings.SUPPORT_FROM_EMAIL)
    if provider == "sendgrid":
        return bool(settings.SENDGRID_API_KEY and settings.SUPPORT_FROM_EMAIL)

    return settings.EMAIL_BACKEND not in NON_DELIVERY_EMAIL_BACKENDS


def build_support_reply_to(contact_email):
    return [contact_email] if contact_email else None


def build_support_delivery_error_message(exc):
    if isinstance(exc, requests.exceptions.Timeout):
        return "Сервис отправки писем не ответил вовремя. Проверьте доступ к сети и повторите попытку."
    if isinstance(exc, requests.exceptions.ConnectionError):
        return "Не удалось подключиться к сервису отправки писем. Проверьте доступ к сети."
    if isinstance(exc, requests.exceptions.HTTPError):
        status_code = exc.response.status_code if exc.response is not None else None
        try:
            payload = exc.response.json() if exc.response is not None else {}
        except ValueError:
            payload = {}
        provider = getattr(settings, "SUPPORT_EMAIL_PROVIDER", "smtp")
        sendgrid_errors = payload.get("errors") if isinstance(payload, dict) else None
        sendgrid_detail = None
        if isinstance(sendgrid_errors, list) and sendgrid_errors:
            first_error = sendgrid_errors[0]
            if isinstance(first_error, dict):
                sendgrid_detail = first_error.get("message")

        if provider == "sendgrid" and status_code == 401:
            return "SendGrid отклонил API-ключ. Проверьте значение SENDGRID_API_KEY."
        if provider == "sendgrid" and status_code == 403:
            details = sendgrid_detail or payload.get("message") or payload.get("error")
            if details:
                return f"SendGrid запретил отправку. {details}"
            return "SendGrid запретил отправку. Проверьте подтверждение sender identity или домена."
        if provider == "sendgrid" and status_code == 422:
            details = sendgrid_detail or payload.get("message") or payload.get("error")
            if details:
                return f"SendGrid отклонил параметры письма. {details}"
            return "SendGrid отклонил параметры письма. Проверьте адрес отправителя, получателей и структуру запроса."

        if status_code == 401:
            return "Resend отклонил API-ключ. Проверьте значение RESEND_API_KEY."
        if status_code == 403:
            details = payload.get("message") or payload.get("error")
            if details:
                return f"Resend запретил отправку. {details}"
            return "Resend запретил отправку с текущего адреса. Проверьте домен отправителя в панели Resend."
        if status_code == 422:
            details = payload.get("message") or payload.get("error") or "Проверьте адрес отправителя и получателей."
            return f"Resend отклонил параметры письма. {details}"
        details = payload.get("message") or payload.get("error")
        if details:
            return f"Resend вернул ошибку отправки. {details}"
        return "Resend не принял письмо. Проверьте настройки отправки."
    if isinstance(exc, smtplib.SMTPAuthenticationError):
        return "Почтовый сервер отклонил авторизацию. Проверьте логин служебной почты и пароль приложения."
    if isinstance(exc, smtplib.SMTPConnectError):
        return "Не удалось подключиться к почтовому серверу. Проверьте SMTP-хост, порт и тип шифрования."
    if isinstance(exc, (TimeoutError, OSError)):
        return "Почтовый сервер не отвечает. Проверьте доступ к сети и параметры SMTP."
    if isinstance(exc, smtplib.SMTPException):
        return "Почтовый сервер отклонил отправку. Проверьте SMTP-настройки служебной почты."
    return "Не удалось отправить обращение. Проверьте настройки почты сервера."


def send_support_email(subject, body, recipient_emails, contact_email):
    provider = getattr(settings, "SUPPORT_EMAIL_PROVIDER", "smtp")

    if provider == "console":
        console_payload = {
            "subject": subject,
            "from": getattr(settings, "SUPPORT_FROM_EMAIL", settings.DEFAULT_FROM_EMAIL),
            "to": recipient_emails,
            "reply_to": build_support_reply_to(contact_email),
            "body": body,
        }
        print("\n=== SUPPORT REQUEST ===")
        pprint.pprint(console_payload, sort_dicts=False)
        print("=== END SUPPORT REQUEST ===\n")
        return

    if provider == "resend":
        response = requests.post(
            settings.RESEND_API_URL,
            headers={
                "Authorization": f"Bearer {settings.RESEND_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "from": settings.SUPPORT_FROM_EMAIL,
                "to": recipient_emails,
                "subject": subject,
                "text": body,
                "reply_to": build_support_reply_to(contact_email),
            },
            timeout=getattr(settings, "EMAIL_TIMEOUT", 20),
        )
        response.raise_for_status()
        return

    if provider == "sendgrid":
        from_email = getattr(settings, "SUPPORT_FROM_EMAIL", settings.DEFAULT_FROM_EMAIL)
        from_name = None
        from_address = from_email
        if "<" in from_email and ">" in from_email:
            from_name = from_email.split("<", 1)[0].strip().strip('"')
            from_address = from_email.split("<", 1)[1].split(">", 1)[0].strip()

        payload = {
            "personalizations": [
                {
                    "to": [{"email": email} for email in recipient_emails],
                    "subject": subject,
                }
            ],
            "from": {"email": from_address},
            "content": [
                {
                    "type": "text/plain",
                    "value": body,
                }
            ],
        }

        if from_name:
            payload["from"]["name"] = from_name
        if contact_email:
            payload["reply_to"] = {"email": contact_email}

        response = requests.post(
            settings.SENDGRID_API_URL,
            headers={
                "Authorization": f"Bearer {settings.SENDGRID_API_KEY}",
                "Content-Type": "application/json",
            },
            json=payload,
            timeout=getattr(settings, "EMAIL_TIMEOUT", 20),
        )
        response.raise_for_status()
        return

    email = EmailMessage(
        subject=subject,
        body=body,
        from_email=getattr(settings, "SUPPORT_FROM_EMAIL", settings.DEFAULT_FROM_EMAIL),
        to=recipient_emails,
        reply_to=build_support_reply_to(contact_email),
    )
    email.send(fail_silently=False)


def login_view(request):
    if request.user.is_authenticated:
        return redirect("dashboard")

    form = LoginForm(request, data=request.POST or None)
    if request.method == "POST" and form.is_valid():
        auth_login(request, form.get_user())
        return redirect("dashboard")

    return render(
        request,
        "trading/auth.html",
        auth_page_context(
            title="Вход",
            subtitle="Войдите, чтобы открыть терминал, портфель и профиль.",
            form=form,
            submit_label="Войти",
            alternate_label="Нет аккаунта? Создать",
            alternate_url="/register/",
        ),
    )


def register_view(request):
    if request.user.is_authenticated:
        return redirect("dashboard")

    form = RegistrationForm(request.POST or None)
    if request.method == "POST" and form.is_valid():
        user = form.save()
        auth_login(request, user)
        return redirect("dashboard")

    return render(
        request,
        "trading/auth.html",
        auth_page_context(
            title="Регистрация",
            subtitle="Создайте аккаунт, чтобы сохранять личные сделки и настройки профиля.",
            form=form,
            submit_label="Создать аккаунт",
            alternate_label="Уже есть аккаунт? Войти",
            alternate_url="/login/",
        ),
    )


@require_http_methods(["POST"])
def logout_view(request):
    auth_logout(request)
    return redirect("login")


@login_required
def dashboard(request):
    sync_market_assets()
    top_10_coins = get_top_10_market_data()
    payload, all_trades = build_dashboard_state(request.user, top_10_coins=top_10_coins)
    profile = get_or_create_profile(request)
    market_prices = {coin["sym"].upper(): Decimal(str(coin["price"])) for coin in top_10_coins}

    if request.method == "POST":
        form = TradeForm(normalize_trade_form_data(request.POST, market_prices))
        if form.is_valid():
            trade = form.save(commit=False)
            trade.user = request.user
            portfolio_balance_map = get_portfolio_balance_map(all_trades)
            available_balance = portfolio_balance_map.get(trade.asset.ticker.upper(), Decimal("0"))

            if trade.trade_type == "SELL":
                if available_balance <= 0:
                    form.add_error("amount", "You cannot sell a coin that is not in the portfolio.")
                elif trade.amount > available_balance:
                    form.add_error("amount", "You cannot sell more coins than are currently held.")

            if form.errors:
                if request.headers.get("X-Requested-With") == "XMLHttpRequest":
                    return JsonResponse({"errors": form.errors}, status=400)

                payload["profile"] = profile.to_private_dict()
                django_data_json = json.dumps(payload, cls=DjangoJSONEncoder)
                return render(
                    request,
                    "trading/dashboard.html",
                    {
                        "form": form,
                        "django_data_json": django_data_json,
                    },
                )

            trade.price = market_prices.get(trade.asset.ticker.upper(), trade.price)
            trade.save()
            payload, _ = build_dashboard_state(request.user, top_10_coins=top_10_coins)

            if request.headers.get("X-Requested-With") == "XMLHttpRequest":
                return JsonResponse(payload)
            return redirect("dashboard")

        if request.headers.get("X-Requested-With") == "XMLHttpRequest":
            return JsonResponse({"errors": form.errors}, status=400)
    else:
        form = TradeForm()

    payload["profile"] = profile.to_private_dict()
    django_data_json = json.dumps(payload, cls=DjangoJSONEncoder)

    return render(
        request,
        "trading/dashboard.html",
        {
            "form": form,
            "django_data_json": django_data_json,
        },
    )


@login_required
def get_top10_market_data_api(request):
    market_data = get_top_10_market_data()
    return JsonResponse({"coins": [serialize_market_coin(coin) for coin in market_data]})


@login_required
def get_chart_data(request, ticker):
    return JsonResponse({"ticker": ticker, "dates": [], "values": []})


@login_required
@require_http_methods(["GET", "POST"])
def profile_api(request):
    profile = get_or_create_profile(request)

    if request.method == "GET":
        return JsonResponse({"profile": profile.to_private_dict()})

    user = profile.user
    payload = request.POST
    avatar = request.FILES.get("avatar")

    with transaction.atomic():
        user.first_name = payload.get("firstName", "").strip()
        user.last_name = payload.get("lastName", "").strip()
        user.email = payload.get("email", "").strip()
        user.save(update_fields=["first_name", "last_name", "email"])

        profile.nickname = payload.get("nickname", "").strip()
        profile.phone = payload.get("phone", "").strip()
        profile.bio = payload.get("bio", "").strip()

        requested_theme = payload.get("theme", profile.theme)
        if requested_theme in {UserProfile.THEME_LIGHT, UserProfile.THEME_DARK}:
            profile.theme = requested_theme

        for field_name, key in (
            ("email_visibility", "emailVisibility"),
            ("phone_visibility", "phoneVisibility"),
            ("full_name_visibility", "fullNameVisibility"),
        ):
            requested_visibility = payload.get(key, getattr(profile, field_name))
            if requested_visibility in {UserProfile.VISIBILITY_PUBLIC, UserProfile.VISIBILITY_PRIVATE}:
                setattr(profile, field_name, requested_visibility)

        if avatar:
            profile.avatar = avatar

        profile.save()

    return JsonResponse({"profile": profile.to_private_dict()})


@login_required
@require_http_methods(["POST"])
def support_request_api(request):
    profile = get_or_create_profile(request)
    initial_data = request.POST.copy()
    initial_data.setdefault("contact_email", request.user.email)
    form = SupportRequestForm(initial_data)

    if not form.is_valid():
        return JsonResponse({"errors": form.errors}, status=400)

    if not support_email_backend_is_ready():
        provider = getattr(settings, "SUPPORT_EMAIL_PROVIDER", "smtp")
        config_hint = (
            "Консольный режим доступен без дополнительной настройки."
            if provider == "console"
            else
            "Укажите RESEND_API_KEY и SUPPORT_FROM_EMAIL в файле .env."
            if provider == "resend"
            else "Укажите SENDGRID_API_KEY и SUPPORT_FROM_EMAIL в файле .env."
            if provider == "sendgrid"
            else "Укажите SMTP-настройки в файле .env."
        )
        return JsonResponse(
            {
                "errors": {
                    "__all__": [
                        f"Почта сервера не настроена: письма сейчас не уходят администраторам. {config_hint}"
                    ]
                }
            },
            status=503,
        )

    recipient_emails = get_support_recipient_emails()
    if not recipient_emails:
        return JsonResponse(
            {"errors": {"__all__": ["Не удалось отправить обращение: у администраторов не указаны email."]}},
            status=400,
        )

    contact_email = form.cleaned_data["contact_email"] or request.user.email
    if not contact_email:
        return JsonResponse(
            {"errors": {"contact_email": ["Укажите email, чтобы администратор мог ответить на обращение."]}},
            status=400,
        )

    display_name = profile.display_name or request.user.username
    user_full_name = f"{request.user.first_name} {request.user.last_name}".strip() or "Не указано"

    message_lines = [
        "Новое обращение в службу поддержки.",
        "",
        f"Пользователь: {display_name}",
        f"Логин: {request.user.username}",
        f"Полное имя: {user_full_name}",
        f"Email для ответа: {contact_email or 'Не указан'}",
        "",
        "Текст обращения:",
        form.cleaned_data["message"],
    ]

    try:
        send_support_email(
            subject=f"[CryptoBit Support] {form.cleaned_data['subject']}",
            body="\n".join(message_lines),
            recipient_emails=recipient_emails,
            contact_email=contact_email,
        )
    except Exception as exc:
        message = build_support_delivery_error_message(exc)
        if settings.DEBUG:
            message = f"{message} Техническая причина: {exc!s}"
        return JsonResponse(
            {"errors": {"__all__": [message]}},
            status=500,
        )

    return JsonResponse({"message": "Обращение отправлено. Администраторы скоро свяжутся с вами."})
