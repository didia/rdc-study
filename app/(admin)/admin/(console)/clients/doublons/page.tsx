import Link from 'next/link';

import styles from '@/components/admin/admin.module.scss';
import {requireStaff} from '@/lib/admin/auth';
import {t} from '@/lib/admin/i18n';
import {canEdit} from '@/lib/admin/roles';

export default async function DuplicatesPage() {
  const {supabase, profile} = await requireStaff();
  const {data: pairs} = await supabase.rpc('fn_client_duplicates');
  const ids = [...new Set((pairs ?? []).flatMap((p) => [p.a_id, p.b_id]))];
  const {data: clients} = ids.length ? await supabase.from('clients').select('id, first_name, last_name, email, phone').in('id', ids) : {data: []};
  const byId = new Map((clients ?? []).map((c) => [c.id, c]));
  const editable = canEdit(profile.role);
  const label = (id: string) => {
    const c = byId.get(id);
    return c ? (
      <Link href={`/admin/clients/${id}`}>
        {c.first_name} {c.last_name}
        <div className={styles.muted}>{[c.email, c.phone].filter(Boolean).join(' · ')}</div>
      </Link>
    ) : (
      id
    );
  };

  return (
    <>
      <div className={styles.pageHeader}>
        <div>
          <Link href="/admin/clients">← {t('admin.clients.title')}</Link>
          <h1>{t('admin.clients.duplicates')}</h1>
        </div>
      </div>
      <p className={styles.muted} style={{marginBottom: 16}}>{t('admin.clients.duplicates-lead')}</p>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{t('admin.clients.duplicate-a')}</th>
              <th>{t('admin.clients.duplicate-b')}</th>
              <th>{t('admin.clients.duplicate-why')}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {(pairs ?? []).length === 0 && (
              <tr><td colSpan={4} className={styles.muted}>{t('admin.clients.no-duplicates')}</td></tr>
            )}
            {(pairs ?? []).map((p) => (
              <tr key={`${p.a_id}-${p.b_id}`}>
                <td>{label(p.a_id)}</td>
                <td>{label(p.b_id)}</td>
                <td>{p.reason === 'phone' ? t('admin.clients.same-phone') : t('admin.clients.similar-name', {score: Math.round(p.score * 100)})}</td>
                <td>{editable && <Link href={`/admin/clients/fusion?keep=${p.a_id}&drop=${p.b_id}`}>{t('admin.clients.merge')}</Link>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
