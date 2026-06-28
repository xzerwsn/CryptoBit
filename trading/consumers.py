import json
from channels.generic.websocket import AsyncWebsocketConsumer

class PriceConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name = 'crypto_prices'
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def price_update(self, event):
        await self.send(text_data=json.dumps({
            'ticker': event['ticker'],
            'price': event['price'],
            'change_24h': event.get('change_24h', 0),
            'price_24h': event.get('price_24h', event['price']),
            'high_24h': event.get('high_24h', event['price']),
            'low_24h': event.get('low_24h', event['price']),
            'volume': event.get('volume', 0)
        }))