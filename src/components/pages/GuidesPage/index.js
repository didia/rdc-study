'use client';

// Vendor
import React from 'react';
import {useIntl} from 'react-intl';

// Styles
import ui from '../../site/ui.module.scss';

// Components
import SiteLayout from '../../site/SiteLayout';
import {Section, PageBanner, SectionHead} from '../../site/Section';
import DestinationTiles from '../../site/DestinationTiles';
import FeaturedGuide from '../../site/FeaturedGuide';
import ContentCard from '../../site/ContentCard';

const FEATURED_GUIDE_SLUG_KEY = 'site.guides.featured.guide-slug';

const GuidesPage = ({guides}) => {
  const intl = useIntl();
  const t = (id) => intl.formatMessage({id: `site.guides.${id}`});
  const featuredGuide = guides.find((guide) => guide.slug === intl.formatMessage({id: FEATURED_GUIDE_SLUG_KEY}));

  return (
    <SiteLayout active="/guides">
      <PageBanner eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')} />

      <Section tone="light">
        <DestinationTiles guides={guides} />
      </Section>

      <FeaturedGuide guide={featuredGuide} tone="white" />

      <Section tone="light">
        <SectionHead eyebrow={t('all.eyebrow')} title={t('all.title')} />
        <ul className={ui.grid3}>
          {guides.map((guide) => (
            <li key={guide.path}>
              <ContentCard
                href={guide.path}
                image={guide.thumbnail}
                kicker={t('card.badge')}
                title={guide.title}
                text={guide.excerpt}
                linkLabel={t('card.link')}
              />
            </li>
          ))}
        </ul>
      </Section>
    </SiteLayout>
  );
};

export default GuidesPage;
