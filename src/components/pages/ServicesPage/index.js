'use client';

// Vendor
import React from 'react';
import {useIntl} from 'react-intl';

// Styles
import ui from '../../site/ui.module.scss';

// Components
import SiteLayout from '../../site/SiteLayout';
import {Section, PageBanner} from '../../site/Section';
import {Positioning, ServicesSteps, Trust} from '../../site/Sections';
import Testimonials from '../../site/Testimonials';
import ServiceCard from '../../site/ServiceCard';

// Data
import SERVICE_IMAGES from '../../site/service-images';

const getAssistanceRequestLink = ({slug, assistanceRequestLink}) =>
  assistanceRequestLink ? assistanceRequestLink : `/accompagnement?service=${slug}`;

const ServicesPage = ({services}) => {
  const intl = useIntl();
  const t = (id) => intl.formatMessage({id: `site.services.${id}`});

  return (
    <SiteLayout active="/nos-services">
      <PageBanner
        eyebrow={t('eyebrow')}
        title={t('title')}
        lead={t('lead')}
        share={{path: '/nos-services', title: t('title'), excerpt: t('lead')}}
      />

      <Section tone="light">
        <div className={ui.grid3}>
          {services.map((service) => (
            <ServiceCard
              key={service.slug}
              title={service.title}
              text={service.excerpt}
              price={service.price}
              image={SERVICE_IMAGES[service.slug]}
              href={getAssistanceRequestLink(service)}
            />
          ))}
        </div>
      </Section>

      <ServicesSteps tone="white" />
      <Positioning tone="dark" />
      <Testimonials tone="light" />
      <Trust tone="white" />
    </SiteLayout>
  );
};

export default ServicesPage;
