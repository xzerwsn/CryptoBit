const supportText = {
  title: 'Служба поддержки',
  subtitle: 'Опишите вопрос, проблему или предложение. Письмо уйдет администраторам с сервисной почты платформы, а ваш email будет указан как адрес для ответа.',
  subject: 'Тема обращения',
  subjectPlaceholder: 'Например, Проблема со входом',
  email: 'Email для ответа',
  emailHint: 'Этот адрес попадет в Reply-To, чтобы администратор мог ответить вам напрямую. Пароль от вашей почты не нужен.',
  message: 'Сообщение',
  messagePlaceholder: 'Подробно опишите ситуацию: что произошло, когда это случилось и что вы ожидали увидеть.',
  submit: 'Отправить обращение',
  sending: 'Отправка...',
  success: 'Обращение отправлено. Администраторы скоро свяжутся с вами.',
  fallbackError: 'Не удалось отправить обращение.',
};

const Support = ({ profile, isCompact }) => {
  const [form, setForm] = React.useState({
    subject: '',
    contact_email: (profile && profile.email) || '',
    message: '',
  });
  const [errors, setErrors] = React.useState({});
  const [status, setStatus] = React.useState('');
  const [isSending, setIsSending] = React.useState(false);

  React.useEffect(() => {
    setForm((current) => ({
      ...current,
      contact_email: current.contact_email || ((profile && profile.email) || ''),
    }));
  }, [profile]);

  const updateField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: null, __all__: null }));
    setStatus('');
  };

  const renderFieldError = (key) => {
    const fieldErrors = errors[key];
    if (!fieldErrors || fieldErrors.length === 0) return null;
    return (
      <div style={{ marginTop: 6, color: 'var(--neg)', fontSize: 13 }}>
        {fieldErrors[0]}
      </div>
    );
  };

  const handleSubmit = async () => {
    setIsSending(true);
    setStatus('');
    setErrors({});

    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value || '';
    const body = new FormData();
    body.set('subject', form.subject || '');
    body.set('contact_email', form.contact_email || '');
    body.set('message', form.message || '');

    try {
      const response = await fetch('/api/support/', {
        method: 'POST',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRFToken': csrfToken,
        },
        body,
      });
      const payload = await response.json();

      if (!response.ok) {
        setErrors(payload.errors || { __all__: [supportText.fallbackError] });
        return;
      }

      setStatus(payload.message || supportText.success);
      setForm((current) => ({
        ...current,
        subject: '',
        message: '',
      }));
    } catch (submitError) {
      console.error('Support request failed:', submitError);
      setErrors({ __all__: [supportText.fallbackError] });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: isCompact ? '1fr' : 'minmax(0, 1.1fr) minmax(320px, 0.75fr)', gap: 20, alignItems: 'start' }}>
      <Card padding={28}>
        <SectionHead title={supportText.title} subtitle={supportText.subtitle} />

        <div style={{ display: 'grid', gap: 16 }}>
          <div>
            <div style={{ color: 'var(--text-3)', fontSize: 11, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 6 }}>
              {supportText.subject}
            </div>
            <Field
              icon={<Icon.mail size={14} />}
              value={form.subject}
              onChange={(event) => updateField('subject', event.target.value)}
              placeholder={supportText.subjectPlaceholder}
            />
            {renderFieldError('subject')}
          </div>

          <div>
            <div style={{ color: 'var(--text-3)', fontSize: 11, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 6 }}>
              {supportText.email}
            </div>
            <Field
              type="email"
              value={form.contact_email}
              onChange={(event) => updateField('contact_email', event.target.value)}
              placeholder="you@example.com"
            />
            <div style={{ marginTop: 6, color: 'var(--text-2)', fontSize: 12 }}>
              {supportText.emailHint}
            </div>
            {renderFieldError('contact_email')}
          </div>

          <div>
            <div style={{ color: 'var(--text-3)', fontSize: 11, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 6 }}>
              {supportText.message}
            </div>
            <textarea
              value={form.message}
              onChange={(event) => updateField('message', event.target.value)}
              rows={10}
              placeholder={supportText.messagePlaceholder}
              style={{
                width: '100%',
                resize: 'vertical',
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                padding: '12px 14px',
                color: 'var(--text)',
                outline: 'none',
                fontSize: 14,
                minHeight: 220,
              }}
            />
            {renderFieldError('message')}
          </div>

          {errors.__all__ && errors.__all__.length ? (
            <div style={{ padding: '10px 12px', borderRadius: 10, background: 'var(--neg-soft)', color: 'var(--neg)', fontWeight: 500 }}>
              {errors.__all__[0]}
            </div>
          ) : null}

          {status ? (
            <div style={{ padding: '10px 12px', borderRadius: 10, background: 'var(--pos-soft)', color: 'var(--pos)', fontWeight: 500 }}>
              {status}
            </div>
          ) : null}

          <Btn variant="primary" onClick={handleSubmit} disabled={isSending} style={{ justifyContent: 'center', padding: '14px 16px' }}>
            <Icon.mail size={15} />
            {isSending ? supportText.sending : supportText.submit}
          </Btn>
        </div>
      </Card>

      <div style={{ display: 'grid', gap: 20 }}>
        <Card padding={24}>
          <SectionHead title="Что указать" subtitle="Так администраторы быстрее помогут." />
          <div style={{ display: 'grid', gap: 12 }}>
            {[
              'Кратко опишите проблему в теме обращения.',
              'Добавьте шаги, после которых появилась ошибка.',
              'Если вопрос связан с профилем или сделкой, укажите примерное время события.',
              'Оставьте актуальный email для обратной связи.',
            ].map((item) => (
              <div key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '12px 14px', borderRadius: 12, background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                <span style={{ display: 'flex', color: 'var(--accent-ink)', marginTop: 2 }}>
                  <Icon.mail size={14} />
                </span>
                <div style={{ color: 'var(--text-2)', fontSize: 14 }}>{item}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card padding={24}>
          <SectionHead title="Кому уйдет письмо" subtitle="Получатели определяются автоматически." />
          <div style={{ color: 'var(--text-2)', lineHeight: 1.6 }}>
            Письмо будет отправлено на все email-адреса активных пользователей, у которых есть права администратора в системе. Отправителем будет служебная почта платформы, а ваш адрес будет указан только для ответа.
          </div>
        </Card>
      </div>
    </div>
  );
};

window.Support = Support;
