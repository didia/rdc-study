'use client';

// Vendor
import React from 'react';
import Link from 'next/link';
import classnames from 'classnames';
import {useIntl} from 'react-intl';

import ui from '../../site/ui.module.scss';
import SiteLayout from '../../site/SiteLayout';
import {Section, PageBanner} from '../../site/Section';

const NotFoundPage = () => {
  const intl = useIntl();

  return (
    <SiteLayout withNewsletter={false}>
      <PageBanner
        eyebrow={intl.formatMessage({id: 'site.not-found.eyebrow'})}
        title={intl.formatMessage({id: 'not-found.title'})}
        lead={intl.formatMessage({id: 'not-found.message-text'})}
      />
      <Section tone="light">
        <Link href="/" className={classnames(ui.btn)}>
          {intl.formatMessage({id: 'not-found.return-home-button-text'})}
        </Link>
      </Section>
    </SiteLayout>
  );
};

export default NotFoundPage;
