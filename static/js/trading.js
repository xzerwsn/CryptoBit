const TradingTerminal = {
    prices: {},
    tickerToIdMap: {},

    init() {
        this.loadPrices();
        this.buildTickerMap();
        this.initEventListeners();
        this.calculateTotal();
        console.log("Terminal ready.");
    },

    loadPrices() {
        const pricesElement = document.getElementById('assets-prices');
        if (pricesElement) {
            try {
                this.prices = JSON.parse(pricesElement.textContent);
            } catch (e) { console.error("Price load error:", e); }
        }
    },

    buildTickerMap() {
        const assetSelect = document.querySelector('select[name="asset"]');
        if (!assetSelect) return;
        for (let option of assetSelect.options) {
            if (option.value) {
                const tickerMatch = option.text.match(/\(([^)]+)\)/);
                if (tickerMatch) this.tickerToIdMap[tickerMatch[1].toUpperCase()] = option.value;
            }
        }
    },

    initEventListeners() {
        const assetSelect = document.querySelector('select[name="asset"]');
        const amountInput = document.getElementById('input_amount');
        if (assetSelect) assetSelect.addEventListener('change', () => this.calculateTotal());
        if (amountInput) amountInput.addEventListener('input', () => this.calculateTotal());
    },

    calculateTotal() {
        const assetSelect = document.querySelector('select[name="asset"]');
        const amountInput = document.getElementById('input_amount');
        const totalInput = document.getElementById('input_total');
        
        if (!assetSelect || !amountInput || !totalInput) return;

        const selectedId = assetSelect.value;
        const price = parseFloat(this.prices[selectedId]) || 0;
        const amount = parseFloat(amountInput.value) || 0;
        totalInput.value = (amount * price).toFixed(2);
    }
};

document.addEventListener('DOMContentLoaded', () => TradingTerminal.init());

// WebSocket
const priceSocket = new WebSocket('ws://' + window.location.host + '/ws/prices/');

priceSocket.onmessage = function(e) {
    const data = JSON.parse(e.data);
    const ticker = data.ticker.toUpperCase();
    const newPrice = parseFloat(data.price);
    
    // 1. ���������� ���� � ������� ����� (������ ��������)
    const priceElem = document.getElementById(`price-${ticker}`);
    if (priceElem) {
        // ��������� ������ ����, ������ $ � �������
        const oldText = priceElem.innerText.replace(/[$,\s]/g, '');
        const oldPrice = parseFloat(oldText) || 0;

        // ��������� ����� (5 ������)
        priceElem.innerText = `$${newPrice.toFixed(5)}`;

        if (newPrice !== oldPrice) {
            // ���������: ���������� transition ��� ���������� ����� �����
            priceElem.style.transition = "none";
            priceElem.style.color = newPrice > oldPrice ? "#28a745" : "#dc3545";

            // void offsetHeight � �������������� reflow: ������� ��������� ����� ����
            // �� ����, ��� setTimeout �������� �������� ��������
            void priceElem.offsetHeight;

            // ����� 800�� ������ ���������� ������� ����
            setTimeout(() => {
                priceElem.style.transition = "color 1s ease";
                priceElem.style.color = "#0dcaf0";
            }, 800);
        }
    }
        
    // 2. ���������� ������������ � �����
    const assetId = TradingTerminal.tickerToIdMap[ticker];
    if (assetId) {
        TradingTerminal.prices[assetId] = newPrice.toFixed(5);
        TradingTerminal.calculateTotal();
    }

    // 3. ���������� �������� (����������)
    const holdingsInput = document.getElementById(`holdings-${ticker}`);
    const avgPriceInput = document.getElementById(`avg-price-${ticker}`);
    const plContainer = document.getElementById(`pl-${ticker}`);

    // ���������, ���� �� ��� ������ � �������� ������������
    if (holdingsInput && avgPriceInput && plContainer) {
        const amount = parseFloat(holdingsInput.value);
        const avgPrice = parseFloat(avgPriceInput.value);
        
        if (avgPrice > 0) {
            const profitAbs = (newPrice - avgPrice) * amount;
            const profitPercent = ((newPrice - avgPrice) / avgPrice) * 100;

            const pElem = plContainer.querySelector('.pl-percent');
            const absElem = plContainer.querySelector('.pl-abs');

            // ��������� ������ ����� ������, ���� �������� �������
            if (pElem) {
                pElem.innerText = (profitPercent >= 0 ? "+" : "") + profitPercent.toFixed(2) + "%";
                pElem.className = `pl-percent ${profitPercent >= 0 ? 'text-success' : 'text-danger'}`;
            }
            if (absElem) {
                absElem.innerText = `($${profitAbs.toFixed(2)})`;
            }
        }
    }
};