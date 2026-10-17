import {ProfileForm} from '@/components/admin/ProfileForm';
import styles from '@/components/admin/admin.module.scss';
import {requireStaff} from '@/lib/admin/auth';
import {t} from '@/lib/admin/i18n';

export default async function ProfilePage() {
  const {profile} = await requireStaff();
  return (
    <>
      <div className={styles.pageHeader}>
        <h1>{t('admin.profile.title')}</h1>
      </div>
      <section className={styles.card}>
        <ProfileForm profile={profile} />
      </section>
    </>
  );
}
