import type {Metadata} from 'next';

import styles from '@/components/admin/admin.module.scss';

export const metadata: Metadata = {
  title: 'Console',
  robots: {index: false, follow: false, nocache: true},
};

export default function AdminLayout({children}: {children: React.ReactNode}) {
  return <div className={styles.admin}>{children}</div>;
}
