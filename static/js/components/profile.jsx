const emptyProfile = {
  displayName: '',
  nickname: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  bio: '',
  avatarUrl: '',
  initials: '??',
  theme: 'dark',
  role: '\u0422\u0440\u0435\u0439\u0434\u0435\u0440',
  isAdmin: false,
  isSuperuser: false,
  adminUrl: '/admin/',
  rolesAdminUrl: '/admin/auth/group/',
  usersAdminUrl: '/admin/auth/user/',
  visibility: {
    email: 'private',
    phone: 'private',
    fullName: 'public',
  },
  publicView: {
    displayName: '',
    fullName: '',
    email: '',
    phone: '',
    bio: '',
    avatarUrl: '',
    initials: '??',
  },
};

const P = {
  visibleToOthers: '\u0412\u0438\u0434\u043d\u043e \u0434\u0440\u0443\u0433\u0438\u043c',
  visibleOnlyMe: '\u0422\u043e\u043b\u044c\u043a\u043e \u043c\u043d\u0435',
  unnamed: '\u0411\u0435\u0437 \u0438\u043c\u0435\u043d\u0438',
  saveFailed: '\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0441\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u043f\u0440\u043e\u0444\u0438\u043b\u044c.',
  saveSuccess: '\u041f\u0440\u043e\u0444\u0438\u043b\u044c \u0441\u043e\u0445\u0440\u0430\u043d\u0451\u043d.',
  saveNetworkFailed: '\u041e\u0448\u0438\u0431\u043a\u0430 \u0441\u0435\u0442\u0438 \u043f\u0440\u0438 \u0441\u043e\u0445\u0440\u0430\u043d\u0435\u043d\u0438\u0438 \u043f\u0440\u043e\u0444\u0438\u043b\u044f.',
  nicknameHint: '\u041f\u0441\u0435\u0432\u0434\u043e\u043d\u0438\u043c \u0431\u0443\u0434\u0435\u0442 \u043e\u0442\u043e\u0431\u0440\u0430\u0436\u0430\u0442\u044c\u0441\u044f \u0432 \u0438\u043d\u0442\u0435\u0440\u0444\u0435\u0439\u0441\u0435 \u043f\u0440\u0435\u0438\u043c\u0443\u0449\u0435\u0441\u0442\u0432\u0435\u043d\u043d\u043e.',
  nicknameEmptyHint: '\u0414\u043e\u0431\u0430\u0432\u044c\u0442\u0435 \u043f\u0441\u0435\u0432\u0434\u043e\u043d\u0438\u043c, \u0435\u0441\u043b\u0438 \u0445\u043e\u0442\u0438\u0442\u0435 \u043f\u043e\u043a\u0430\u0437\u044b\u0432\u0430\u0442\u044c \u0435\u0433\u043e \u0432\u043c\u0435\u0441\u0442\u043e \u0438\u043c\u0435\u043d\u0438 \u0438 \u0444\u0430\u043c\u0438\u043b\u0438\u0438.',
  hideEditing: '\u0421\u043a\u0440\u044b\u0442\u044c \u0440\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435',
  edit: '\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c',
  portfolioTitle: '\u041f\u043e\u0440\u0442\u0444\u0435\u043b\u044c \u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044f',
  portfolioSubtitle: '\u0421\u0432\u043e\u0434\u043a\u0430 \u043f\u043e \u0430\u043a\u0442\u0438\u0432\u0430\u043c \u0438 \u0442\u0435\u043a\u0443\u0449\u0435\u0439 \u0434\u043e\u0445\u043e\u0434\u043d\u043e\u0441\u0442\u0438.',
  portfolioEmpty: '\u0417\u0434\u0435\u0441\u044c \u043f\u043e\u044f\u0432\u0438\u0442\u0441\u044f \u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f \u043e \u043f\u043e\u0440\u0442\u0444\u0435\u043b\u0435 \u043f\u043e\u0441\u043b\u0435 \u043f\u0435\u0440\u0432\u044b\u0445 \u043f\u043e\u043a\u0443\u043f\u043e\u043a.',
  portfolioTotal: '\u041e\u0431\u0449\u0430\u044f \u0441\u0442\u043e\u0438\u043c\u043e\u0441\u0442\u044c \u043f\u043e\u0440\u0442\u0444\u0435\u043b\u044f',
  portfolioAllTime: '\u0437\u0430 \u0432\u0441\u0451 \u0432\u0440\u0435\u043c\u044f',
  positionYield: '\u0414\u043e\u0445\u043e\u0434\u043d\u043e\u0441\u0442\u044c \u043f\u043e \u043f\u043e\u0437\u0438\u0446\u0438\u044f\u043c',
  personalDataTitle: '\u041b\u0438\u0447\u043d\u044b\u0435 \u0434\u0430\u043d\u043d\u044b\u0435',
  personalDataSubtitle: '\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u0443\u0439\u0442\u0435 \u043e\u0441\u043d\u043e\u0432\u043d\u044b\u0435 \u0434\u0430\u043d\u043d\u044b\u0435 \u043f\u0440\u043e\u0444\u0438\u043b\u044f \u0438 \u043a\u043e\u043d\u0442\u0430\u043a\u0442\u044b.',
  firstName: '\u0418\u043c\u044f',
  lastName: '\u0424\u0430\u043c\u0438\u043b\u0438\u044f',
  nickname: '\u041f\u0441\u0435\u0432\u0434\u043e\u043d\u0438\u043c',
  nicknamePlaceholder: '\u041d\u0430\u043f\u0440\u0438\u043c\u0435\u0440, CryptoFox',
  email: '\u041f\u043e\u0447\u0442\u0430',
  phone: '\u0422\u0435\u043b\u0435\u0444\u043e\u043d',
  bio: '\u041b\u0438\u0447\u043d\u044b\u0435 \u0434\u0430\u043d\u043d\u044b\u0435',
  uploadAvatar: '\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044c \u0430\u0432\u0430\u0442\u0430\u0440',
  visibilityTitle: '\u0412\u0438\u0434\u0438\u043c\u043e\u0441\u0442\u044c \u0434\u0430\u043d\u043d\u044b\u0445',
  visibilitySubtitle: '\u041d\u0430\u0441\u0442\u0440\u043e\u0439\u0442\u0435, \u0447\u0442\u043e \u0441\u043c\u043e\u0433\u0443\u0442 \u0432\u0438\u0434\u0435\u0442\u044c \u0434\u0440\u0443\u0433\u0438\u0435 \u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u0438.',
  fullNameTitle: '\u0418\u043c\u044f \u0438 \u0444\u0430\u043c\u0438\u043b\u0438\u044f',
  fullNameDescription: '\u041c\u043e\u0436\u043d\u043e \u043e\u0441\u0442\u0430\u0432\u0438\u0442\u044c \u0440\u0435\u0430\u043b\u044c\u043d\u043e\u0435 \u0438\u043c\u044f \u0441\u043a\u0440\u044b\u0442\u044b\u043c, \u0435\u0441\u043b\u0438 \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u0435\u0442\u0435 \u043f\u0441\u0435\u0432\u0434\u043e\u043d\u0438\u043c.',
  emailDescription: '\u041d\u0430\u043f\u0440\u0438\u043c\u0435\u0440, \u0441\u043a\u0440\u044b\u0442\u044c email \u043e\u0442 \u043e\u0441\u0442\u0430\u043b\u044c\u043d\u044b\u0445 \u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u0435\u0439.',
  phoneDescription: '\u041d\u043e\u043c\u0435\u0440 \u043c\u043e\u0436\u043d\u043e \u0441\u0434\u0435\u043b\u0430\u0442\u044c \u0434\u043e\u0441\u0442\u0443\u043f\u043d\u044b\u043c \u0442\u043e\u043b\u044c\u043a\u043e \u0432\u0430\u043c.',
  historyTitle: '\u0418\u0441\u0442\u043e\u0440\u0438\u044f \u0442\u0432\u043e\u0438\u0445 \u0441\u0434\u0435\u043b\u043e\u043a',
  historySubtitle: '\u041f\u043e\u0441\u043b\u0435\u0434\u043d\u0438\u0435 \u043b\u0438\u0447\u043d\u044b\u0435 \u0441\u0434\u0435\u043b\u043a\u0438 \u043f\u043e \u0430\u043a\u043a\u0430\u0443\u043d\u0442\u0443.',
  historyEmpty: '\u0421\u0434\u0435\u043b\u043a\u0438 \u043f\u043e\u044f\u0432\u044f\u0442\u0441\u044f \u0437\u0434\u0435\u0441\u044c \u043f\u043e\u0441\u043b\u0435 \u043f\u0435\u0440\u0432\u043e\u0439 \u043e\u043f\u0435\u0440\u0430\u0446\u0438\u0438.',
  units: '\u0448\u0442',
  themeTitle: '\u0422\u0435\u043c\u0430',
  themeSubtitle: '\u0421\u0432\u0435\u0442\u043b\u0430\u044f \u0438 \u0442\u0451\u043c\u043d\u0430\u044f \u0442\u0435\u043c\u0430 \u043f\u0440\u0438\u043c\u0435\u043d\u044f\u044e\u0442\u0441\u044f \u0441\u0440\u0430\u0437\u0443.',
  light: '\u0421\u0432\u0435\u0442\u043b\u0430\u044f',
  dark: '\u0422\u0451\u043c\u043d\u0430\u044f',
  publicPreviewTitle: '\u041f\u0443\u0431\u043b\u0438\u0447\u043d\u043e\u0435 \u043f\u0440\u0435\u0432\u044c\u044e',
  publicPreviewSubtitle: '\u0422\u0430\u043a \u043f\u0440\u043e\u0444\u0438\u043b\u044c \u0443\u0432\u0438\u0434\u044f\u0442 \u0434\u0440\u0443\u0433\u0438\u0435 \u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u0438.',
  hiddenEmail: '\u0421\u043a\u0440\u044b\u0442\u0430',
  hiddenPhone: '\u0421\u043a\u0440\u044b\u0442',
  emptyBio: '\u041f\u043e\u043a\u0430 \u043d\u0438\u0447\u0435\u0433\u043e \u043d\u0435 \u0434\u043e\u0431\u0430\u0432\u043b\u0435\u043d\u043e.',
  saveProfile: '\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u043f\u0440\u043e\u0444\u0438\u043b\u044c',
  saving: '\u0421\u043e\u0445\u0440\u0430\u043d\u0435\u043d\u0438\u0435...',
};

const visibilityOptions = [
  { value: 'public', label: P.visibleToOthers },
  { value: 'private', label: P.visibleOnlyMe },
];

const computeInitials = (value) => {
  const tokens = String(value || '').trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return '??';
  if (tokens.length === 1) return tokens[0].slice(0, 2).toUpperCase();
  return `${tokens[0][0]}${tokens[1][0]}`.toUpperCase();
};

const buildPublicPreview = (form, avatarPreview) => {
  const fullName = `${form.firstName || ''} ${form.lastName || ''}`.trim();
  const displayName = (form.nickname || '').trim() || fullName || P.unnamed;
  return {
    displayName,
    fullName: form.visibility.fullName === 'public' ? fullName : '',
    email: form.visibility.email === 'public' ? (form.email || '').trim() : '',
    phone: form.visibility.phone === 'public' ? (form.phone || '').trim() : '',
    bio: (form.bio || '').trim(),
    avatarUrl: avatarPreview || form.avatarUrl || '',
    initials: computeInitials(displayName),
  };
};

const Profile = ({ profile, onProfileChange, theme, onThemeChange, isCompact }) => {
  const [form, setForm] = React.useState(profile || emptyProfile);
  const [avatarFile, setAvatarFile] = React.useState(null);
  const [avatarPreview, setAvatarPreview] = React.useState((profile && profile.avatarUrl) || '');
  const [status, setStatus] = React.useState('');
  const [error, setError] = React.useState('');
  const [isSaving, setIsSaving] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const fileInputRef = React.useRef(null);
  const recentTrades = (window.USER_TRADES || []).slice(0, 8);
  const holdings = window.HOLDINGS || [];
  const coins = window.COINS || [];
  const coinMap = Object.fromEntries(coins.map((coin) => [coin.sym, coin]));

  React.useEffect(() => {
    const nextProfile = profile || emptyProfile;
    setForm(nextProfile);
    setAvatarPreview(nextProfile.avatarUrl || '');
    setAvatarFile(null);
    setIsEditing(false);
  }, [profile]);

  const updateField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const updateVisibility = (key, value) => {
    setForm((current) => ({
      ...current,
      visibility: {
        ...current.visibility,
        [key]: value,
      },
    }));
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setStatus('');
    setError('');

    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value || '';
    const body = new FormData();
    body.set('firstName', form.firstName || '');
    body.set('lastName', form.lastName || '');
    body.set('email', form.email || '');
    body.set('phone', form.phone || '');
    body.set('nickname', form.nickname || '');
    body.set('bio', form.bio || '');
    body.set('theme', theme);
    body.set('emailVisibility', form.visibility.email);
    body.set('phoneVisibility', form.visibility.phone);
    body.set('fullNameVisibility', form.visibility.fullName);
    if (avatarFile) body.set('avatar', avatarFile);

    try {
      const response = await fetch('/api/profile/', {
        method: 'POST',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRFToken': csrfToken,
        },
        body,
      });
      const payload = await response.json();

      if (!response.ok) {
        setError(P.saveFailed);
        return;
      }

      onProfileChange(payload.profile);
      setStatus(P.saveSuccess);
      setIsEditing(false);
    } catch (saveError) {
      console.error('Profile save failed:', saveError);
      setError(P.saveNetworkFailed);
    } finally {
      setIsSaving(false);
    }
  };

  const publicPreview = buildPublicPreview(form, avatarPreview);
  const displayName =
    (form.nickname || '').trim() ||
    `${form.firstName || ''} ${form.lastName || ''}`.trim() ||
    P.unnamed;

  const portfolioPositions = holdings
    .map((holding) => {
      const coin = coinMap[holding.sym];
      const marketPrice = coin ? coin.price : 0;
      const qty = holding.qty || 0;
      const avgPrice = holding.avgPrice || 0;
      const value = qty * marketPrice;
      const cost = qty * avgPrice;
      const pnl = value - cost;
      const pnlPct = cost > 0 ? (pnl / cost) * 100 : 0;

      return { ...holding, coin, value, cost, pnl, pnlPct };
    })
    .filter((position) => position.value > 0)
    .sort((a, b) => b.value - a.value);

  const portfolioValue = portfolioPositions.reduce((sum, position) => sum + position.value, 0);
  const portfolioCost = portfolioPositions.reduce((sum, position) => sum + position.cost, 0);
  const portfolioPnl = portfolioValue - portfolioCost;
  const portfolioPnlPct = portfolioCost > 0 ? (portfolioPnl / portfolioCost) * 100 : 0;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: isCompact ? '1fr' : 'minmax(0, 1.45fr) minmax(360px, 1fr)', gap: 20, alignItems: 'start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Card padding={28}>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ width: 96, height: 96, borderRadius: '50%', overflow: 'hidden', background: 'linear-gradient(135deg, var(--accent) 0%, oklch(0.65 0.14 45) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a1814', fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', flexShrink: 0 }}>
              <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', border: '3px solid var(--accent)', boxShadow: '0 0 0 4px color-mix(in srgb, var(--accent) 18%, transparent), 0 0 24px color-mix(in srgb, var(--accent) 28%, transparent)' }}>
                {avatarPreview ? (
                  <img src={avatarPreview} alt={displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span>{computeInitials(displayName)}</span>
                  </div>
                )}
              </div>
            </div>

            <div style={{ flex: 1, minWidth: 260 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600, letterSpacing: '-0.01em' }}>{displayName}</h1>
                <Badge tone="accent">{form.role || '\u0422\u0440\u0435\u0439\u0434\u0435\u0440'}</Badge>
              </div>
              <div style={{ color: 'var(--text-2)', fontSize: 14, marginBottom: 10 }}>
                {(form.nickname || '').trim() ? P.nicknameHint : P.nicknameEmptyHint}
              </div>
              <Btn variant="secondary" onClick={() => setIsEditing((current) => !current)}>
                <Icon.settings size={15} />
                {isEditing ? P.hideEditing : P.edit}
              </Btn>
            </div>
          </div>
        </Card>

        <Card padding={24}>
          <SectionHead title={P.portfolioTitle} subtitle={P.portfolioSubtitle} />
          {portfolioPositions.length === 0 ? (
            <div style={{ padding: '16px 18px', borderRadius: 14, background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-2)' }}>
              {P.portfolioEmpty}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: isCompact ? '1fr' : 'minmax(0, 1.45fr) minmax(280px, 0.95fr)', gap: 16 }}>
              <div style={{ padding: '18px 18px 16px', borderRadius: 16, background: 'linear-gradient(180deg, color-mix(in srgb, var(--surface-2) 92%, var(--accent) 8%) 0%, var(--surface-2) 100%)', border: '1px solid var(--border)' }}>
                <div style={{ color: 'var(--text-3)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {P.portfolioTotal}
                </div>
                <div className="mono" style={{ fontSize: isCompact ? 28 : 34, fontWeight: 700, letterSpacing: '-0.03em', marginTop: 8 }}>
                  ${fmtMoney(portfolioValue)}
                </div>
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center', marginTop: 8 }}>
                  <div className="mono" style={{ color: portfolioPnl >= 0 ? 'var(--pos)' : 'var(--neg)', fontWeight: 600 }}>
                    {portfolioPnl >= 0 ? '+' : '-'} {fmtMoney(Math.abs(portfolioPnlPct), 2)}%
                  </div>
                  <div className="mono" style={{ color: portfolioPnl >= 0 ? 'var(--pos)' : 'var(--neg)', fontSize: 13 }}>
                    {portfolioPnl >= 0 ? '+' : '-'}${fmtMoney(Math.abs(portfolioPnl))} {P.portfolioAllTime}
                  </div>
                </div>

                <div style={{ marginTop: 18 }}>
                  <div style={{ display: 'flex', height: 10, borderRadius: 999, overflow: 'hidden', background: 'var(--bg)' }}>
                    {portfolioPositions.map((position) => {
                      const width = portfolioValue > 0 ? `${(position.value / portfolioValue) * 100}%` : '0%';
                      const color = position.coin?.color || 'var(--accent)';
                      return <div key={position.sym} style={{ width, background: color }} />;
                    })}
                  </div>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 12 }}>
                    {portfolioPositions.map((position) => {
                      const share = portfolioValue > 0 ? (position.value / portfolioValue) * 100 : 0;
                      const color = position.coin?.color || 'var(--accent)';
                      return (
                        <div key={position.sym} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-2)', fontSize: 12 }}>
                          <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block' }} />
                          <span className="mono" style={{ color: 'var(--text)' }}>{position.sym}</span>
                          <span>{fmtMoney(share, 1)}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div style={{ padding: '18px', borderRadius: 16, background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                <div style={{ color: 'var(--text-3)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
                  {P.positionYield}
                </div>
                <div style={{ display: 'grid', gap: 12 }}>
                  {portfolioPositions.slice(0, 5).map((position) => (
                    <div key={position.sym} style={{ display: 'grid', gridTemplateColumns: '36px 1fr auto', gap: 10, alignItems: 'center' }}>
                      <CoinBadge sym={position.sym} color={position.coin?.color || 'var(--accent)'} size={32} />
                      <div>
                        <div className="mono" style={{ fontWeight: 700 }}>{position.sym}</div>
                        <div style={{ color: 'var(--text-2)', fontSize: 12 }}>
                          {fmtMoney(position.qty, position.qty < 1 ? 4 : 2)} {position.sym}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div className="mono" style={{ fontWeight: 700 }}>${fmtMoney(position.value)}</div>
                        <div className="mono" style={{ color: position.pnl >= 0 ? 'var(--pos)' : 'var(--neg)', fontSize: 12 }}>
                          {position.pnl >= 0 ? '+' : ''}{fmtMoney(position.pnlPct, 2)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Card>

        {isEditing ? (
          <Card padding={28}>
            <SectionHead title={P.personalDataTitle} subtitle={P.personalDataSubtitle} />
            <div style={{ display: 'grid', gridTemplateColumns: isCompact ? '1fr' : '1fr 1fr', gap: 14 }}>
              <div>
                <div style={{ color: 'var(--text-3)', fontSize: 11, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 6 }}>{P.firstName}</div>
                <Field value={form.firstName || ''} onChange={(e) => updateField('firstName', e.target.value)} />
              </div>
              <div>
                <div style={{ color: 'var(--text-3)', fontSize: 11, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 6 }}>{P.lastName}</div>
                <Field value={form.lastName || ''} onChange={(e) => updateField('lastName', e.target.value)} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ color: 'var(--text-3)', fontSize: 11, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 6 }}>{P.nickname}</div>
                <Field value={form.nickname || ''} onChange={(e) => updateField('nickname', e.target.value)} placeholder={P.nicknamePlaceholder} />
              </div>
              <div>
                <div style={{ color: 'var(--text-3)', fontSize: 11, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 6 }}>{P.email}</div>
                <Field icon={<Icon.mail size={14} />} type="email" value={form.email || ''} onChange={(e) => updateField('email', e.target.value)} />
              </div>
              <div>
                <div style={{ color: 'var(--text-3)', fontSize: 11, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 6 }}>{P.phone}</div>
                <Field icon={<Icon.phone size={14} />} value={form.phone || ''} onChange={(e) => updateField('phone', e.target.value)} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ color: 'var(--text-3)', fontSize: 11, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 6 }}>{P.bio}</div>
                <textarea value={form.bio || ''} onChange={(e) => updateField('bio', e.target.value)} rows={5} style={{ width: '100%', resize: 'vertical', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 14px', color: 'var(--text)', outline: 'none', fontSize: 14 }} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <Btn variant="secondary" onClick={() => fileInputRef.current && fileInputRef.current.click()}>
                  <Icon.upload size={15} />
                  {P.uploadAvatar}
                </Btn>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
              </div>
            </div>
          </Card>
        ) : null}

        {isEditing ? (
          <Card padding={28}>
            <SectionHead title={P.visibilityTitle} subtitle={P.visibilitySubtitle} />
            <div style={{ display: 'grid', gap: 14 }}>
              {[
                { key: 'fullName', title: P.fullNameTitle, description: P.fullNameDescription },
                { key: 'email', title: P.email, description: P.emailDescription },
                { key: 'phone', title: P.phone, description: P.phoneDescription },
              ].map((item) => (
                <div key={item.key} style={{ display: 'grid', gridTemplateColumns: isCompact ? '1fr' : '1fr 210px', gap: 14, alignItems: 'center', padding: '16px 18px', borderRadius: 12, background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, marginBottom: 2 }}>
                      <Icon.eye size={15} />
                      {item.title}
                    </div>
                    <div style={{ color: 'var(--text-2)', fontSize: 13 }}>{item.description}</div>
                  </div>
                  <Select value={form.visibility[item.key]} onChange={(e) => updateVisibility(item.key, e.target.value)} style={{ width: '100%' }}>
                    {visibilityOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </div>
              ))}
            </div>
          </Card>
        ) : null}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, position: isCompact ? 'static' : 'sticky', top: 24 }}>
        <Card padding={24}>
          <SectionHead title={P.historyTitle} subtitle={P.historySubtitle} />
          <div style={{ display: 'grid', gap: 10 }}>
            {recentTrades.length === 0 ? (
              <div style={{ padding: '14px 16px', borderRadius: 12, background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-2)' }}>
                {P.historyEmpty}
              </div>
            ) : (
              recentTrades.map((trade) => (
                <div key={trade.id} style={{ display: 'grid', gridTemplateColumns: isCompact ? '1fr' : '64px 56px 1fr', gap: 10, alignItems: 'center', padding: '12px 14px', borderRadius: 12, background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                  <div className="mono" style={{ color: 'var(--text-3)', fontSize: 12 }}>
                    {new Date(trade.date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })}
                  </div>
                  <Badge tone={trade.side === 'buy' ? 'pos' : 'neg'}>
                    {trade.side === 'buy' ? 'BUY' : 'SELL'}
                  </Badge>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'baseline', flexWrap: 'wrap' }}>
                      <div className="mono" style={{ fontWeight: 600 }}>{trade.sym}</div>
                      <div className="mono" style={{ fontWeight: 600 }}>${fmtMoney(trade.total)}</div>
                    </div>
                    <div style={{ color: 'var(--text-2)', fontSize: 12 }}>
                      {fmtMoney(trade.qty, trade.qty < 1 ? 4 : 2)} {P.units} {'\u00b7'} ${fmtMoney(trade.price, trade.price < 1 ? 4 : 2)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {isEditing ? (
          <Card padding={24}>
            <SectionHead title={P.themeTitle} subtitle={P.themeSubtitle} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <Btn variant={theme === 'light' ? 'primary' : 'secondary'} onClick={() => onThemeChange('light')} style={{ justifyContent: 'center', padding: '12px 16px' }}>
                <Icon.sun size={15} />
                {P.light}
              </Btn>
              <Btn variant={theme === 'dark' ? 'primary' : 'secondary'} onClick={() => onThemeChange('dark')} style={{ justifyContent: 'center', padding: '12px 16px' }}>
                <Icon.moon size={15} />
                {P.dark}
              </Btn>
            </div>
          </Card>
        ) : null}

        {isEditing ? (
          <Card padding={24}>
            <SectionHead title={P.publicPreviewTitle} subtitle={P.publicPreviewSubtitle} />
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', overflow: 'hidden', background: 'linear-gradient(135deg, var(--accent) 0%, oklch(0.65 0.14 45) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a1814', fontSize: 22, fontWeight: 700, flexShrink: 0 }}>
                {publicPreview.avatarUrl ? (
                  <img src={publicPreview.avatarUrl} alt={publicPreview.displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  publicPreview.initials
                )}
              </div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 600, lineHeight: 1.2 }}>{publicPreview.displayName}</div>
                {publicPreview.fullName ? <div style={{ color: 'var(--text-2)', marginTop: 4 }}>{publicPreview.fullName}</div> : null}
              </div>
            </div>
            <div style={{ display: 'grid', gap: 10 }}>
              <div style={{ padding: '12px 14px', borderRadius: 10, background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                <div style={{ color: 'var(--text-3)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>{P.email}</div>
                <div>{publicPreview.email || P.hiddenEmail}</div>
              </div>
              <div style={{ padding: '12px 14px', borderRadius: 10, background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                <div style={{ color: 'var(--text-3)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>{P.phone}</div>
                <div>{publicPreview.phone || P.hiddenPhone}</div>
              </div>
              <div style={{ padding: '12px 14px', borderRadius: 10, background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                <div style={{ color: 'var(--text-3)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>{P.bio}</div>
                <div style={{ color: publicPreview.bio ? 'var(--text)' : 'var(--text-3)' }}>
                  {publicPreview.bio || P.emptyBio}
                </div>
              </div>
            </div>
          </Card>
        ) : null}

        {isEditing ? (
          <Card padding={24}>
            <div style={{ display: 'grid', gap: 12 }}>
              {status ? <div style={{ padding: '10px 12px', borderRadius: 10, background: 'var(--pos-soft)', color: 'var(--pos)', fontWeight: 500 }}>{status}</div> : null}
              {error ? <div style={{ padding: '10px 12px', borderRadius: 10, background: 'var(--neg-soft)', color: 'var(--neg)', fontWeight: 500 }}>{error}</div> : null}
              <Btn variant="primary" onClick={handleSave} style={{ width: '100%', justifyContent: 'center', padding: '14px 16px' }}>
                <Icon.settings size={15} />
                {isSaving ? P.saving : P.saveProfile}
              </Btn>
            </div>
          </Card>
        ) : null}
      </div>
    </div>
  );
};

window.Profile = Profile;
