const buildPriceGlyphs = (previousText, currentText) => {
  const maxLength = Math.max(previousText.length, currentText.length);
  const prev = previousText.padStart(maxLength, ' ');
  const next = currentText.padStart(maxLength, ' ');

  return Array.from({ length: maxLength }, (_, index) => ({
    previous: prev[index],
    current: next[index],
    changed: prev[index] !== next[index],
  }));
};

const FlipPrice = ({ value, previousValue, decimals, tone }) => {
  const currentText = fmtMoney(value, decimals);
  const previousText = previousValue === undefined ? currentText : fmtMoney(previousValue, decimals);
  const direction =
    previousValue === undefined || value === previousValue ? null : value > previousValue ? 'up' : 'down';
  const glyphs = buildPriceGlyphs(previousText, currentText);

  return (
    <span className="mono flip-price" style={{ color: tone }}>
      <span className="flip-char">$</span>
      {glyphs.map((glyph, index) => {
        if (glyph.current === ' ') {
          return (
            <span key={`empty-${index}`} className="flip-char flip-char-empty">
              0
            </span>
          );
        }

        const isDigitFlip = direction && glyph.changed && /\d/.test(glyph.previous) && /\d/.test(glyph.current);

        if (isDigitFlip) {
          const reelChars = direction === 'up' ? [glyph.previous, glyph.current] : [glyph.current, glyph.previous];

          return (
            <span key={`${index}-${glyph.previous}-${glyph.current}`} className={`flip-digit flip-digit-${direction}`}>
              <span className="flip-digit-reel">
                {reelChars.map((char, reelIndex) => (
                  <span key={`${char}-${reelIndex}`} className="flip-digit-face">
                    {char}
                  </span>
                ))}
              </span>
            </span>
          );
        }

        return (
          <span key={`${index}-${glyph.current}`} className="flip-char">
            {glyph.current}
          </span>
        );
      })}
    </span>
  );
};

const T = {
  portfolioTitle: '\u041c\u043e\u0439 \u043f\u043e\u0440\u0442\u0444\u0435\u043b\u044c',
  totalValue: '\u041e\u0431\u0449\u0430\u044f \u0441\u0442\u043e\u0438\u043c\u043e\u0441\u0442\u044c',
  allTime: '\u0437\u0430 \u0432\u0441\u0451 \u0432\u0440\u0435\u043c\u044f',
  emptyPortfolio: '\u041a\u0443\u043f\u043b\u0435\u043d\u043d\u044b\u0435 \u043a\u043e\u0438\u043d\u044b \u043f\u043e\u044f\u0432\u044f\u0442\u0441\u044f \u0437\u0434\u0435\u0441\u044c \u043f\u043e\u0441\u043b\u0435 \u043f\u0435\u0440\u0432\u043e\u0439 \u043f\u043e\u043a\u0443\u043f\u043a\u0438.',
  units: '\u0448\u0442',
  avgPrice: '\u0421\u0440. \u0446\u0435\u043d\u0430',
  sinceBuy: '\u0441 \u043f\u043e\u043a\u0443\u043f\u043a\u0438',
  tradeHistory: '\u0418\u0441\u0442\u043e\u0440\u0438\u044f \u043f\u043e\u0441\u043b\u0435\u0434\u043d\u0438\u0445 \u0441\u0434\u0435\u043b\u043e\u043a',
  market: '\u0420\u044b\u043d\u043e\u043a',
  search: '\u041f\u043e\u0438\u0441\u043a \u0430\u043a\u0442\u0438\u0432\u0430...',
  asset: '\u0410\u043a\u0442\u0438\u0432',
  price: '\u0426\u0435\u043d\u0430',
  sinceUpdate: '\u0421 \u0430\u043f\u0434\u0435\u0439\u0442\u0430',
  action: '\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u0435',
  select: '\u0412\u044b\u0431\u0440\u0430\u0442\u044c',
  clearSelection: '\u0421\u043d\u044f\u0442\u044c',
  placeOrder: '\u0420\u0410\u0417\u041c\u0415\u0421\u0422\u0418\u0422\u042c \u041e\u0420\u0414\u0415\u0420',
  buy: '\u041f\u041e\u041a\u0423\u041f\u041a\u0410',
  sell: '\u041f\u0420\u041e\u0414\u0410\u0416\u0410',
  notSelected: '\u041d\u0435 \u0432\u044b\u0431\u0440\u0430\u043d',
  amount: '\u041a\u043e\u043b\u0438\u0447\u0435\u0441\u0442\u0432\u043e',
  marketPrice: '\u0420\u044b\u043d\u043e\u0447\u043d\u0430\u044f \u0446\u0435\u043d\u0430',
  estimatedTotal: '\u0420\u0430\u0441\u0447\u0451\u0442\u043d\u0430\u044f \u0441\u0442\u043e\u0438\u043c\u043e\u0441\u0442\u044c',
  dash: '--',
  sellMissing: '\u041d\u0435\u043b\u044c\u0437\u044f \u043f\u0440\u043e\u0434\u0430\u0442\u044c \u043c\u043e\u043d\u0435\u0442\u0443, \u043a\u043e\u0442\u043e\u0440\u043e\u0439 \u043d\u0435\u0442 \u0432 \u043f\u043e\u0440\u0442\u0444\u0435\u043b\u0435.',
  sellTooMuch: '\u041d\u0435\u043b\u044c\u0437\u044f \u043f\u0440\u043e\u0434\u0430\u0442\u044c \u0431\u043e\u043b\u044c\u0448\u0435 \u043c\u043e\u043d\u0435\u0442, \u0447\u0435\u043c \u0435\u0441\u0442\u044c \u0432 \u043f\u043e\u0440\u0442\u0444\u0435\u043b\u0435.',
  orderFailed: '\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0432\u044b\u043f\u043e\u043b\u043d\u0438\u0442\u044c \u043e\u0440\u0434\u0435\u0440.',
  orderNetworkFailed: '\u041e\u0448\u0438\u0431\u043a\u0430 \u0441\u0435\u0442\u0438 \u043f\u0440\u0438 \u043e\u0442\u043f\u0440\u0430\u0432\u043a\u0435 \u043e\u0440\u0434\u0435\u0440\u0430.',
  submitting: '\u0418\u0441\u043f\u043e\u043b\u043d\u0435\u043d\u0438\u0435...',
  openPosition: '\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u043f\u043e\u0437\u0438\u0446\u0438\u044e',
  closePosition: '\u0417\u0430\u043a\u0440\u044b\u0442\u044c \u043f\u043e\u0437\u0438\u0446\u0438\u044e',
};

const Terminal = () => {
  const [coins, setCoins] = React.useState(window.COINS);
  const [holdingsState, setHoldingsState] = React.useState(window.HOLDINGS || []);
  const [tradesState, setTradesState] = React.useState(window.MARKET_TRADES || []);
  const [marketQ, setMarketQ] = React.useState('');
  const [selectedSym, setSelectedSym] = React.useState('');
  const [side, setSide] = React.useState('buy');
  const [amount, setAmount] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState('');
  const [sellTotem, setSellTotem] = React.useState(null);

  const priceToneRef = React.useRef(
    Object.fromEntries((window.COINS || []).map((coin) => [coin.sym, coin.chg >= 0 ? 'var(--pos)' : 'var(--neg)']))
  );
  const currentPricesRef = React.useRef(
    Object.fromEntries((window.COINS || []).map((coin) => [coin.sym, coin.price]))
  );
  const previousPricesRef = React.useRef(
    Object.fromEntries((window.COINS || []).map((coin) => [coin.sym, coin.price]))
  );
  const sellTotemTimerRef = React.useRef(null);

  React.useEffect(() => {
    let active = true;

    const updateMarket = async () => {
      try {
        const response = await fetch('/api/top10-market/', {
          headers: { 'X-Requested-With': 'XMLHttpRequest' },
        });
        if (!response.ok) return;

        const payload = await response.json();
        const nextCoins = Array.isArray(payload.coins) ? payload.coins : [];
        if (!active || nextCoins.length === 0) return;

        previousPricesRef.current = { ...currentPricesRef.current };
        currentPricesRef.current = Object.fromEntries(nextCoins.map((coin) => [coin.sym, coin.price]));
        window.COINS = nextCoins;
        setCoins(nextCoins);
        setSelectedSym((current) => (current && nextCoins.some((coin) => coin.sym === current) ? current : ''));
      } catch (error) {
        console.error('Market update failed:', error);
      }
    };

    updateMarket();
    const intervalId = window.setInterval(updateMarket, 2000);

    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, []);

  React.useEffect(() => {
    return () => {
      if (sellTotemTimerRef.current) {
        window.clearTimeout(sellTotemTimerRef.current);
      }
    };
  }, []);

  const coinMap = Object.fromEntries(coins.map((coin) => [coin.sym, coin]));
  const holdings = holdingsState.map((holding) => {
    const coin = coinMap[holding.sym];
    const cost = holding.avgPrice * holding.qty;
    if (!coin) {
      return { ...holding, coin: null, value: 0, cost, pnl: 0, pnlPct: 0 };
    }

    const value = coin.price * holding.qty;
    const pnl = value - cost;
    const pnlPct = cost > 0 ? (pnl / cost) * 100 : 0;
    return { ...holding, coin, value, cost, pnl, pnlPct };
  });

  const totalValue = holdings.reduce((sum, holding) => sum + holding.value, 0);
  const totalCost = holdings.reduce((sum, holding) => sum + holding.cost, 0);
  const totalPnl = totalValue - totalCost;
  const totalPnlPct = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0;

  const filteredMarket = coins.filter((coin) => {
    const query = marketQ.trim().toLowerCase();
    return !query || coin.sym.toLowerCase().includes(query) || coin.name.toLowerCase().includes(query);
  });

  const selectedCoin = coinMap[selectedSym];
  const hasSelectedCoin = Boolean(selectedCoin);
  const calcTotal = amount && selectedCoin ? (parseFloat(amount) || 0) * selectedCoin.price : 0;
  const recent = tradesState.slice(0, 10);

  const getPriceTone = (coin) => {
    const previousPrice = previousPricesRef.current[coin.sym];
    if (previousPrice === undefined) {
      const initialTone = coin.chg >= 0 ? 'var(--pos)' : 'var(--neg)';
      priceToneRef.current[coin.sym] = initialTone;
      return initialTone;
    }
    if (previousPrice === coin.price) {
      return priceToneRef.current[coin.sym] || (coin.chg >= 0 ? 'var(--pos)' : 'var(--neg)');
    }
    const nextTone = coin.price > previousPrice ? 'var(--pos)' : 'var(--neg)';
    priceToneRef.current[coin.sym] = nextTone;
    return nextTone;
  };

  const getPriceAnimationClass = (coin) => {
    const previousPrice = previousPricesRef.current[coin.sym];
    if (previousPrice === undefined || previousPrice === coin.price) {
      return '';
    }
    return coin.price > previousPrice ? 'price-tick-up' : 'price-tick-down';
  };

  const getChangeTone = (coin) => {
    const previousPrice = previousPricesRef.current[coin.sym];
    if (previousPrice === undefined) {
      return coin.chg >= 0 ? 'var(--pos)' : 'var(--neg)';
    }
    if (previousPrice === coin.price) {
      return priceToneRef.current[coin.sym] || (coin.chg >= 0 ? 'var(--pos)' : 'var(--neg)');
    }
    return coin.price > previousPrice ? 'var(--pos)' : 'var(--neg)';
  };

  const getLiveChangePct = (coin) => {
    const previousPrice = previousPricesRef.current[coin.sym];
    if (previousPrice === undefined || previousPrice <= 0 || previousPrice === coin.price) {
      return 0;
    }
    return ((coin.price - previousPrice) / previousPrice) * 100;
  };

  const startQuickSell = (holding, portion = 1) => {
    const nextAmount = holding.qty * portion;
    setSelectedSym(holding.sym);
    setSide('sell');
    setAmount(String(nextAmount));
    setSubmitError('');
  };

  const submitOrder = async () => {
    if (!hasSelectedCoin || !amount || parseFloat(amount) <= 0 || isSubmitting) return;

    const asset = (window.ASSETS_FOR_FORM || []).find((item) => item.ticker === selectedSym);
    if (!asset) return;

    const numericAmount = parseFloat(amount) || 0;
    const currentHolding = holdingsState.find((item) => item.sym === selectedSym);
    if (side === 'sell') {
      if (!currentHolding || currentHolding.qty <= 0) {
        setSubmitError(T.sellMissing);
        return;
      }

      if (numericAmount > currentHolding.qty) {
        setSubmitError(T.sellTooMuch);
        return;
      }
    }

    const estimatedSellPnl =
      side === 'sell' && currentHolding
        ? (selectedCoin.price - currentHolding.avgPrice) * numericAmount
        : null;

    const form = document.getElementById('__cw-trade-form');
    const csrfToken = form.querySelector('[name=csrfmiddlewaretoken]')?.value;
    const body = new URLSearchParams();
    body.set('asset', asset.id);
    body.set('trade_type', side === 'buy' ? 'BUY' : 'SELL');
    body.set('amount', amount);
    body.set('price', selectedCoin.price);

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRFToken': csrfToken || '',
        },
        body: body.toString(),
      });

      const payload = await response.json();
      if (!response.ok) {
        setSubmitError(T.orderFailed);
        return;
      }

      const nextHoldings = payload.holdings || [];
      const nextTrades = payload.marketTrades || [];
      const nextUserTrades = payload.userTrades || [];

      window.HOLDINGS = nextHoldings;
      window.MARKET_TRADES = nextTrades;
      window.USER_TRADES = nextUserTrades;
      setHoldingsState(nextHoldings);
      setTradesState(nextTrades);
      setAmount('');

      if (side === 'sell' && estimatedSellPnl !== null) {
        if (sellTotemTimerRef.current) {
          window.clearTimeout(sellTotemTimerRef.current);
        }

        setSellTotem({
          value: estimatedSellPnl,
          sym: selectedSym,
        });

        sellTotemTimerRef.current = window.setTimeout(() => {
          setSellTotem(null);
          sellTotemTimerRef.current = null;
        }, 2200);
      }
    } catch (error) {
      console.error('Order submit failed:', error);
      setSubmitError(T.orderNetworkFailed);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {sellTotem && (
        <div className="totem-profit-overlay">
          <div className="totem-profit-text">
            <div className="totem-profit-kicker">PROFIT</div>
            <div className={`totem-profit-value ${sellTotem.value >= 0 ? 'is-pos' : 'is-neg'}`}>
              {sellTotem.value >= 0 ? '+' : '-'}${fmtMoney(Math.abs(sellTotem.value))}
            </div>
            <div className="totem-profit-symbol">{sellTotem.sym}</div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Card padding={24}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon.wallet size={15} />
                <span style={{ fontWeight: 600, fontSize: 14 }}>{T.portfolioTitle}</span>
              </div>
              <Badge tone={totalPnl >= 0 ? 'pos' : 'neg'}>
                {totalPnl >= 0 ? '+' : '-'} {fmtMoney(Math.abs(totalPnlPct), 2)}%
              </Badge>
            </div>
            <div style={{ color: 'var(--text-3)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {T.totalValue}
            </div>
            <div className="mono" style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', marginTop: 4 }}>
              <span style={{ color: 'var(--text-3)', fontSize: 18, fontWeight: 500, marginRight: 2 }}>$</span>
              {fmtMoney(totalValue)}
            </div>
            <div
              className="mono"
              style={{ color: totalPnl >= 0 ? 'var(--pos)' : 'var(--neg)', fontSize: 13, fontWeight: 500, marginTop: 4 }}
            >
              {totalPnl >= 0 ? '+' : '-'}${fmtMoney(Math.abs(totalPnl))} {T.allTime}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 18 }}>
              {holdings.length === 0 ? (
                <div
                  style={{
                    padding: '14px 16px',
                    borderRadius: 12,
                    border: '1px solid var(--border)',
                    background: 'var(--surface-2)',
                    color: 'var(--text-2)',
                  }}
                >
                  {T.emptyPortfolio}
                </div>
              ) : (
                holdings.map((holding) => (
                  <div
                    key={holding.sym}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1.15fr 0.8fr 0.85fr 0.9fr',
                      gap: 14,
                      alignItems: 'center',
                      padding: '14px 16px',
                      borderRadius: 12,
                      border: '1px solid var(--border)',
                      background: 'var(--surface-2)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <CoinBadge sym={holding.sym} color={holding.coin?.color || 'var(--accent)'} size={30} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{holding.coin?.name || holding.sym}</div>
                        <div className="mono" style={{ color: 'var(--text-3)', fontSize: 12 }}>
                          {holding.sym} · {fmtMoney(holding.qty, holding.qty < 1 ? 4 : 2)} {T.units}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div className="mono" style={{ fontWeight: 600, fontSize: 14 }}>
                        ${fmtMoney(holding.value)}
                      </div>
                      <div className="mono" style={{ color: 'var(--text-3)', fontSize: 12 }}>
                        {T.avgPrice}: ${fmtMoney(holding.avgPrice, holding.avgPrice < 1 ? 4 : 2)}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div
                        className="mono"
                        style={{
                          fontWeight: 600,
                          fontSize: 14,
                          color: holding.pnl >= 0 ? 'var(--pos)' : 'var(--neg)',
                        }}
                      >
                        {holding.pnl >= 0 ? '+' : '-'}${fmtMoney(Math.abs(holding.pnl))}
                      </div>
                      <div
                        className="mono"
                        style={{
                          color: holding.pnl >= 0 ? 'var(--pos)' : 'var(--neg)',
                          fontSize: 12,
                        }}
                      >
                        {holding.pnl >= 0 ? '+' : ''}
                        {fmtMoney(holding.pnlPct, 2)}% {T.sinceBuy}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                      <Btn size="sm" variant="secondary" onClick={() => startQuickSell(holding, 0.5)}>
                        50%
                      </Btn>
                      <Btn size="sm" variant="danger" onClick={() => startQuickSell(holding, 1)}>
                        Sell all
                      </Btn>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card padding={24}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: 'var(--pos)',
                  boxShadow: '0 0 0 3px var(--pos-soft)',
                }}
              />
              <span style={{ fontWeight: 600, fontSize: 14 }}>{T.tradeHistory}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {recent.map((trade, index) => (
                <div
                  key={trade.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '52px 60px 1fr 1fr',
                    gap: 10,
                    padding: '9px 0',
                    borderTop: index === 0 ? 'none' : '1px solid var(--border)',
                    alignItems: 'center',
                    fontSize: 12,
                  }}
                >
                  <span className="mono" style={{ color: 'var(--text-3)' }}>
                    {new Date(trade.date).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      color: trade.side === 'buy' ? 'var(--pos)' : 'var(--neg)',
                    }}
                  >
                    {trade.side === 'buy' ? 'BUY' : 'SELL'}
                  </span>
                  <span
                    className="mono"
                    style={{ color: trade.side === 'buy' ? 'var(--pos)' : 'var(--neg)', fontWeight: 500 }}
                  >
                    {trade.sym} · ${fmtMoney(trade.price, trade.price < 1 ? 4 : 2)}
                  </span>
                  <span className="mono" style={{ textAlign: 'right', fontWeight: 500 }}>
                    ${fmtMoney(trade.total)}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Card padding={0} style={{ display: 'flex', flexDirection: 'column', height: 488 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon.zap size={15} />
                <span style={{ fontWeight: 600, fontSize: 14 }}>{T.market}</span>
                <Badge tone="pos" style={{ marginLeft: 6 }}>
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: 'var(--pos)',
                      display: 'inline-block',
                      marginRight: 6,
                      animation: 'cw-pulse 1.6s infinite',
                    }}
                  />
                  Live
                </Badge>
              </div>
              <Field
                icon={<Icon.search size={14} />}
                placeholder={T.search}
                value={marketQ}
                onChange={(e) => setMarketQ(e.target.value)}
                style={{ width: 220, height: 34 }}
              />
            </div>

            <div className="market-scroll-area" style={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ background: 'var(--surface-2)' }}>
                    <th style={{ position: 'sticky', top: 0, zIndex: 5, background: 'var(--surface-2)', padding: '12px 14px 12px 20px', textAlign: 'left', fontWeight: 500, fontSize: 12, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{T.asset}</th>
                    <th style={{ position: 'sticky', top: 0, zIndex: 5, background: 'var(--surface-2)', padding: '12px 14px', textAlign: 'right', fontWeight: 500, fontSize: 12, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{T.price}</th>
                    <th style={{ position: 'sticky', top: 0, zIndex: 5, background: 'var(--surface-2)', padding: '12px 14px', textAlign: 'right', fontWeight: 500, fontSize: 12, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{T.sinceUpdate}</th>
                    <th style={{ position: 'sticky', top: 0, zIndex: 5, background: 'var(--surface-2)', padding: '12px 20px 12px 14px', textAlign: 'right', fontWeight: 500, fontSize: 12, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{T.action}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMarket.map((coin) => {
                    const liveChangePct = getLiveChangePct(coin);

                    return (
                      <tr
                        key={coin.sym}
                        data-symbol={coin.sym}
                        className="market-row"
                        onClick={() => setSelectedSym(coin.sym)}
                        style={{
                          borderTop: '1px solid var(--border)',
                          background: selectedSym === coin.sym ? 'var(--accent-soft)' : 'transparent',
                          cursor: 'pointer',
                        }}
                      >
                        <td style={{ padding: '14px 14px 14px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <CoinBadge sym={coin.sym} color={coin.color} size={24} />
                            <div>
                              <div style={{ fontWeight: 500, fontSize: 13 }}>{coin.name}</div>
                              <div className="mono" style={{ color: 'var(--text-3)', fontSize: 11 }}>
                                {coin.sym}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '14px', textAlign: 'right' }}>
                          <span
                            className={`price-value ${getPriceAnimationClass(coin)}`.trim()}
                            style={{ fontWeight: 500 }}
                          >
                            <FlipPrice
                              value={coin.price}
                              previousValue={previousPricesRef.current[coin.sym]}
                              decimals={coin.price < 1 ? 6 : 2}
                              tone={getPriceTone(coin)}
                            />
                          </span>
                        </td>
                        <td style={{ padding: '14px', textAlign: 'right' }}>
                          <span className="mono" data-change={coin.sym} style={{ color: getChangeTone(coin), fontSize: 13, fontWeight: 500 }}>
                            {liveChangePct >= 0 ? '+' : ''}
                            {liveChangePct.toFixed(2)}%
                          </span>
                        </td>
                        <td style={{ padding: '14px 20px 14px 14px', textAlign: 'right' }}>
                          <Btn
                            variant={selectedSym === coin.sym ? 'primary' : 'secondary'}
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSym((current) => (current === coin.sym ? '' : coin.sym));
                            }}
                          >
                            {selectedSym === coin.sym ? T.clearSelection : T.select}
                          </Btn>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          <Card padding={24}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
              <Icon.plus size={16} />
              <span style={{ fontWeight: 600, fontSize: 14, letterSpacing: '0.02em' }}>{T.placeOrder}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, background: 'var(--surface-2)', padding: 4, borderRadius: 10, border: '1px solid var(--border)', marginBottom: 14 }}>
              {['buy', 'sell'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setSide(mode)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 7,
                    background: side === mode ? (mode === 'buy' ? 'var(--pos-soft)' : 'var(--neg-soft)') : 'transparent',
                    color: side === mode ? (mode === 'buy' ? 'var(--pos)' : 'var(--neg)') : 'var(--text-2)',
                    border: 'none',
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                  }}
                >
                  {mode === 'buy' ? T.buy : T.sell}
                </button>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 10, marginBottom: 14 }}>
              <div>
                <div style={{ color: 'var(--text-3)', fontSize: 11, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 6, fontWeight: 500 }}>{T.asset}</div>
                <Select value={selectedSym} onChange={(e) => setSelectedSym(e.target.value)} style={{ width: '100%' }}>
                  <option value="">{T.notSelected}</option>
                  {coins.map((coin) => (
                    <option
                      key={coin.sym}
                      value={coin.sym}
                      disabled={side === 'sell' && !holdingsState.some((holding) => holding.sym === coin.sym)}
                    >
                      {coin.sym} - {coin.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <div style={{ color: 'var(--text-3)', fontSize: 11, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 6, fontWeight: 500 }}>{T.amount}</div>
                <Field placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ''))} style={{ height: 38 }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '14px 16px', borderRadius: 10, background: 'var(--surface-2)', border: '1px solid var(--border)', marginBottom: 16 }}>
              <div>
                <div style={{ color: 'var(--text-3)', fontSize: 11, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{T.marketPrice}</div>
                <div className="mono" style={{ fontSize: 16, fontWeight: 500, marginTop: 3 }}>
                  {hasSelectedCoin ? `$${fmtMoney(selectedCoin.price, selectedCoin.price < 1 ? 4 : 2)}` : T.dash}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: 'var(--text-3)', fontSize: 11, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{T.estimatedTotal}</div>
                <div className="mono" style={{ fontSize: 16, fontWeight: 500, marginTop: 3 }}>
                  {hasSelectedCoin ? `$${fmtMoney(calcTotal)}` : T.dash}
                </div>
              </div>
            </div>

            {submitError && (
              <div
                style={{
                  marginBottom: 12,
                  padding: '10px 12px',
                  borderRadius: 10,
                  background: 'var(--neg-soft)',
                  color: 'var(--neg)',
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                {submitError}
              </div>
            )}

            <Btn
              variant="primary"
              onClick={submitOrder}
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '14px 20px',
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                background: side === 'buy' ? 'var(--pos)' : 'var(--neg)',
                borderColor: side === 'buy' ? 'var(--pos)' : 'var(--neg)',
                color: '#fff',
                opacity: hasSelectedCoin && !isSubmitting ? 1 : 0.5,
                pointerEvents: hasSelectedCoin && !isSubmitting ? 'auto' : 'none',
              }}
            >
              {isSubmitting ? T.submitting : side === 'buy' ? T.openPosition : T.closePosition}
              {hasSelectedCoin ? ` · ${selectedSym}` : ''}
            </Btn>
          </Card>
        </div>
      </div>
    </>
  );
};

window.Terminal = Terminal;
