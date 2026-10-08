'use client';

import {useActionState} from 'react';

import {saveDocumentTemplate} from '@/lib/admin/actions/documents';
import {saveLostReason, saveTemplate, setDepositShare, setEnforceMfa, setRoundRobin} from '@/lib/admin/actions/settings';
import {t} from '@/lib/admin/i18n';
import styles from './admin.module.scss';
import {Feedback} from './Feedback';

export function LostReasonForm({reason}: {reason?: {code: string; label_fr: string; is_active: boolean}}) {
  const [state, action, pending] = useActionState(saveLostReason, undefined);
  const v = (name: string, fallback: string) => state?.values?.[name] ?? fallback;
  return (
    <form action={action} className={styles.priceRow} key={state?.success ? 'saved' : 'form'} style={{marginBottom: 8}}>
      <div className={styles.field}>
        <label htmlFor={`code-${reason?.code ?? 'new'}`}>{t('admin.settings.code')}</label>
        <input id={`code-${reason?.code ?? 'new'}`} name="code" defaultValue={v('code', reason?.code ?? '')} readOnly={!!reason} required pattern="[a-z0-9_]{2,40}" className={styles.input} />
      </div>
      <div className={styles.field}>
        <label htmlFor={`label-${reason?.code ?? 'new'}`}>{t('admin.settings.label')}</label>
        <input id={`label-${reason?.code ?? 'new'}`} name="label" defaultValue={v('label', reason?.label_fr ?? '')} required className={styles.input} />
      </div>
      <div className={styles.priceActions}>
        <label className={styles.checkLine}>
          <input type="checkbox" name="active" defaultChecked={reason?.is_active ?? true} /> {t('admin.settings.active')}
        </label>
        <button type="submit" className={styles.buttonSecondary} disabled={pending}>{t('admin.requests.save')}</button>
      </div>
      <Feedback state={state} />
    </form>
  );
}

type Template = {id: string; code: string; label: string; channel: string; body_fr: string; is_active: boolean};

export function TemplateForm({template}: {template?: Template}) {
  const [state, action, pending] = useActionState(saveTemplate, undefined);
  const v = (name: string, fallback: string) => state?.values?.[name] ?? fallback;
  const key = template?.id ?? 'new';
  return (
    <form action={action} className={styles.form} key={state?.success ? `saved-${key}` : key}>
      <input type="hidden" name="id" value={template?.id ?? ''} />
      <div className={styles.inlineForm}>
        <div className={styles.field}>
          <label htmlFor={`tcode-${key}`}>{t('admin.settings.code')}</label>
          <input id={`tcode-${key}`} name="code" defaultValue={v('code', template?.code ?? '')} readOnly={!!template} required pattern="[a-z0-9_]{2,40}" className={styles.input} />
        </div>
        <div className={styles.field}>
          <label htmlFor={`tlabel-${key}`}>{t('admin.settings.label')}</label>
          <input id={`tlabel-${key}`} name="label" defaultValue={v('label', template?.label ?? '')} required className={styles.input} />
        </div>
        <div className={styles.field}>
          <label htmlFor={`tchannel-${key}`}>{t('admin.templates.channel')}</label>
          <select id={`tchannel-${key}`} name="channel" defaultValue={v('channel', template?.channel ?? 'whatsapp')} className={styles.select}>
            <option value="whatsapp">WhatsApp</option>
            <option value="email">E-mail</option>
          </select>
        </div>
      </div>
      <div className={styles.field}>
        <label htmlFor={`tbody-${key}`}>{t('admin.templates.body')}</label>
        <textarea id={`tbody-${key}`} name="body" required rows={5} defaultValue={v('body', template?.body_fr ?? '')} className={styles.textarea} />
      </div>
      <label className={styles.checkLine}>
        <input type="checkbox" name="active" defaultChecked={template?.is_active ?? true} /> {t('admin.settings.active')}
      </label>
      <Feedback state={state} />
      <div>
        <button type="submit" className={styles.button} disabled={pending}>{t('admin.requests.save')}</button>
      </div>
    </form>
  );
}

export function RoundRobinForm({enabled}: {enabled: boolean}) {
  const [state, action, pending] = useActionState(setRoundRobin, undefined);
  return (
    <form action={action} className={styles.form}>
      <label className={styles.checkLine}>
        <input type="checkbox" name="enabled" defaultChecked={enabled} /> {t('admin.settings.round-robin')}
      </label>
      <p className={styles.hint}>{t('admin.settings.round-robin-hint')}</p>
      <Feedback state={state} />
      <div>
        <button type="submit" className={styles.button} disabled={pending}>{t('admin.requests.save')}</button>
      </div>
    </form>
  );
}

export function DepositShareForm({share}: {share: number}) {
  const [state, action, pending] = useActionState(setDepositShare, undefined);
  return (
    <form action={action} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="percent">{t('admin.settings.deposit-share')}</label>
        <input id="percent" name="percent" inputMode="decimal" required defaultValue={state?.values?.percent ?? String(Math.round(share * 1000) / 10)} className={styles.input} />
        <span className={styles.hint}>{t('admin.settings.deposit-share-hint')}</span>
      </div>
      <Feedback state={state} />
      <div>
        <button type="submit" className={styles.button} disabled={pending}>{t('admin.requests.save')}</button>
      </div>
    </form>
  );
}

export function DocumentTemplateForm({template}: {template: {kind: string; version: number; title: string; body: string}}) {
  const [state, action, pending] = useActionState(saveDocumentTemplate, undefined);
  return (
    <form action={action} className={styles.form} key={`${template.kind}-${template.version}`} style={{marginBottom: 20}}>
      <input type="hidden" name="kind" value={template.kind} />
      <h3>{template.kind === 'contract' ? t('admin.templates.contract') : t('admin.templates.receipt')} <span className={styles.badge}>v{template.version}</span></h3>
      <div className={styles.field}>
        <label htmlFor={`dt-title-${template.kind}`}>{t('admin.templates.doc-title')}</label>
        <input id={`dt-title-${template.kind}`} name="title" required defaultValue={state?.values?.title ?? template.title} className={styles.input} />
      </div>
      <div className={styles.field}>
        <label htmlFor={`dt-body-${template.kind}`}>{t('admin.templates.body')}</label>
        <textarea id={`dt-body-${template.kind}`} name="body" required rows={10} defaultValue={state?.values?.body ?? template.body} className={styles.textarea} />
      </div>
      <Feedback state={state} />
      <div>
        <button type="submit" className={styles.button} disabled={pending}>{t('admin.templates.new-version')}</button>
      </div>
    </form>
  );
}

export function EnforceMfaForm({enabled, missing}: {enabled: boolean; missing: string[]}) {
  const [state, action, pending] = useActionState(setEnforceMfa, undefined);
  return (
    <form action={action} className={styles.form}>
      <label className={styles.checkLine}>
        <input type="checkbox" name="enabled" defaultChecked={enabled} /> {t('admin.settings.enforce-mfa')}
      </label>
      <p className={styles.hint}>{t('admin.settings.enforce-mfa-hint')}</p>
      {missing.length > 0 && <p className={styles.warning}>{t('admin.settings.mfa-missing', {names: missing.join(', ')})}</p>}
      <Feedback state={state} />
      <div>
        <button type="submit" className={styles.button} disabled={pending}>{t('admin.requests.save')}</button>
      </div>
    </form>
  );
}
