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
import {Section, PageBanner} from '../../site/Section';
import HtmlContent from '../../HtmlContent';

const FaqsPage = ({questions}) => {
  const intl = useIntl();
  const t = (id) => intl.formatMessage({id: `site.faq.${id}`});

  return (
    <SiteLayout active="/questions-populaires" withNewsletter={false}>
      <PageBanner eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')} />

      <Section tone="light">
        <div className={styles.list}>
          {questions.map(({question, answer}, index) => (
            <details key={`question-${index}`} open={index === 0}>
              <summary>{question}</summary>
              <HtmlContent content={answer} />
            </details>
          ))}
        </div>
      </Section>

      <Section tone="dark" style={{paddingBlock: 64}}>
        <div className={styles.more}>
          <div>
            <h2 className={ui.title}>{t('more.title')}</h2>
            <p className={ui.lead}>{t('more.text')}</p>
          </div>
          <Link className={classnames(ui.btn)} href="/accompagnement">
            {intl.formatMessage({id: 'site.nav.cta'})}
          </Link>
        </div>
      </Section>
    </SiteLayout>
  );
};

FaqsPage.propTypes = {
  questions: T.arrayOf(T.object)
};

export default FaqsPage;
