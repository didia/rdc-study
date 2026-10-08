import Link from 'next/link';

import {signOut} from '@/lib/admin/actions/auth';
import type {StaffProfile} from '@/lib/admin/auth';
import {t} from '@/lib/admin/i18n';
import {hasRole, isAdmin, ROLE_LABELS} from '@/lib/admin/roles';
import styles from './admin.module.scss';
import {NavLink} from './NavLink';

// Items are added here as each console section ships.
const NAV: {href: string; label: string; adminOnly?: boolean; minRole?: 'agent'; external?: boolean; badge?: boolean}[] = [
  {href: '/admin', label: 'admin.nav.today', badge: true},
  {href: '/admin/demandes', label: 'admin.nav.requests'},
  {href: '/admin/tableau-de-bord', label: 'admin.nav.dashboard'},
  {href: '/admin/paiements', label: 'admin.nav.payments', minRole: 'agent'},
  {href: '/admin/clients', label: 'admin.nav.clients'},
  {href: '/admin/tarifs', label: 'admin.nav.prices'},
  {href: '/cms', label: 'admin.nav.content', external: true},
  {href: '/admin/modeles', label: 'admin.nav.templates', adminOnly: true},
  {href: '/admin/parametres', label: 'admin.nav.settings', adminOnly: true},
  {href: '/admin/equipe', label: 'admin.nav.team', adminOnly: true},
];

export function Shell({profile, overdue = 0, children}: {profile: StaffProfile; overdue?: number; children: React.ReactNode}) {
  const items = NAV.filter((item) => (!item.adminOnly || isAdmin(profile.role)) && (!item.minRole || hasRole(profile.role, item.minRole)));
  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <span className={styles.brand}>RDC Études</span>
        <nav className={styles.nav} aria-label={t('admin.nav.label')}>
          {items.map((item) =>
            item.external ? (
              <a key={item.href} href={item.href} className={styles.navItem}>
                {t(item.label)}
              </a>
            ) : (
              <NavLink key={item.href} href={item.href} label={t(item.label)} badge={item.badge ? overdue : 0} />
            ),
          )}
        </nav>
        <p className={styles.sidebarFooter}>{t('admin.nav.footer')}</p>
      </aside>
      <div className={styles.content}>
        <header className={styles.topbar}>
          <details className={styles.userMenu}>
            <summary>
              {profile.full_name} <span className={styles.roleBadge}>{ROLE_LABELS[profile.role]}</span>
            </summary>
            <div className={styles.userMenuPanel}>
              <Link href="/admin/securite">{t('admin.nav.security')}</Link>
              <form action={signOut}>
                <button type="submit">{t('admin.nav.sign-out')}</button>
              </form>
            </div>
          </details>
        </header>
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}
