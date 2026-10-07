'use client';

// Vendor
import React, {useMemo, useState} from 'react';
import Link from 'next/link';
import classnames from 'classnames';
import {isSameMonth, isSameWeek, startOfDay, isBefore} from 'date-fns';
import {useIntl} from 'react-intl';

// Styles
import styles from './styles.module.scss';
import ui from '../../site/ui.module.scss';

// Components
import SiteLayout from '../../site/SiteLayout';
import {Section, PageBanner} from '../../site/Section';
import ScholarshipCard from '../../site/ScholarshipCard';

const PAGE_SIZE = 9;
const LEVEL_ORDERS = ['undergraduate', 'graduate', 'postgraduate', 'research', 'internship', 'formation'];
const ALL = 'all';
// Front matter value for scholarships open to every academic level.
const ALL_LEVELS = 'all';

const matchesDeadline = (deadline, filter) => {
  if (filter === ALL) return true;
  if (filter === 'none') return !deadline;
  if (!deadline) return false;

  const date = new Date(deadline);
  const now = new Date();
  if (isBefore(date, startOfDay(now))) return false;
  if (filter === 'week') return isSameWeek(date, now, {weekStartsOn: 1});
  return isSameMonth(date, now);
};

const Select = ({label, value, onChange, options}) => (
  <label className={styles.select}>
    <span>{label}</span>
    <select value={value} onChange={(event) => onChange(event.target.value)}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </label>
);

const ScholarshipsPage = ({activeOnly, page, scholarships}) => {
  const intl = useIntl();
  const [country, setCountry] = useState(ALL);
  const [level, setLevel] = useState(ALL);
  const [deadline, setDeadline] = useState(ALL);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const t = (id) => intl.formatMessage({id: `site.scholarships.${id}`});

  const countryLabel = (code) =>
    intl.messages[`shared.countries.${code}`] ? intl.formatMessage({id: `shared.countries.${code}`}) : code;

  const countryOptions = useMemo(() => {
    const codes = new Set(scholarships.flatMap((s) => s.targetCountries || []));
    return [...codes]
      .map((code) => ({value: code, label: countryLabel(code)}))
      .sort((a, b) => a.label.localeCompare(b.label, 'fr'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scholarships]);

  const levelOptions = useMemo(() => {
    const levels = new Set(scholarships.flatMap((s) => s.levels || []));
    return LEVEL_ORDERS.filter((l) => levels.has(l)).map((l) => ({
      value: l,
      label: intl.formatMessage({id: `scholarship-levels.${l}`})
    }));
  }, [scholarships, intl]);

  const filtered = scholarships.filter(
    (s) =>
      (country === ALL || (s.targetCountries || []).includes(country)) &&
      (level === ALL || (s.levels || []).some((l) => l === level || l === ALL_LEVELS)) &&
      matchesDeadline(s.deadline, deadline)
  );

  const resetPaging = (setter) => (value) => {
    setter(value);
    setVisibleCount(PAGE_SIZE);
  };

  const disclaimer = activeOnly
    ? {
        id: 'pages.scholarships.active-only-disclaimer',
        linkId: 'pages.scholarships.all-scholarships-link-label',
        to: '/toutes-les-bourses'
      }
    : {id: 'pages.scholarships.all-disclaimer', linkId: 'pages.scholarships.active-only-link-label', to: '/bourses'};

  return (
    <SiteLayout active="/bourses" newsletterTone="dark">
      <PageBanner
        eyebrow={t('eyebrow')}
        title={page.title}
        lead={page.description}
        share={page.socialShareEnabled ? {path: page.path, title: page.title, excerpt: page.description} : undefined}
      />

      <Section tone="light">
        <div className={styles.filters}>
          <Select
            label={t('filters.country')}
            value={country}
            onChange={resetPaging(setCountry)}
            options={[{value: ALL, label: t('filters.country-all')}, ...countryOptions]}
          />
          <Select
            label={t('filters.level')}
            value={level}
            onChange={resetPaging(setLevel)}
            options={[{value: ALL, label: t('filters.level-all')}, ...levelOptions]}
          />
          <Select
            label={t('filters.deadline')}
            value={deadline}
            onChange={resetPaging(setDeadline)}
            options={[
              {value: ALL, label: t('filters.deadline-all')},
              {value: 'week', label: t('filters.deadline-week')},
              {value: 'month', label: t('filters.deadline-month')},
              {value: 'none', label: t('filters.deadline-none')}
            ]}
          />
        </div>

        <p className={styles.note}>
          {intl.formatMessage({id: disclaimer.id})}{' '}
          <Link href={disclaimer.to} className={styles.link}>
            {intl.formatMessage({id: disclaimer.linkId})}
          </Link>
        </p>

        {filtered.length === 0 ? (
          <p className={styles.empty}>{t('empty')}</p>
        ) : (
          <ul className={ui.grid3}>
            {filtered.slice(0, visibleCount).map((scholarship) => (
              <li key={scholarship.path}>
                <ScholarshipCard scholarship={scholarship} />
              </li>
            ))}
          </ul>
        )}

        {visibleCount < filtered.length && (
          <div className={styles.more}>
            <button
              type="button"
              className={classnames(ui.btn, ui.ghost)}
              onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
            >
              {t('load-more')}
            </button>
          </div>
        )}
      </Section>
    </SiteLayout>
  );
};

export default ScholarshipsPage;
