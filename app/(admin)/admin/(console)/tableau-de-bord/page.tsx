import Link from 'next/link';

import styles from '@/components/admin/admin.module.scss';
import {requireStaff} from '@/lib/admin/auth';
import {packageLabel} from '@/lib/admin/catalogue';
import {DIMENSIONS, MIN_SAMPLE_FOR_RATE, parseRange, rate, type Dimension} from '@/lib/admin/dashboard';
import {formatDate} from '@/lib/admin/format';
import {t} from '@/lib/admin/i18n';
import {formatCents, methodLabel} from '@/lib/admin/money';
import {getInsights, getRevenue} from '@/lib/admin/queries/insights';
import {hasRole} from '@/lib/admin/roles';
import {serviceLabel, sourceLabel} from '@/lib/admin/vocab';

const FUNNEL_LABELS: Record<string, string> = {
  submitted: 'admin.dashboard.step.submitted',
  contacted: 'admin.dashboard.step.contacted',
  in_discussion: 'admin.dashboard.step.in-discussion',
  awaiting_payment: 'admin.dashboard.step.awaiting-payment',
  won: 'admin.dashboard.step.won',
};

const prettyLabel = (dimension: Dimension, label: string) => {
  if (dimension === 'package') return label === '—' ? label : packageLabel(label);
  if (dimension === 'service') return serviceLabel(label);
  if (dimension === 'source') return sourceLabel(label);
  return label;
};

export default async function DashboardPage({searchParams}: {searchParams: Promise<{from?: string; to?: string; dim?: string}>}) {
  const {supabase, profile} = await requireStaff();
  const raw = await searchParams;
  const range = parseRange(raw);
  const dimension = (DIMENSIONS as readonly string[]).includes(raw.dim ?? '') ? (raw.dim as Dimension) : 'destination';
  const data = await getInsights(supabase, range, dimension);
  const revenue = hasRole(profile.role, 'agent') ? await getRevenue(supabase, range) : null;

  const submitted = data.funnel.find((f) => f.step === 'submitted')?.n ?? 0;
  const maxTrend = Math.max(1, ...data.trend.map((p) => p.n));
  const reasons = data.loss.filter((l) => l.kind === 'reason');
  const lastStatuses = data.loss.filter((l) => l.kind === 'last_status');
  const query = (extra: Record<string, string>) => `?${new URLSearchParams({from: range.from, to: range.to, dim: dimension, ...extra}).toString()}`;

  return (
    <>
      <div className={styles.pageHeader}>
        <h1>{t('admin.dashboard.title')}</h1>
      </div>

      <form method="get" className={styles.filters}>
        <input type="hidden" name="dim" value={dimension} />
        <div className={styles.field}>
          <label htmlFor="from">{t('admin.requests.from')}</label>
          <input id="from" name="from" type="date" defaultValue={range.from} className={styles.input} />
        </div>
        <div className={styles.field}>
          <label htmlFor="to">{t('admin.requests.to')}</label>
          <input id="to" name="to" type="date" defaultValue={range.to} className={styles.input} />
        </div>
        <div className={styles.filtersActions}>
          <button type="submit" className={styles.button}>{t('admin.requests.filter')}</button>
        </div>
      </form>
      <p className={styles.muted} style={{marginBottom: 16}}>
        {t('admin.dashboard.period', {from: formatDate(range.from), to: formatDate(range.to)})} · {t('admin.dashboard.min-sample', {n: MIN_SAMPLE_FOR_RATE})}
      </p>

      <section className={styles.card}>
        <h2>{t('admin.dashboard.funnel')}</h2>
        <ol className={styles.funnel}>
          {data.funnel.map((step, i) => {
            const previous = i === 0 ? null : data.funnel[i - 1].n;
            const stepRate = previous === null ? null : rate(step.n, previous);
            return (
              <li key={step.step}>
                <div className={styles.funnelLabel}>
                  <span>{t(FUNNEL_LABELS[step.step] ?? step.step)}</span>
                  <strong>{step.n}</strong>
                </div>
                <div className={styles.barTrack}>
                  <div className={styles.bar} style={{width: `${submitted ? (step.n / submitted) * 100 : 0}%`}} />
                </div>
                {stepRate !== null && <small className={styles.muted}>{t('admin.dashboard.of-previous', {rate: stepRate})}</small>}
              </li>
            );
          })}
        </ol>
      </section>

      <section className={styles.card}>
        <h2>{t('admin.dashboard.breakdown')}</h2>
        <nav className={styles.pills} aria-label={t('admin.dashboard.breakdown')}>
          {DIMENSIONS.map((d) => (
            <Link key={d} href={`/admin/tableau-de-bord${query({dim: d})}`} className={d === dimension ? styles.pillActive : styles.pill}>
              {t(`admin.dashboard.dim.${d}`)}
            </Link>
          ))}
        </nav>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t(`admin.dashboard.dim.${dimension}`)}</th>
                <th>{t('admin.dashboard.requests')}</th>
                <th>{t('admin.dashboard.won')}</th>
                <th>{t('admin.dashboard.conversion')}</th>
              </tr>
            </thead>
            <tbody>
              {data.breakdown.length === 0 && (
                <tr><td colSpan={4} className={styles.muted}>{t('admin.dashboard.empty')}</td></tr>
              )}
              {data.breakdown.map((row) => {
                const r = rate(row.won, row.total);
                return (
                  <tr key={row.label}>
                    <td>{prettyLabel(dimension, row.label)}</td>
                    <td>{row.total}</td>
                    <td>{row.won}</td>
                    <td>{r === null ? <span className={styles.muted} title={t('admin.dashboard.small-sample')}>—</span> : `${r} %`}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <div className={styles.detailGrid}>
        <section className={styles.card}>
          <h2>{t('admin.dashboard.speed')}</h2>
          <dl className={styles.facts}>
            <dt>{t('admin.dashboard.speed-contact')}</dt>
            <dd>{formatHours(data.speed?.median_hours_to_contact)} <span className={styles.muted}>({t('admin.dashboard.n-requests', {n: data.speed?.contacted_count ?? 0})})</span></dd>
            <dt>{t('admin.dashboard.speed-won')}</dt>
            <dd>{formatHours(data.speed?.median_hours_to_won)} <span className={styles.muted}>({t('admin.dashboard.n-requests', {n: data.speed?.won_count ?? 0})})</span></dd>
          </dl>
        </section>

        <section className={styles.card}>
          <h2>{t('admin.dashboard.loss')}</h2>
          <h3 className={styles.subhead}>{t('admin.dashboard.loss-reason')}</h3>
          <CountList rows={reasons} />
          <h3 className={styles.subhead}>{t('admin.dashboard.loss-status')}</h3>
          <CountList rows={lastStatuses} />
        </section>
      </div>

      {revenue && (
        <section className={styles.card}>
          <h2>{t('admin.dashboard.revenue')}</h2>
          <p className={styles.muted} style={{marginBottom: 12}}>{t('admin.dashboard.revenue-lead')}</p>
          <div className={styles.detailGrid}>
            <RevenueTable title={t('admin.dashboard.revenue-month')} rows={revenue.month} label={(l) => l} />
            <RevenueTable title={t('admin.dashboard.revenue-method')} rows={revenue.method} label={methodLabel} />
            <RevenueTable title={t('admin.dashboard.revenue-destination')} rows={revenue.destination} label={(l) => l} />
            <RevenueTable title={t('admin.dashboard.revenue-package')} rows={revenue.package} label={(l) => (l === '—' ? l : packageLabel(l))} />
          </div>
          <dl className={styles.facts} style={{marginTop: 16}}>
            <dt>{t('admin.dashboard.outstanding')}</dt>
            <dd>
              {revenue.outstanding.length
                ? revenue.outstanding.map((o) => `${formatCents(o.outstanding_cents, o.currency)} (${t('admin.dashboard.n-requests', {n: o.requests})})`).join(' · ')
                : formatCents(0)}
            </dd>
            <dt>{t('admin.dashboard.avg-delivery')}</dt>
            <dd>{revenue.delivery?.avg_days_deposit_to_completed != null ? `${revenue.delivery.avg_days_deposit_to_completed} j (${t('admin.dashboard.n-requests', {n: revenue.delivery.completed_count})})` : '—'}</dd>
            <dt>{t('admin.dashboard.refund-rate')}</dt>
            <dd>{revenue.delivery?.refunded_share != null ? `${Math.round(Number(revenue.delivery.refunded_share) * 1000) / 10} %` : '—'}</dd>
          </dl>
        </section>
      )}

      <section className={styles.card}>
        <h2>{t(data.grain === 'week' ? 'admin.dashboard.trend-week' : 'admin.dashboard.trend-month')}</h2>
        {data.trend.length === 0 ? (
          <p className={styles.muted}>{t('admin.dashboard.empty')}</p>
        ) : (
          <div className={styles.columns} role="img" aria-label={t('admin.dashboard.trend-alt')}>
            {data.trend.map((p) => (
              <div key={p.period} className={styles.column} title={`${formatDate(p.period)} : ${p.n}`}>
                <span className={styles.columnValue}>{p.n}</span>
                <div className={styles.columnBar} style={{height: `${(p.n / maxTrend) * 100}%`}} />
                <small>{formatDate(p.period).replace(/ \d{4}$/, '')}</small>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function CountList({rows}: {rows: {label: string; n: number}[]}) {
  if (rows.length === 0) return <p className={styles.muted}>—</p>;
  return (
    <ul className={styles.countList}>
      {rows.map((row) => (
        <li key={row.label}>
          <span>{row.label}</span>
          <strong>{row.n}</strong>
        </li>
      ))}
    </ul>
  );
}

function formatHours(hours: number | null | undefined) {
  if (hours === null || hours === undefined) return '—';
  return hours >= 48 ? `${Math.round((hours / 24) * 10) / 10} j` : `${hours} h`;
}

function RevenueTable({title, rows, label}: {title: string; rows: {label: string; currency: string; net_cents: number; payments: number}[]; label: (l: string) => string}) {
  return (
    <div>
      <h3 className={styles.subhead}>{title}</h3>
      {rows.length === 0 ? (
        <p className={styles.muted}>—</p>
      ) : (
        <ul className={styles.countList}>
          {rows.map((r) => (
            <li key={`${r.label}-${r.currency}`}>
              <span>{label(r.label)}</span>
              <strong>{formatCents(r.net_cents, r.currency)}</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
