const fmtMoney = (n, d = 2) => n.toLocaleString('ru-RU', { minimumFractionDigits: d, maximumFractionDigits: d });

const fmtCompact = (n) => {
  if (n >= 1e12) return (n / 1e12).toFixed(2) + ' ' + '\u0442\u0440\u043b\u043d';
  if (n >= 1e9) return (n / 1e9).toFixed(2) + ' ' + '\u043c\u043b\u0440\u0434';
  if (n >= 1e6) return (n / 1e6).toFixed(2) + ' ' + '\u043c\u043b\u043d';
  if (n >= 1e3) return (n / 1e3).toFixed(2) + ' ' + '\u0442\u044b\u0441';
  return n.toFixed(2);
};

const Logo = ({ size = 28 }) => (
  <div style={{
    width: size, height: size, borderRadius: 8,
    background: 'var(--accent)', position: 'relative',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  }}>
    <div style={{
      width: size * 0.5, height: size * 0.5, borderRadius: '50%',
      border: '2.5px solid var(--surface)',
      borderLeftColor: 'transparent', borderBottomColor: 'transparent',
      transform: 'rotate(-45deg)',
    }} />
  </div>
);

const CoinBadge = ({ sym, color, size = 28 }) => (
  <div style={{
    width: size, height: size, borderRadius: '50%',
    background: color + '22', color: color,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: size * 0.38, fontWeight: 700, flexShrink: 0,
    fontFamily: "'Inter', sans-serif", letterSpacing: '-0.02em',
  }}>
    {sym.slice(0, 2)}
  </div>
);

const Card = ({ children, style, padding = 24, ...rest }) => (
  <div style={{
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', padding, boxShadow: 'var(--shadow-sm)',
    ...style,
  }} {...rest}>{children}</div>
);

const Btn = ({ variant = 'secondary', size = 'md', children, style, ...rest }) => {
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    borderRadius: size === 'sm' ? 8 : 10,
    padding: size === 'sm' ? '6px 12px' : '10px 16px',
    fontSize: size === 'sm' ? 13 : 14, fontWeight: 500,
    border: '1px solid transparent', transition: 'all .15s', whiteSpace: 'nowrap',
  };
  const variants = {
    primary: { background: 'var(--accent)', color: '#1a1814', borderColor: 'var(--accent)' },
    secondary: { background: 'var(--surface)', color: 'var(--text)', borderColor: 'var(--border-strong)' },
    ghost: { background: 'transparent', color: 'var(--text-2)', borderColor: 'transparent' },
    danger: { background: 'var(--neg-soft)', color: 'var(--neg)', borderColor: 'transparent' },
  };
  return <button style={{ ...base, ...variants[variant], ...style }} {...rest}>{children}</button>;
};

const Field = ({ icon, style, ...rest }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 10, padding: '0 12px', height: 38, ...style }}>
    {icon && <span style={{ color: 'var(--text-3)', display: 'flex' }}>{icon}</span>}
    <input {...rest} style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text)', width: '100%', height: '100%', fontSize: 14 }} />
  </div>
);

const Select = ({ value, onChange, children, style }) => (
  <select value={value} onChange={onChange} style={{
    background: 'var(--surface-2)', border: '1px solid var(--border)',
    borderRadius: 10, padding: '0 32px 0 12px', height: 38, fontSize: 14,
    color: 'var(--text)', outline: 'none', cursor: 'pointer', appearance: 'none',
    backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%239a9488' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='m6 9 6 6 6-6'/></svg>")`,
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center',
    ...style,
  }}>{children}</select>
);

const Badge = ({ tone = 'neutral', children, style }) => {
  const tones = {
    neutral: { bg: 'var(--surface-2)', fg: 'var(--text-2)' },
    pos: { bg: 'var(--pos-soft)', fg: 'var(--pos)' },
    neg: { bg: 'var(--neg-soft)', fg: 'var(--neg)' },
    accent: { bg: 'var(--accent-soft)', fg: 'var(--accent-ink)' },
  }[tone];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: tones.bg, color: tones.fg, padding: '3px 8px', borderRadius: 6, fontSize: 12, fontWeight: 500, fontVariantNumeric: 'tabular-nums', ...style }}>{children}</span>
  );
};

const SectionHead = ({ title, subtitle, right, style }) => (
  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 16, gap: 16, ...style }}>
    <div>
      <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em' }}>{title}</h2>
      {subtitle && <div style={{ color: 'var(--text-2)', fontSize: 13, marginTop: 2 }}>{subtitle}</div>}
    </div>
    {right}
  </div>
);

Object.assign(window, { fmtMoney, fmtCompact, Logo, CoinBadge, Card, Btn, Field, Select, Badge, SectionHead });

window.COINS = [];
window.HOLDINGS = [];
window.MARKET_TRADES = [];
window.USER_TRADES = [];
window.PROFILE = null;

(function() {
  const el = document.getElementById('__django_data');
  if (!el) return;

  const data = JSON.parse(el.textContent);
  window.COINS = data.coins || [];
  window.HOLDINGS = data.holdings || [];
  window.MARKET_TRADES = data.marketTrades || [];
  window.USER_TRADES = data.userTrades || [];
  window.ASSETS_FOR_FORM = data.assetsForForm || [];
  window.PROFILE = data.profile || null;
})();
