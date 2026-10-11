import {requireStaff} from '@/lib/admin/auth';
import {t} from '@/lib/admin/i18n';
import styles from '@/components/admin/admin.module.scss';

export default async function AdminHomePage() {
  const {profile} = await requireStaff();
  return (
    <>
      <div className={styles.pageHeader}>
        <h1>{t('admin.home.title', {name: profile.full_name.split(' ')[0]})}</h1>
      </div>
      <div className={styles.cardGrid}>
        <section className={styles.card}>
          <h2>{t('admin.home.content.title')}</h2>
          <p className={styles.muted}>{t('admin.home.content.text')}</p>
          <p style={{marginTop: 12}}>
            <a href="/cms">{t('admin.nav.content')} →</a>
          </p>
        </section>
      </div>
    </>
  );
}
