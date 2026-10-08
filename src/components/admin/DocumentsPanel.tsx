'use client';

import {useRouter} from 'next/navigation';
import {useActionState, useState, type FormEvent} from 'react';

import {generateContract, getDocumentUrl, registerDocument} from '@/lib/admin/actions/documents';
import {createSupabaseBrowserClient} from '@/lib/admin/db/browser';
import {DOCUMENT_KINDS, documentKindLabel, documentPath, validateUpload} from '@/lib/admin/documents';
import {t} from '@/lib/admin/i18n';
import styles from './admin.module.scss';
import {Feedback} from './Feedback';

export type DocumentItem = {id: string; kind: string; file_name: string; size_bytes: number | null; created_at: string; uploaded_by_name: string | null; date: string};

export function DocumentsPanel({requestId, documents, canGenerate}: {requestId: string; documents: DocumentItem[]; canGenerate: boolean}) {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [contractState, contractAction, contractPending] = useActionState(generateContract, undefined);

  async function open(documentId: string) {
    setError(undefined);
    const result = await getDocumentUrl(documentId);
    if (result.error || !result.url) {
      setError(result.error ?? t('admin.documents.not-found'));
      return;
    }
    window.open(result.url, '_blank', 'noopener');
  }

  async function onUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const file = data.get('file');
    const kind = String(data.get('kind') ?? 'client_document');
    if (!(file instanceof File) || file.size === 0) return;
    const problem = validateUpload(file);
    if (problem) {
      setError(problem === 'too_large' ? t('admin.documents.too-large') : t('admin.documents.bad-type'));
      return;
    }
    setBusy(true);
    setError(undefined);
    const path = documentPath(requestId, crypto.randomUUID(), file.name);
    const supabase = createSupabaseBrowserClient();
    const {error: uploadError} = await supabase.storage.from('request-docs').upload(path, file, {contentType: file.type, upsert: false});
    if (uploadError) {
      setError(t('admin.documents.upload-failed'));
      setBusy(false);
      return;
    }
    const result = await registerDocument({requestId, kind, path, fileName: file.name, mimeType: file.type, size: file.size});
    setBusy(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    form.reset();
    router.refresh();
  }

  return (
    <div className={styles.form}>
      {documents.length === 0 ? (
        <p className={styles.muted}>{t('admin.documents.empty')}</p>
      ) : (
        <ul className={styles.paymentList}>
          {documents.map((d) => (
            <li key={d.id}>
              <div>
                <strong>{d.file_name}</strong>
                <div className={styles.muted}>
                  {documentKindLabel(d.kind)} · {d.date}
                  {d.size_bytes != null ? ` · ${Math.max(1, Math.round(d.size_bytes / 1024))} Ko` : ''}
                  {d.uploaded_by_name ? ` · ${d.uploaded_by_name}` : ''}
                </div>
              </div>
              <button type="button" className={styles.buttonSecondary} onClick={() => open(d.id)}>{t('admin.documents.download')}</button>
            </li>
          ))}
        </ul>
      )}

      {error && <p className={styles.alertError} role="alert">{error}</p>}

      <form onSubmit={onUpload} className={styles.form}>
        <div className={styles.inlineForm}>
          <div className={styles.field}>
            <label htmlFor="doc-kind">{t('admin.documents.kind')}</label>
            <select id="doc-kind" name="kind" defaultValue="client_document" className={styles.select}>
              {DOCUMENT_KINDS.map((k) => (
                <option key={k.code} value={k.code}>{k.label}</option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label htmlFor="doc-file">{t('admin.documents.file')}</label>
            <input id="doc-file" name="file" type="file" required accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx,.xls,.xlsx,.odt" className={styles.input} />
          </div>
        </div>
        <p className={styles.hint}>{t('admin.documents.hint')}</p>
        <div>
          <button type="submit" className={styles.buttonSecondary} disabled={busy}>{t('admin.documents.upload')}</button>
        </div>
      </form>

      {canGenerate && (
        <form action={contractAction}>
          <input type="hidden" name="id" value={requestId} />
          <Feedback state={contractState} />
          <button type="submit" className={styles.button} disabled={contractPending}>{t('admin.documents.generate-contract')}</button>
        </form>
      )}
    </div>
  );
}
