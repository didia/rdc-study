'use client';

import Link from 'next/link';
import React from 'react';
import {FormattedMessage} from 'react-intl';
import {useSearchParams} from 'next/navigation';

// Styles
import styles from './styles.module.scss';

// Components
import GenericPage from '../GenericPage';
import AssistanceForm from '../../AssistanceForm';
import CompetitiveAdvantages from '../IndexPage/CompetitiveAdvantages';

const page = {
  description:
    "L'accompagnement RDC ETUDES consiste a vous orienter dans votre projet d'etudes du choix de l'universite jusqu'a l'obtention de votre visa.",
  title: 'JE SOUHAITE ETRE ASSISTE PAR UN MENTOR RDC ETUDES.',
  path: '/accompagnement'
};

const AssistanceProcess = ({assistancePackages, services}) => {
  const searchParams = useSearchParams();
  const fromGuide = searchParams.get('pour');
  const service = searchParams.get('service');

  return (
    <GenericPage page={page} bannerClassName={styles.banner}>
      <AssistanceForm
        assistancePackages={assistancePackages}
        services={services}
        fromGuide={fromGuide}
        service={service}
      />

      <section className={styles['offer-block']}>
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

export default AssistanceProcess;
