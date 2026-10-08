'use client';

import {useMemo, useState} from 'react';

import {logContact} from '@/lib/admin/actions/followup';
import {t} from '@/lib/admin/i18n';
import {renderTemplate, type TemplateVars} from '@/lib/admin/templates';
import {whatsappLink} from '@/lib/admin/vocab';
import styles from './admin.module.scss';

type Template = {id: string; label: string; channel: string; body_fr: string};

type Props = {
  requestId: string;
  clientName: string;
  email: string | null;
  phone: string | null;
  phoneE164: string | null;
  vars: TemplateVars;
  templates: Template[];
};

// The rendered message and the recipient are always shown before anything opens, so a template is never sent blind.
export function ContactMenu({requestId, clientName, email, phone, phoneE164, vars, templates}: Props) {
  const [templateId, setTemplateId] = useState(templates[0]?.id ?? '');
  const template = templates.find((tpl) => tpl.id === templateId);
  const rendered = useMemo(() => (template ? renderTemplate(template.body_fr, vars) : ''), [template, vars]);
  const [override, setOverride] = useState<{id: string; text: string} | null>(null);
  const message = override && override.id === templateId ? override.text : rendered;
  const [mark, setMark] = useState(true);
  const [status, setStatus] = useState<string>();

  if (templates.length === 0) return <p className={styles.muted}>{t('admin.contact.no-templates')}</p>;

  const isEmail = template?.channel === 'email';
  const href = isEmail
    ? email
      ? `mailto:${email}?subject=${encodeURIComponent(`RDC Études – ${vars.reference}`)}&body=${encodeURIComponent(message)}`
      : null
    : whatsappLink(phoneE164, message);

  async function onOpen() {
    if (!mark) return;
    const result = await logContact({id: requestId, channel: isEmail ? 'email' : 'whatsapp', note: template?.label});
    setStatus(result?.error ?? t('admin.requests.note.added'));
  }

  return (
    <div className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="template">{t('admin.contact.template')}</label>
        <select id="template" value={templateId} onChange={(e) => setTemplateId(e.target.value)} className={styles.select}>
          {templates.map((tpl) => (
            <option key={tpl.id} value={tpl.id}>
              {tpl.label} ({tpl.channel === 'email' ? 'e-mail' : 'WhatsApp'})
            </option>
          ))}
        </select>
      </div>

      <p className={styles.hint}>
        {t('admin.contact.to')} <strong>{clientName}</strong> — {isEmail ? email ?? t('admin.contact.no-email') : phone ?? t('admin.contact.no-phone')}
      </p>

      <textarea
        className={styles.textarea}
        aria-label={t('admin.contact.message')}
        value={message}
        onChange={(e) => setOverride({id: templateId, text: e.target.value})}
        rows={6}
      />

      {message.includes('{{') && <p className={styles.warning}>{t('admin.contact.placeholders-left')}</p>}

      {href ? (
        <>
          <label className={styles.checkLine}>
            <input type="checkbox" checked={mark} onChange={(e) => setMark(e.target.checked)} /> {t('admin.contact.mark')}
          </label>
          <div>
            <a href={href} target="_blank" rel="noopener noreferrer" onClick={onOpen} className={styles.button}>
              {isEmail ? t('admin.contact.open-email') : t('admin.contact.open-whatsapp')} ↗
            </a>
          </div>
        </>
      ) : (
        <p className={styles.alertInfo}>
          {isEmail ? t('admin.contact.no-email') : phone ? t('admin.clients.phone-not-international') : t('admin.contact.add-phone')}
        </p>
      )}
      {status && <p className={styles.alertSuccess} role="status">{status}</p>}
    </div>
  );
}
