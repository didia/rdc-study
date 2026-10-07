'use client';

import React from 'react';
import {useIntl} from 'react-intl';
import {useSearchParams} from 'next/navigation';

// Components
import SiteLayout from '../../site/SiteLayout';
import {Section, PageBanner} from '../../site/Section';
import {Trust} from '../../site/Sections';
import VisaWarning from '../../site/VisaWarning';
import AssistanceForm from '../../AssistanceForm';

const AssistanceProcess = ({assistancePackages, services, guideSlugs}) => {
  const intl = useIntl();
  const searchParams = useSearchParams();
  const fromGuide = searchParams.get('pour');
  const service = searchParams.get('service');

  return (
    <SiteLayout active="/accompagnement" newsletterTone="dark">
      <PageBanner
        eyebrow={intl.formatMessage({id: 'site.assistance.eyebrow'})}
        title={intl.formatMessage({id: 'site.assistance.process.title'})}
        lead={intl.formatMessage({id: 'site.assistance.process.lead'})}
      />

      <Section tone="light">
        <AssistanceForm
          assistancePackages={assistancePackages}
          services={services}
          guideSlugs={guideSlugs}
          fromGuide={fromGuide}
          service={service}
        />
      </Section>

      <Trust tone="dark" />
      <VisaWarning tone="white" />
    </SiteLayout>
  );
};

export default AssistanceProcess;
