import Link from 'next/link';

import {NewRequestForm} from '@/components/admin/NewRequestForm';
import styles from '@/components/admin/admin.module.scss';
import {requireStaff} from '@/lib/admin/auth';
import {listPackages, packageLabel} from '@/lib/admin/catalogue';
import {t} from '@/lib/admin/i18n';
import {getStatuses} from '@/lib/admin/queries/requests';

export default async function NewRequestPage() {
  const {supabase} = await requireStaff('agent');
  const statuses = await getStatuses(supabase);
  const packages = listPackages().map((p) => ({slug: p.slug, label: packageLabel(p.slug)}));
  return (
    <>
      <div className={styles.pageHeader}>
        <h1>{t('admin.requests.new.title')}</h1>
        <Link href="/admin/demandes">← {t('admin.requests.title')}</Link>
      </div>
      <section className={styles.card}>
        <p className={styles.muted} style={{marginBottom: 16}}>{t('admin.requests.new.lead')}</p>
        <NewRequestForm statuses={statuses} packages={packages} />
      </section>
    </>
  );
}
