import {InviteStaffForm} from '@/components/admin/InviteStaffForm';
import {requireStaff} from '@/lib/admin/auth';
import {t} from '@/lib/admin/i18n';
import {ROLE_LABELS} from '@/lib/admin/roles';
import styles from '@/components/admin/admin.module.scss';

export default async function TeamPage() {
  const {supabase} = await requireStaff('admin');
  const {data: staff} = await supabase.from('staff_profiles').select('*').order('created_at');

  return (
    <>
      <div className={styles.pageHeader}>
        <h1>{t('admin.staff.title')}</h1>
      </div>
      <section className={styles.card}>
        <h2>{t('admin.staff.invite.title')}</h2>
        <InviteStaffForm />
      </section>
      <section className={styles.card}>
        <h2>{t('admin.staff.members')}</h2>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t('admin.staff.name')}</th>
                <th>{t('admin.staff.role')}</th>
                <th>{t('admin.staff.status')}</th>
              </tr>
            </thead>
            <tbody>
              {(staff ?? []).map((member) => (
                <tr key={member.id}>
                  <td>{member.full_name}</td>
                  <td>{ROLE_LABELS[member.role]}</td>
                  <td>
                    <span className={member.active ? styles.badge : styles.badgeOff}>
                      {member.active ? t('admin.staff.active') : t('admin.staff.inactive')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
