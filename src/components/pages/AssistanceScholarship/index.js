'use client';

import Link from 'next/link';
import React from 'react';
import {FormattedMessage, useIntl} from 'react-intl';

// Components
import SiteLayout from '../../site/SiteLayout';
import {Section, PageBanner} from '../../site/Section';
import {Trust} from '../../site/Sections';
import VisaWarning from '../../site/VisaWarning';
import ui from '../../site/ui.module.scss';

const AssistanceScholarship = () => {
  const intl = useIntl();

  return (
    <SiteLayout active="/accompagnement" newsletterTone="dark">
      <PageBanner
        eyebrow={intl.formatMessage({id: 'site.assistance.eyebrow'})}
        title={intl.formatMessage({id: 'site.assistance.scholarship.title'})}
      />

      <Section tone="light">
        <p className={ui.lead} style={{maxWidth: 'none', fontSize: 19}}>
          Nous n’offrons malheureusement pas de bourses! Nous accompagnons ceux qui souhaitent poursuivre leurs études
          supérieures à l’étranger par leurs propres moyens. Vous trouverez toutes les offres de bourses dont nous avons
          connaissance sur notre site web
          <FormattedMessage id="shared.link.site">
            {(text) => (
              <Link href="/bourses" style={{color: '#118aec'}}>
                {text}
              </Link>
            )}
          </FormattedMessage>
        </p>
      </Section>

      <Trust tone="dark" />
      <VisaWarning tone="white" />
    </SiteLayout>
  );
};

export default AssistanceScholarship;
