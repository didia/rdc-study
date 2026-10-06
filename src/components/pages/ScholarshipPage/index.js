'use client';

// Vendor
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import classnames from 'classnames';
import {useIntl} from 'react-intl';

// Styles
import ui from '../../site/ui.module.scss';

// Components
import SiteLayout from '../../site/SiteLayout';
import {Section, PageBanner, SectionHead} from '../../site/Section';
import ScholarshipCard from '../../site/ScholarshipCard';
import ScholarshipDeadline from '../../ScholarshipDeadline';
import HtmlContent from '../../HtmlContent';

const ScholarshipPage = ({scholarship, otherScholarships}) => {
  const intl = useIntl();
  const t = (id) => intl.formatMessage({id: `site.scholarship.${id}`});

  const levels = (scholarship.levels || []).map((level) => intl.formatMessage({id: `scholarship-levels.${level}`}));
  const countries = (scholarship.targetCountries || [])
    .filter((code) => intl.messages[`shared.countries.${code}`])
    .map((code) => intl.formatMessage({id: `shared.countries.${code}`}));

  const eyebrow = [t('eyebrow'), levels.join(', '), countries.join(', ')].filter(Boolean).join(' · ');

  return (
    <SiteLayout active="/bourses" newsletterTone="dark">
      <PageBanner
        eyebrow={eyebrow}
        title={scholarship.title}
        lead={scholarship.excerpt}
        share={{path: scholarship.path, title: scholarship.title, excerpt: scholarship.excerpt}}
      />

      <Section tone="light">
        <div className={ui.detail}>
          <article>
            <div className={ui.cover}>
              <Image
                src={scholarship.thumbnail}
                alt={scholarship.title}
                fill
                priority
                sizes="(max-width: 980px) 100vw, 800px"
                style={{objectFit: 'cover'}}
              />
            </div>
            {scholarship.thumbnailCredits && (
              <div className={ui.coverCredit} dangerouslySetInnerHTML={{__html: scholarship.thumbnailCredits}} />
            )}

            <HtmlContent content={scholarship.content} />

            <p className={ui.meta} style={{marginTop: 24}}>
              {t('note')}
            </p>
          </article>

          <aside className={ui.aside}>
            {countries.length > 0 && (
              <div className={ui.fact}>
                <span>{t('facts.country')}</span>
                <b>{countries.join(', ')}</b>
              </div>
            )}
            {levels.length > 0 && (
              <div className={ui.fact}>
                <span>{t('facts.level')}</span>
                <b>{levels.join(', ')}</b>
              </div>
            )}
            <div className={ui.fact}>
              <span>{t('facts.deadline')}</span>
              <b>
                <ScholarshipDeadline date={scholarship.deadline} />
              </b>
            </div>
            <Link className={classnames(ui.btn)} href="/accompagnement">
              {intl.formatMessage({id: 'site.nav.cta'})}
            </Link>
          </aside>
        </div>
      </Section>

      {otherScholarships && otherScholarships.length > 0 && (
        <Section tone="white">
          <SectionHead
            title={intl.formatMessage({id: 'pages.scholarships-show.other-scholarships.title'})}
            action={
              <Link className={classnames(ui.btn, ui.ghost)} href="/bourses">
                {intl.formatMessage({id: 'scholarship-list.see-all'})}
              </Link>
            }
          />
          <ul className={ui.grid3}>
            {otherScholarships.slice(0, 3).map((other) => (
              <li key={other.path}>
                <ScholarshipCard scholarship={other} />
              </li>
            ))}
          </ul>
        </Section>
      )}
    </SiteLayout>
  );
};

export default ScholarshipPage;
