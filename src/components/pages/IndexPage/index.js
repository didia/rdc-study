'use client';

// Vendor
import React from 'react';
import T from 'prop-types';
import Link from 'next/link';
import classnames from 'classnames';
import {useIntl} from 'react-intl';

// Styles
import styles from './styles.module.scss';
import ui from '../../site/ui.module.scss';

// Components
import SiteLayout from '../../site/SiteLayout';
import {Section, Eyebrow, SectionHead} from '../../site/Section';
import {Positioning, Journey, Trust} from '../../site/Sections';
import Testimonials from '../../site/Testimonials';
import DestinationTiles from '../../site/DestinationTiles';
import ScholarshipCard from '../../site/ScholarshipCard';
import ServiceCard from '../../site/ServiceCard';

// Data
import SERVICE_IMAGES from '../../site/service-images';

const STAT_IDS = ['families', 'since', 'countries'];

const getServiceHref = ({slug, assistanceRequestLink}) => assistanceRequestLink || `/accompagnement?service=${slug}`;

const Stats = ({t}) => (
  <div className={styles.stats}>
    {STAT_IDS.map((id) => (
      <div key={id}>
        <strong>{t(`stats.${id}.value`)}</strong>
        <span>{t(`stats.${id}.label`)}</span>
      </div>
    ))}
  </div>
);

const Hero = ({t}) => (
  <div className={styles.hero}>
    <div>
      <Eyebrow>{t('hero.eyebrow')}</Eyebrow>
      <h1>
        {t('hero.title-start')} <span>{t('hero.title-highlight')}</span>
      </h1>
      <p className={styles.lead}>{t('hero.lead')}</p>
      <div className={styles.cta}>
        <Link className={ui.btn} href="/guides">
          {t('hero.cta-primary')}
        </Link>
        <Link className={classnames(ui.btn, styles.ghost)} href="/bourses">
          {t('hero.cta-secondary')}
        </Link>
      </div>
      <Stats t={t} />
    </div>
    <div className={styles.photo}>
      <div className={styles.float}>
        <strong>{t('stats.families.value')}</strong>
        <span>{t('hero.float-text')}</span>
      </div>
    </div>
  </div>
);

const IndexPage = ({destinations, scholarships, services}) => {
  const intl = useIntl();
  const t = (id) => intl.formatMessage({id: `site.${id}`});

  return (
    <SiteLayout active="/">
      <Hero t={t} />

      <Section tone="light">
        <SectionHead
          eyebrow={t('home.destinations.eyebrow')}
          title={t('home.destinations.title')}
          action={
            <Link className={classnames(ui.btn, ui.ghost)} href="/guides">
              {t('home.destinations.link')}
            </Link>
          }
        />
        <DestinationTiles guides={destinations} />
      </Section>

      <Positioning tone="dark" />
      <Journey tone="white" />

      <Section tone="light">
        <SectionHead
          eyebrow={t('home.scholarships.eyebrow')}
          title={t('home.scholarships.title')}
          action={
            <Link className={classnames(ui.btn, ui.ghost)} href="/bourses">
              {t('home.scholarships.link')}
            </Link>
          }
        />
        <ul className={ui.grid3}>
          {scholarships.map((scholarship) => (
            <li key={scholarship.path}>
              <ScholarshipCard scholarship={scholarship} />
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="white">
        <SectionHead
          eyebrow={t('home.services.eyebrow')}
          title={t('home.services.title')}
          lead={t('home.services.lead')}
          action={
            <Link className={classnames(ui.btn, ui.ghost)} href="/nos-services">
              {t('home.services.link')}
            </Link>
          }
        />
        <div className={ui.grid3}>
          {services.map((service) => (
            <ServiceCard
              key={service.slug}
              title={service.title}
              text={service.excerpt}
              price={service.price}
              image={SERVICE_IMAGES[service.slug]}
              href={getServiceHref(service)}
            />
          ))}
        </div>
      </Section>

      <Testimonials tone="light" />
      <Trust tone="dark" />
    </SiteLayout>
  );
};

IndexPage.propTypes = {
  destinations: T.arrayOf(T.object).isRequired,
  scholarships: T.arrayOf(T.object).isRequired,
  services: T.arrayOf(T.object).isRequired
};

export default IndexPage;
