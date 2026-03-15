'use client';

// Vendor
import React from 'react';
import Link from 'next/link';
import {FormattedMessage} from 'react-intl';
import {useSearchParams} from 'next/navigation';

// Styles
import styles from './styles.module.scss';

// Components
import GenericPage from '../GenericPage';
import AssistanceForm from '../../AssistanceForm';
import CompetitiveAdvantages from '../IndexPage/CompetitiveAdvantages';

const page = {
 title: 'JE VEUX UNE ASSISTANCE',
  path: '/accompagnement'
};

const AssistancePage = ({assistancePackages, services}) => {
  const searchParams = useSearchParams();
  const fromGuide = searchParams.get('pour');
  const service = searchParams.get('service');

  return (
    <GenericPage page={page} bannerClassName={styles.banner}>
      <section style={{position: 'relative', marginTop: '-176px'}}>
        <div style={{margin: 'auto', width: '585px'}}>
          <FormattedMessage id="pages.assistance.call-to-action-button-text">
            {(text) => (
              <Link href="/assistance-bourse" className="button special call-to-action" style={{marginRight: '7px'}}>
                {text}
              </Link>
            )}
          </FormattedMessage>
          <FormattedMessage id="pages.accompanied.call-to-action-button-text">
            {(text) => (
              <Link href="/assistance-process" className="button special call-to-action">
                {text}
              </Link>
            )}
          </FormattedMessage>
        </div>
        <br />
        <br />
        <br />
        <CompetitiveAdvantages />

        <p style={{marginTop: '20px'}}>
          <FormattedMessage id="pages.assistance.visa.warning" />
          <FormattedMessage id="pages.assistance.visa.warning-learn-more">
            {(text) => <Link href="/assistance-visa">{text}</Link>}
          </FormattedMessage>
        </p>
      </section>
    </GenericPage>
  );
};

export default AssistancePage;
