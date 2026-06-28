from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("trading", "0004_trade_user"),
    ]

    operations = [
        migrations.AddIndex(
            model_name="pricehistory",
            index=models.Index(fields=["asset", "-date"], name="price_asset_dt_idx"),
        ),
        migrations.AddConstraint(
            model_name="pricehistory",
            constraint=models.CheckConstraint(condition=models.Q(volume__gte=0), name="price_volume_gte_0"),
        ),
        migrations.AddIndex(
            model_name="trade",
            index=models.Index(fields=["user", "-timestamp"], name="trade_user_ts_idx"),
        ),
        migrations.AddIndex(
            model_name="trade",
            index=models.Index(fields=["asset", "-timestamp"], name="trade_asset_ts_idx"),
        ),
        migrations.AddIndex(
            model_name="trade",
            index=models.Index(fields=["-timestamp"], name="trade_ts_idx"),
        ),
        migrations.AddConstraint(
            model_name="trade",
            constraint=models.CheckConstraint(condition=models.Q(amount__gt=0), name="trade_amount_gt_0"),
        ),
    ]
