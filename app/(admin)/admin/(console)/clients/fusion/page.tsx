import Link from 'next/link';
import {notFound} from 'next/navigation';

import styles from '@/components/admin/admin.module.scss';
import {requireStaff} from '@/lib/admin/auth';
import {mergeClientsAction} from '@/lib/admin/actions/clients';
import {t} from '@/lib/admin/i18n';
import {getClient} from '@/lib/admin/queries/clients';

const uuid = /^[0-9a-f-]{36}$/i;

export default async function MergePage({searchParams}: {searchParams: Promise<{keep?: string; drop?: string; erreur?: string}>}) {
  const {keep, drop, erreur} = await searchParams;
  if (!keep || !drop || !uuid.test(keep) || !uuid.test(drop) || keep === drop) notFound();
  const {supabase} = await requireStaff('agent');
  const [kept, dropped] = await Promise.all([getClient(supabase, keep), getClient(supabase, drop)]);
  if (!kept || !dropped) notFound();
  const {count} = await supabase.from('service_requests').select('id', {count: 'exact', head: true}).eq('client_id', drop);

  const filled = (['email', 'phone', 'origin_country'] as const).filter((f) => !kept[f] && dropped[f]);
  const fieldLabel = {email: t('admin.auth.email'), phone: t('admin.clients.phone'), origin_country: t('admin.clients.origin')};

  return (
    <>
      <div className={styles.pageHeader}>
        <div>
          <Link href="/admin/clients/doublons">← {t('admin.clients.duplicates')}</Link>
          <h1>{t('admin.clients.merge-title')}</h1>
        </div>
        <Link href={`/admin/clients/fusion?keep=${drop}&drop=${keep}`}>{t('admin.clients.merge-swap')}</Link>
      </div>

      {erreur === 'confirmation' && <p className={styles.alertError} role="alert" style={{marginBottom: 12}}>{t('admin.clients.merge-confirm-needed')}</p>}
      {erreur === 'echec' && <p className={styles.alertError} role="alert" style={{marginBottom: 12}}>{t('admin.requests.failed')}</p>}

      <section className={styles.card}>
        <div className={styles.detailGrid}>
          <div>
            <h2>{t('admin.clients.merge-keep')}</h2>
            <p><strong>{kept.first_name} {kept.last_name}</strong></p>
            <p className={styles.muted}>{[kept.email, kept.phone, kept.origin_country].filter(Boolean).join(' · ')}</p>
          </div>
          <div>
            <h2>{t('admin.clients.merge-drop')}</h2>
            <p><strong>{dropped.first_name} {dropped.last_name}</strong></p>
            <p className={styles.muted}>{[dropped.email, dropped.phone, dropped.origin_country].filter(Boolean).join(' · ')}</p>
          </div>
        </div>
        <h2 style={{marginTop: 18}}>{t('admin.clients.merge-preview')}</h2>
        <ul>
          <li>{t('admin.clients.merge-requests', {count: count ?? 0})}</li>
          <li>{filled.length ? t('admin.clients.merge-fields', {fields: filled.map((f) => fieldLabel[f]).join(', ')}) : t('admin.clients.merge-no-fields')}</li>
          <li>{t('admin.clients.merge-deleted', {name: `${dropped.first_name} ${dropped.last_name}`})}</li>
        </ul>
        <form action={mergeClientsAction} className={styles.form} style={{marginTop: 16}}>
          <input type="hidden" name="keep" value={keep} />
          <input type="hidden" name="drop" value={drop} />
          <label className={styles.checkLine}>
            <input type="checkbox" name="confirm" value="yes" required /> {t('admin.clients.merge-confirm')}
          </label>
          <div>
            <button type="submit" className={styles.button}>{t('admin.clients.merge')}</button>
          </div>
        </form>
      </section>
    </>
  );
}
