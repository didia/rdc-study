import Link from 'next/link';

import styles from '@/components/admin/admin.module.scss';
import {requireStaff} from '@/lib/admin/auth';
import {listPackages, packageLabel} from '@/lib/admin/catalogue';
import {cmsEntryLink, readContentIndex, summarise} from '@/lib/admin/content-index';
import {formatDate, formatDateTime, timeAgo} from '@/lib/admin/format';
import {t} from '@/lib/admin/i18n';
import {latestProductionDeploy, listCmsPullRequests} from '@/lib/admin/integrations';
import {formatCents} from '@/lib/admin/money';
import {getServicePrices} from '@/lib/prices';
import {priceFor} from '@/lib/price-resolve';
import {hasRole} from '@/lib/admin/roles';

const COLLECTION_LABELS: Record<string, string> = {article: 'admin.content.articles', guide: 'admin.content.guides', scholarships: 'admin.content.scholarships'};

export default async function ContentPage() {
  const {supabase, profile} = await requireStaff();
  const entries = readContentIndex();
  const summary = summarise(entries);
  const drafts = entries.filter((e) => e.draft).sort((a, b) => b.modified.localeCompare(a.modified));
  const missingThumb = entries.filter((e) => e.collection !== 'guide' && !e.thumbnail && !e.draft).slice(0, 20);
  const [prs, deploy, prices] = await Promise.all([listCmsPullRequests(), latestProductionDeploy(), getServicePrices()]);

  const showCatalogue = hasRole(profile.role, 'agent');
  const {data: perPackage} = showCatalogue
    ? await supabase.rpc('fn_conversion_by', {p_dimension: 'package', p_from: '2000-01-01T00:00:00Z', p_to: '2100-01-01T00:00:00Z'})
    : {data: null};
  const volume = new Map((perPackage ?? []).map((r) => [r.label, r]));

  return (
    <>
      <div className={styles.pageHeader}>
        <h1>{t('admin.content.title')}</h1>
        <a href="/cms" className={styles.button}>{t('admin.content.open-cms')} ↗</a>
      </div>

      <div className={styles.cardGrid}>
        {Object.entries(COLLECTION_LABELS).map(([key, label]) => (
          <section key={key} className={styles.card}>
            <h2>{t(label)}</h2>
            <p>
              <strong>{(summary[key]?.total ?? 0) - (summary[key]?.drafts ?? 0)}</strong> {t('admin.content.published')} ·{' '}
              <strong>{summary[key]?.drafts ?? 0}</strong> {t('admin.content.drafts')}
            </p>
          </section>
        ))}
        <section className={styles.card}>
          <h2>{t('admin.content.deploy')}</h2>
          {deploy ? (
            <p>
              <span className={styles.badge}>{deploy.state}</span>{' '}
              <span className={styles.muted}>{deploy.publishedAt ? timeAgo(deploy.publishedAt) : ''}</span>
            </p>
          ) : (
            <p className={styles.muted}>{t('admin.content.not-configured')}</p>
          )}
        </section>
      </div>

      <section className={styles.card}>
        <h2>{t('admin.content.drafts-list')}</h2>
        {drafts.length === 0 ? (
          <p className={styles.muted}>{t('admin.content.no-drafts')}</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{t('admin.content.entry')}</th>
                  <th>{t('admin.content.type')}</th>
                  <th>{t('admin.content.modified')}</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {drafts.map((d) => (
                  <tr key={`${d.collection}-${d.slug}`}>
                    <td>{d.title}</td>
                    <td>{t(COLLECTION_LABELS[d.collection])}</td>
                    <td>{formatDate(d.modified)}</td>
                    <td><a href={cmsEntryLink(d.collection, d.slug)}>{t('admin.content.edit-in-cms')} ↗</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className={styles.card}>
        <h2>{t('admin.content.workflow')}</h2>
        {prs === null ? (
          <p className={styles.muted}>{t('admin.content.not-configured')}</p>
        ) : prs.length === 0 ? (
          <p className={styles.muted}>{t('admin.content.no-prs')}</p>
        ) : (
          <ul className={styles.countList}>
            {prs.map((pr) => (
              <li key={pr.number}>
                <a href={pr.url} target="_blank" rel="noopener noreferrer">#{pr.number} {pr.title}</a>
                <span className={styles.muted}>{pr.author} · {formatDateTime(pr.updatedAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {showCatalogue && (
        <section className={styles.card}>
          <h2>{t('admin.content.catalogue')}</h2>
          <p className={styles.muted} style={{marginBottom: 12}}>{t('admin.content.catalogue-lead')} <Link href="/admin/tarifs">{t('admin.nav.prices')} →</Link></p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{t('admin.requests.package')}</th>
                  <th>{t('admin.content.price')}</th>
                  <th>{t('admin.dashboard.requests')}</th>
                  <th>{t('admin.dashboard.won')}</th>
                </tr>
              </thead>
              <tbody>
                {listPackages().map((p) => {
                  const cents = priceFor(prices, 'assistance', p.slug);
                  const v = volume.get(p.slug);
                  return (
                    <tr key={p.slug}>
                      <td>{packageLabel(p.slug)}</td>
                      <td>{cents == null ? '—' : formatCents(cents)}</td>
                      <td>{v?.total ?? 0}</td>
                      <td>{v?.won ?? 0}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {missingThumb.length > 0 && (
        <section className={styles.card}>
          <h2>{t('admin.content.health')}</h2>
          <p className={styles.muted} style={{marginBottom: 8}}>{t('admin.content.missing-thumbnail')}</p>
          <ul>
            {missingThumb.map((e) => (
              <li key={`${e.collection}-${e.slug}`}>
                <a href={cmsEntryLink(e.collection, e.slug)}>{e.title}</a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
