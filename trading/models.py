from decimal import Decimal

from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models


class UserProfile(models.Model):
    VISIBILITY_PUBLIC = "public"
    VISIBILITY_PRIVATE = "private"
    VISIBILITY_CHOICES = [
        (VISIBILITY_PUBLIC, "Public"),
        (VISIBILITY_PRIVATE, "Private"),
    ]

    THEME_LIGHT = "light"
    THEME_DARK = "dark"
    THEME_CHOICES = [
        (THEME_LIGHT, "Light"),
        (THEME_DARK, "Dark"),
    ]

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="profile")
    nickname = models.CharField(max_length=80, blank=True, verbose_name="\u041f\u0441\u0435\u0432\u0434\u043e\u043d\u0438\u043c")
    phone = models.CharField(max_length=32, blank=True, verbose_name="\u0422\u0435\u043b\u0435\u0444\u043e\u043d")
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True, verbose_name="\u0410\u0432\u0430\u0442\u0430\u0440")
    bio = models.TextField(blank=True, verbose_name="\u041b\u0438\u0447\u043d\u044b\u0435 \u0434\u0430\u043d\u043d\u044b\u0435")
    email_visibility = models.CharField(
        max_length=10,
        choices=VISIBILITY_CHOICES,
        default=VISIBILITY_PRIVATE,
        verbose_name="\u0412\u0438\u0434\u0438\u043c\u043e\u0441\u0442\u044c \u043f\u043e\u0447\u0442\u044b",
    )
    phone_visibility = models.CharField(
        max_length=10,
        choices=VISIBILITY_CHOICES,
        default=VISIBILITY_PRIVATE,
        verbose_name="\u0412\u0438\u0434\u0438\u043c\u043e\u0441\u0442\u044c \u0442\u0435\u043b\u0435\u0444\u043e\u043d\u0430",
    )
    full_name_visibility = models.CharField(
        max_length=10,
        choices=VISIBILITY_CHOICES,
        default=VISIBILITY_PUBLIC,
        verbose_name="\u0412\u0438\u0434\u0438\u043c\u043e\u0441\u0442\u044c \u0438\u043c\u0435\u043d\u0438",
    )
    theme = models.CharField(
        max_length=10,
        choices=THEME_CHOICES,
        default=THEME_DARK,
        verbose_name="\u0422\u0435\u043c\u0430 \u0438\u043d\u0442\u0435\u0440\u0444\u0435\u0439\u0441\u0430",
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "\u041f\u0440\u043e\u0444\u0438\u043b\u044c \u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044f"
        verbose_name_plural = "\u041f\u0440\u043e\u0444\u0438\u043b\u0438 \u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u0435\u0439"

    def __str__(self):
        return self.display_name

    @property
    def full_name(self):
        return f"{self.user.first_name} {self.user.last_name}".strip()

    @property
    def display_name(self):
        return self.nickname or self.full_name or self.user.username

    @property
    def initials(self):
        source = self.display_name.split()
        if not source:
            return "??"
        if len(source) == 1:
            return source[0][:2].upper()
        return f"{source[0][:1]}{source[1][:1]}".upper()

    def _visible_value(self, value, visibility):
        return value if visibility == self.VISIBILITY_PUBLIC else None

    def get_role_label(self):
        group_names = list(self.user.groups.order_by("name").values_list("name", flat=True))
        if group_names:
            return ", ".join(group_names)

        if self.user.is_staff or self.user.is_superuser:
            return "\u0410\u0434\u043c\u0438\u043d\u0438\u0441\u0442\u0440\u0430\u0442\u043e\u0440"

        return "\u0422\u0440\u0435\u0439\u0434\u0435\u0440"

    def to_private_dict(self):
        is_admin = self.user.is_staff or self.user.is_superuser
        return {
            "displayName": self.display_name,
            "username": self.user.username,
            "nickname": self.nickname,
            "firstName": self.user.first_name,
            "lastName": self.user.last_name,
            "email": self.user.email,
            "phone": self.phone,
            "bio": self.bio,
            "avatarUrl": self.avatar.url if self.avatar else "",
            "initials": self.initials,
            "theme": self.theme,
            "role": self.get_role_label(),
            "isAdmin": is_admin,
            "isSuperuser": self.user.is_superuser,
            "adminUrl": "/admin/",
            "rolesAdminUrl": "/admin/auth/group/",
            "usersAdminUrl": "/admin/auth/user/",
            "visibility": {
                "email": self.email_visibility,
                "phone": self.phone_visibility,
                "fullName": self.full_name_visibility,
            },
            "publicView": self.to_public_dict(),
        }

    def to_public_dict(self):
        return {
            "displayName": self.display_name,
            "fullName": self._visible_value(self.full_name, self.full_name_visibility),
            "email": self._visible_value(self.user.email, self.email_visibility),
            "phone": self._visible_value(self.phone, self.phone_visibility),
            "bio": self.bio,
            "avatarUrl": self.avatar.url if self.avatar else "",
            "initials": self.initials,
        }


class Asset(models.Model):
    ticker = models.CharField(max_length=20, unique=True, verbose_name="\u0422\u0438\u043a\u0435\u0440")
    name = models.CharField(max_length=100, verbose_name="\u041d\u0430\u0437\u0432\u0430\u043d\u0438\u0435 \u0430\u043a\u0442\u0438\u0432\u0430")
    category = models.CharField(max_length=50, verbose_name="\u041a\u0430\u0442\u0435\u0433\u043e\u0440\u0438\u044f")
    description = models.TextField(blank=True, verbose_name="\u041e\u043f\u0438\u0441\u0430\u043d\u0438\u0435")

    def __str__(self):
        return f"{self.ticker} ({self.name})"


class PriceHistory(models.Model):
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE, related_name="prices")
    date = models.DateTimeField(verbose_name="\u0414\u0430\u0442\u0430 \u0438 \u0432\u0440\u0435\u043c\u044f")
    price_open = models.DecimalField(max_digits=18, decimal_places=6)
    price_close = models.DecimalField(max_digits=18, decimal_places=6)
    price_high = models.DecimalField(max_digits=18, decimal_places=6)
    price_low = models.DecimalField(max_digits=18, decimal_places=6)
    volume = models.BigIntegerField(verbose_name="\u041e\u0431\u044a\u0435\u043c \u0442\u043e\u0440\u0433\u043e\u0432")

    class Meta:
        ordering = ["-date"]
        verbose_name = "\u0418\u0441\u0442\u043e\u0440\u0438\u044f \u0446\u0435\u043d\u044b"
        verbose_name_plural = "\u0418\u0441\u0442\u043e\u0440\u0438\u044f \u0446\u0435\u043d"
        indexes = [
            models.Index(fields=["asset", "-date"], name="price_asset_dt_idx"),
        ]
        constraints = [
            models.CheckConstraint(condition=models.Q(volume__gte=0), name="price_volume_gte_0"),
        ]


class Trade(models.Model):
    TRADE_TYPES = [
        ("BUY", "\u041f\u043e\u043a\u0443\u043f\u043a\u0430"),
        ("SELL", "\u041f\u0440\u043e\u0434\u0430\u0436\u0430"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="trades",
        blank=True,
        null=True,
        verbose_name="\u041f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044c",
    )
    asset = models.ForeignKey(Asset, on_delete=models.PROTECT, verbose_name="\u0410\u043a\u0442\u0438\u0432")
    trade_type = models.CharField(max_length=4, choices=TRADE_TYPES, verbose_name="\u0422\u0438\u043f \u0441\u0434\u0435\u043b\u043a\u0438")
    amount = models.DecimalField(
        max_digits=14,
        decimal_places=4,
        validators=[MinValueValidator(Decimal("0.0001"))],
    )
    price = models.DecimalField(max_digits=14, decimal_places=4, verbose_name="\u0426\u0435\u043d\u0430 \u0441\u0434\u0435\u043b\u043a\u0438")
    timestamp = models.DateTimeField(auto_now_add=True, verbose_name="\u0412\u0440\u0435\u043c\u044f \u0441\u043e\u0432\u0435\u0440\u0448\u0435\u043d\u0438\u044f")

    class Meta:
        indexes = [
            models.Index(fields=["user", "-timestamp"], name="trade_user_ts_idx"),
            models.Index(fields=["asset", "-timestamp"], name="trade_asset_ts_idx"),
            models.Index(fields=["-timestamp"], name="trade_ts_idx"),
        ]
        constraints = [
            models.CheckConstraint(condition=models.Q(amount__gt=0), name="trade_amount_gt_0"),
        ]

    def __str__(self):
        return f"{self.trade_type} {self.amount} {self.asset.ticker}"
