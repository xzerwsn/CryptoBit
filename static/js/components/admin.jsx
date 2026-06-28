const Admin = ({ profile, mode = 'admin' }) => {
  if (!profile?.isAdmin) {
    return null;
  }

  const isRolesMode = mode === 'roles';
  const iframeSrc = isRolesMode
    ? (profile.rolesAdminUrl || '/admin/auth/group/')
    : (profile.adminUrl || '/admin/');
  const title = isRolesMode ? '\u0423\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435 \u0440\u043e\u043b\u044f\u043c\u0438' : 'Django Admin';
  const subtitle = isRolesMode
    ? '\u0423\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435 \u0440\u043e\u043b\u044f\u043c\u0438 \u0432\u044b\u043f\u043e\u043b\u043d\u044f\u0435\u0442\u0441\u044f \u0447\u0435\u0440\u0435\u0437 \u0441\u0442\u0430\u043d\u0434\u0430\u0440\u0442\u043d\u044b\u0435 \u0433\u0440\u0443\u043f\u043f\u044b Django \u0432 \u043e\u0442\u0434\u0435\u043b\u044c\u043d\u043e\u043c \u0440\u0430\u0437\u0434\u0435\u043b\u0435 \u0430\u0434\u043c\u0438\u043d-\u043f\u0430\u043d\u0435\u043b\u0438.'
    : '\u0421\u0442\u0430\u043d\u0434\u0430\u0440\u0442\u043d\u0430\u044f \u0430\u0434\u043c\u0438\u043d\u0438\u0441\u0442\u0440\u0430\u0442\u0438\u0432\u043d\u0430\u044f \u043f\u0430\u043d\u0435\u043b\u044c Django \u0434\u043e\u0441\u0442\u0443\u043f\u043d\u0430 \u0442\u043e\u043b\u044c\u043a\u043e \u0430\u0434\u043c\u0438\u043d\u0438\u0441\u0442\u0440\u0430\u0442\u043e\u0440\u0430\u043c.';

  return (
    <Card padding={24}>
      <SectionHead
        title={title}
        subtitle={subtitle}
        right={
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {isRolesMode ? (
              <Btn
                variant="secondary"
                onClick={() => window.open(profile.usersAdminUrl || '/admin/auth/user/', '_blank', 'noopener,noreferrer')}
              >
                <Icon.user size={15} />
                {'\u041f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u0438'}
              </Btn>
            ) : null}
            <Btn
              variant="secondary"
              onClick={() => window.open(iframeSrc, '_blank', 'noopener,noreferrer')}
            >
              <Icon.settings size={15} />
              {'\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u043e\u0442\u0434\u0435\u043b\u044c\u043d\u043e'}
            </Btn>
          </div>
        }
      />

      <div style={{ color: 'var(--text-2)', marginBottom: 16 }}>
        {isRolesMode
          ? '\u0412 \u044d\u0442\u043e\u0439 \u0432\u043a\u043b\u0430\u0434\u043a\u0435 \u043e\u0442\u043a\u0440\u044b\u0432\u0430\u0435\u0442\u0441\u044f \u0440\u0430\u0437\u0434\u0435\u043b \u0433\u0440\u0443\u043f\u043f Django Admin. \u0421\u043e\u0437\u0434\u0430\u0432\u0430\u0439\u0442\u0435 \u0440\u043e\u043b\u0438 \u043a\u0430\u043a \u0433\u0440\u0443\u043f\u043f\u044b \u0438 \u043d\u0430\u0437\u043d\u0430\u0447\u0430\u0439\u0442\u0435 \u0438\u0445 \u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044f\u043c \u0447\u0435\u0440\u0435\u0437 \u0441\u0442\u0430\u043d\u0434\u0430\u0440\u0442\u043d\u0443\u044e \u0430\u0434\u043c\u0438\u043d\u043a\u0443.'
          : '\u0417\u0434\u0435\u0441\u044c \u043f\u043e\u0434\u043a\u043b\u044e\u0447\u0435\u043d\u0430 \u043f\u043e\u043b\u043d\u0430\u044f Django admin \u0441\u043e \u0432\u0441\u0435\u043c\u0438 \u043c\u043e\u0434\u0435\u043b\u044f\u043c\u0438, \u043f\u0440\u0430\u0432\u0430\u043c\u0438 \u0438 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044f\u043c\u0438 \u0441\u0443\u043f\u0435\u0440\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044f.'}
      </div>

      <div
        style={{
          borderRadius: 16,
          overflow: 'hidden',
          border: '1px solid var(--border)',
          background: 'var(--surface-2)',
          minHeight: '75vh',
        }}
      >
        <iframe
          src={iframeSrc}
          title={title}
          style={{ width: '100%', minHeight: '75vh', border: 'none', background: '#fff' }}
        />
      </div>
    </Card>
  );
};

window.Admin = Admin;
