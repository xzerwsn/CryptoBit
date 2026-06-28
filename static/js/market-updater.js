// Market data updater
class MarketUpdater {
    constructor(wsManager) {
        this.wsManager = wsManager;
        this.prices = {};
        this.previousPrices = {};
        this.changes = {};
        this.basePrices24h = {};
        this.init();
    }
    
    init() {
        this.wsManager.on('message', (data) => {
            this.handlePriceUpdate(data);
        });
        
        this.wsManager.on('connected', () => {
            this.showConnectionStatus(true);
        });
        
        this.wsManager.on('disconnected', () => {
            this.showConnectionStatus(false);
        });
        
        this.loadInitialData();
        this.setupEventListeners();
    }
    
    loadInitialData() {
        const djangoData = document.getElementById('__django_data');
        if (djangoData) {
            try {
                const data = JSON.parse(djangoData.textContent);
                if (data.coins) {
                    data.coins.forEach(coin => {
                        this.prices[coin.sym] = coin.price;
                        this.basePrices24h[coin.sym] = coin.price_24h || coin.price;
                        this.changes[coin.sym] = coin.chg;
                    });
                }
            } catch (e) {
                console.error('Error parsing initial data:', e);
            }
        }
    }
    
    handlePriceUpdate(data) {
        const { ticker, price, change_24h } = data;
        const symbol = ticker.toUpperCase();
        
        const oldPrice = this.prices[symbol] || price;
        this.previousPrices[symbol] = oldPrice;
        this.prices[symbol] = parseFloat(price);
        
        const changePercent = change_24h !== undefined ? change_24h : 
            ((price - (this.basePrices24h[symbol] || oldPrice)) / (this.basePrices24h[symbol] || oldPrice)) * 100;
        this.changes[symbol] = changePercent;
        
        this.updatePriceDisplay(symbol, price);
        this.updateChangeDisplay(symbol, changePercent);
        this.animatePriceChange(symbol, oldPrice, price);
        
        window.dispatchEvent(new CustomEvent('price-updated', {
            detail: { symbol, price, changePercent }
        }));
    }
    
    updatePriceDisplay(symbol, price) {
        const priceElements = document.querySelectorAll(`[data-symbol="${symbol}"] .price-value`);
        priceElements.forEach(el => {
            el.textContent = `$${price < 1 ? price.toFixed(6) : price.toFixed(2)}`;
        });
    }
    
    updateChangeDisplay(symbol, changePercent) {
        const changeElements = document.querySelectorAll(`[data-change="${symbol}"]`);
        changeElements.forEach(el => {
            el.textContent = `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%`;
            el.style.color = changePercent >= 0 ? 'var(--pos)' : 'var(--neg)';
            el.classList.add('change-updated');
            setTimeout(() => el.classList.remove('change-updated'), 500);
        });
    }
    
    animatePriceChange(symbol, oldPrice, newPrice) {
        const rows = document.querySelectorAll(`[data-symbol="${symbol}"]`);
        rows.forEach(row => {
            row.classList.remove('price-flash-up', 'price-flash-down');
            if (newPrice > oldPrice) {
                row.classList.add('price-flash-up');
            } else if (newPrice < oldPrice) {
                row.classList.add('price-flash-down');
            }
            setTimeout(() => {
                row.classList.remove('price-flash-up', 'price-flash-down');
            }, 1500);
        });
    }
    
    showConnectionStatus(connected) {
        let statusDiv = document.getElementById('ws-status');
        if (!statusDiv) {
            statusDiv = document.createElement('div');
            statusDiv.id = 'ws-status';
            document.body.appendChild(statusDiv);
        }
        statusDiv.innerHTML = `
            <span style="width: 8px; height: 8px; border-radius: 50%; background: ${connected ? '#28a745' : '#dc3545'}; animation: ${connected ? 'pulse-green 2s infinite' : 'none'};"></span>
            <span style="color: var(--text-2);">${connected ? 'Live ������' : '���������������...'}</span>
        `;
    }
    
    setupEventListeners() {
        window.addEventListener('price-updated', (e) => {
            const { symbol, price, changePercent } = e.detail;
            if (window.COINS) {
                const coin = window.COINS.find(c => c.sym === symbol);
                if (coin) {
                    coin.price = price;
                    coin.chg = changePercent;
                }
            }
        });
    }
}

export default MarketUpdater;