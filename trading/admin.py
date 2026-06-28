from django.contrib import admin
from .models import Asset, PriceHistory, Trade, UserProfile

@admin.register(Asset)
class AssetAdmin(admin.ModelAdmin):
    list_display = ('ticker', 'name', 'category')
    search_fields = ('ticker', 'name')

@admin.register(PriceHistory)
class PriceHistoryAdmin(admin.ModelAdmin):
    list_display = ('asset', 'date', 'price_close', 'volume')
    list_filter = ('asset', 'date')

@admin.register(Trade)
class TradeAdmin(admin.ModelAdmin):
    list_display = ('user', 'asset', 'trade_type', 'amount', 'price', 'timestamp')
    list_filter = ('trade_type', 'asset')
    search_fields = ('user__username', 'asset__ticker', 'asset__name')


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('display_name', 'user', 'theme', 'email_visibility', 'phone_visibility', 'updated_at')
    search_fields = ('user__username', 'user__first_name', 'user__last_name', 'nickname', 'phone')
