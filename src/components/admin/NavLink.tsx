'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';

import styles from './admin.module.scss';

export function NavLink({href, label, badge = 0}: {href: string; label: string; badge?: number}) {
  const pathname = usePathname();
  const active = href === '/admin' ? pathname === '/admin' : pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link href={href} className={active ? styles.navItemActive : styles.navItem} aria-current={active ? 'page' : undefined}>
      {label}
      {badge > 0 && <span className={styles.count} style={{marginLeft: 8}}>{badge}</span>}
    </Link>
  );
}
