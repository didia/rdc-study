'use client';

// Vendor
import React from 'react';
import Link from 'next/link';
import classnames from 'classnames';
import {FormattedMessage, useIntl} from 'react-intl';
import {useSearchParams} from 'next/navigation';

// Styles
import styles from './styles.module.scss';
import ui from '../../site/ui.module.scss';

// Components
import SiteLayout from '../../site/SiteLayout';
import {Section, PageBanner} from '../../site/Section';
import {Trust} from '../../site/Sections';
import VisaWarning from '../../site/VisaWarning';

const AssistancePage = () => {
  const intl = useIntl();
  const query = useSearchParams().toString();
  const t = (id) => intl.formatMessage({id: `site.assistance.${id}`});

  return (
    <SiteLayout active="/accompagnement" newsletterTone="dark">
      <PageBanner eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')} />

      <Section tone="light">
        <div className={styles.choices}>
          <FormattedMessage id="pages.assistance.call-to-action-button-text">
            {(text) => (
              <Link href="/assistance-bourse" className={classnames(ui.btn, ui.ghost)}>
                {text}
              </Link>
            )}
          </FormattedMessage>
          <FormattedMessage id="pages.accompanied.call-to-action-button-text">
            {(text) => (
              <Link href={query ? `/assistance-process?${query}` : '/assistance-process'} className={ui.btn}>
                {text}
              </Link>
            )}
          </FormattedMessage>
        </div>
      </Section>

      <Trust tone="dark" />
      <VisaWarning tone="white" />
    </SiteLayout>
  );
};

export default AssistancePage;
