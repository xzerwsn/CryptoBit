const App = () => {
  const [route, setRoute] = React.useState('terminal');
  const [profile, setProfile] = React.useState(window.PROFILE);
  const [theme, setTheme] = React.useState(
    (window.PROFILE && window.PROFILE.theme) || window.localStorage.getItem('cw-theme') || 'dark'
  );
  const [isCompact, setIsCompact] = React.useState(window.innerWidth < 1100);

  React.useEffect(() => {
    const onResize = () => setIsCompact(window.innerWidth < 1100);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem('cw-theme', theme);
  }, [theme]);

  React.useEffect(() => {
    if (!profile) return;
    window.PROFILE = profile;
    if (profile.theme && profile.theme !== theme) {
      setTheme(profile.theme);
    }
  }, [profile]);

  React.useEffect(() => {
    if ((route === 'admin' || route === 'roles') && !profile?.isAdmin) {
      setRoute('terminal');
    }
  }, [route, profile]);

  const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value || '';

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: isCompact ? '1fr' : '232px 1fr' }}>
      <aside style={{ background: 'var(--surface)', borderRight: isCompact ? 'none' : '1px solid var(--border)', borderBottom: isCompact ? '1px solid var(--border)' : 'none', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 4, position: isCompact ? 'static' : 'sticky', top: 0, height: isCompact ? 'auto' : '100vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 8px 20px' }}>
          <Logo />
          <div>
            <div style={{ fontWeight: 600, letterSpacing: '-0.01em' }}>CryptoBit</div>
            <div style={{ color: 'var(--text-3)', fontSize: 11 }}>{'\u0422\u043e\u0440\u0433\u043e\u0432\u044b\u0439 \u0442\u0435\u0440\u043c\u0438\u043d\u0430\u043b'}</div>
          </div>
        </div>

        <button onClick={() => setRoute('terminal')} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, background: route === 'terminal' ? 'var(--surface-2)' : 'transparent', border: 'none', textAlign: 'left', width: '100%', color: route === 'terminal' ? 'var(--text)' : 'var(--text-2)', fontSize: 14, fontWeight: route === 'terminal' ? 500 : 400, cursor: 'pointer' }}>
          <span style={{ display: 'flex', color: route === 'terminal' ? 'var(--accent-ink)' : 'var(--text-3)' }}><Icon.terminal size={16} /></span>
          <span>{'\u0422\u0435\u0440\u043c\u0438\u043d\u0430\u043b'}</span>
        </button>
        <button onClick={() => setRoute('profile')} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, background: route === 'profile' ? 'var(--surface-2)' : 'transparent', border: 'none', textAlign: 'left', width: '100%', color: route === 'profile' ? 'var(--text)' : 'var(--text-2)', fontSize: 14, fontWeight: route === 'profile' ? 500 : 400, cursor: 'pointer' }}>
          <span style={{ display: 'flex', color: route === 'profile' ? 'var(--accent-ink)' : 'var(--text-3)' }}><Icon.user size={16} /></span>
          <span>{'\u041f\u0440\u043e\u0444\u0438\u043b\u044c'}</span>
        </button>
        <button onClick={() => setRoute('support')} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, background: route === 'support' ? 'var(--surface-2)' : 'transparent', border: 'none', textAlign: 'left', width: '100%', color: route === 'support' ? 'var(--text)' : 'var(--text-2)', fontSize: 14, fontWeight: route === 'support' ? 500 : 400, cursor: 'pointer' }}>
          <span style={{ display: 'flex', color: route === 'support' ? 'var(--accent-ink)' : 'var(--text-3)' }}><Icon.mail size={16} /></span>
          <span>{'\u041f\u043e\u0434\u0434\u0435\u0440\u0436\u043a\u0430'}</span>
        </button>
        {profile?.isAdmin ? (
          <button onClick={() => setRoute('admin')} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, background: route === 'admin' ? 'var(--surface-2)' : 'transparent', border: 'none', textAlign: 'left', width: '100%', color: route === 'admin' ? 'var(--text)' : 'var(--text-2)', fontSize: 14, fontWeight: route === 'admin' ? 500 : 400, cursor: 'pointer' }}>
            <span style={{ display: 'flex', color: route === 'admin' ? 'var(--accent-ink)' : 'var(--text-3)' }}><Icon.shield size={16} /></span>
            <span>{'\u0410\u0434\u043c\u0438\u043d-\u043f\u0430\u043d\u0435\u043b\u044c'}</span>
          </button>
        ) : null}
        {profile?.isAdmin ? (
          <button onClick={() => setRoute('roles')} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, background: route === 'roles' ? 'var(--surface-2)' : 'transparent', border: 'none', textAlign: 'left', width: '100%', color: route === 'roles' ? 'var(--text)' : 'var(--text-2)', fontSize: 14, fontWeight: route === 'roles' ? 500 : 400, cursor: 'pointer' }}>
            <span style={{ display: 'flex', color: route === 'roles' ? 'var(--accent-ink)' : 'var(--text-3)' }}><Icon.user size={16} /></span>
            <span>{'\u0423\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435 \u0440\u043e\u043b\u044f\u043c\u0438'}</span>
          </button>
        ) : null}

        <div style={{ flex: 1 }} />

        <div style={{ padding: '0 8px 12px' }}>
          <div style={{ padding: '12px 12px 10px', borderRadius: 14, background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
            <div style={{ color: 'var(--text-3)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
              {'\u0410\u043a\u043a\u0430\u0443\u043d\u0442'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  flexShrink: 0,
                  background: 'linear-gradient(135deg, var(--accent) 0%, oklch(0.65 0.14 45) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#1a1814',
                  fontSize: 14,
                  fontWeight: 700,
                  border: '1px solid color-mix(in srgb, var(--accent) 40%, transparent)',
                }}
              >
                {profile?.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile?.displayName || profile?.username || '\u041f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044c'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <span>{profile?.initials || '??'}</span>
                )}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 600, marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {profile?.displayName || profile?.username || '\u041f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044c'}
                </div>
                <div className="mono" style={{ color: 'var(--text-2)', fontSize: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  @{profile?.username || 'user'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: '10px 8px 0' }}>
          <div style={{ color: 'var(--text-3)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            {'\u0422\u0435\u043c\u0430'}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            <Btn size="sm" variant={theme === 'light' ? 'primary' : 'secondary'} onClick={() => setTheme('light')} style={{ justifyContent: 'center' }}>
              <Icon.sun size={14} />
              Light
            </Btn>
            <Btn size="sm" variant={theme === 'dark' ? 'primary' : 'secondary'} onClick={() => setTheme('dark')} style={{ justifyContent: 'center' }}>
              <Icon.moon size={14} />
              Dark
            </Btn>
          </div>
        </div>

        <form method="POST" action="/logout/" style={{ padding: '12px 8px 0' }}>
          <input type="hidden" name="csrfmiddlewaretoken" value={csrfToken} />
          <button type="submit" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-2)', cursor: 'pointer', fontSize: 14 }}>
            <Icon.user size={15} />
            <span>{'\u0412\u044b\u0439\u0442\u0438'}</span>
          </button>
        </form>
      </aside>

      <main style={{ padding: isCompact ? '20px 16px 36px' : '24px 32px 48px', maxWidth: 1440, width: '100%' }}>
        <header style={{ marginBottom: 28 }}>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em' }}>
            {route === 'terminal'
              ? '\u0422\u043e\u0440\u0433\u043e\u0432\u044b\u0439 \u0442\u0435\u0440\u043c\u0438\u043d\u0430\u043b'
              : route === 'profile'
                ? '\u041f\u0440\u043e\u0444\u0438\u043b\u044c'
                : route === 'support'
                  ? '\u0421\u043b\u0443\u0436\u0431\u0430 \u043f\u043e\u0434\u0434\u0435\u0440\u0436\u043a\u0438'
                : route === 'roles'
                  ? '\u0423\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435 \u0440\u043e\u043b\u044f\u043c\u0438'
                  : '\u0410\u0434\u043c\u0438\u043d-\u043f\u0430\u043d\u0435\u043b\u044c'}
          </h1>
        </header>
        {route === 'terminal' && <Terminal />}
        {route === 'profile' && <Profile profile={profile} onProfileChange={setProfile} theme={theme} onThemeChange={setTheme} isCompact={isCompact} />}
        {route === 'support' && <Support profile={profile} isCompact={isCompact} />}
        {route === 'admin' && profile?.isAdmin && <Admin profile={profile} />}
        {route === 'roles' && profile?.isAdmin && <Admin profile={profile} mode="roles" />}
      </main>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
