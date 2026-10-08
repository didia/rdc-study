'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';

import styles from './admin.module.scss';

export function NavLink({href, label}: {href: string; label: string}) {
  const pathname = usePathname();
  const active = href === '/admin' ? pathname === '/admin' : pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link href={href} className={active ? styles.navItemActive : styles.navItem} aria-current={active ? 'page' : undefined}>
      {label}
    </Link>
  );
}
