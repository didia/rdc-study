'use client';

// Vendor
import React from 'react';
import Link from 'next/link';

// Styles
import styles from './styles.module.scss';

import GenericPage from '../GenericPage';
import ScholarshipList from '../../../components/ScholarshipList';
import {FormattedMessage} from 'react-intl';

const ScholarshipPage = ({activeOnly, page, scholarships}) => {
  let disclaimerTranslationId;
  let linkLabelTranslationId;
  let link;

  if (activeOnly) {
    disclaimerTranslationId = 'pages.scholarships.active-only-disclaimer';
    linkLabelTranslationId = 'pages.scholarships.all-scholarships-link-label';
    link = '/toutes-les-bourses';
  } else {
    disclaimerTranslationId = 'pages.scholarships.all-disclaimer';
    linkLabelTranslationId = 'pages.scholarships.active-only-link-label';
    link = '/bourses';
  }

  return (
    <GenericPage page={page}>
      <p className={styles.disclaimer}>
        <FormattedMessage id={disclaimerTranslationId} />
        <FormattedMessage id={linkLabelTranslationId}>
          {(linkLabel) => (
            <Link className={styles.link} href={link}>
              {linkLabel}
            </Link>
          )}
        </FormattedMessage>
      </p>
      <ScholarshipList showNewsletter scholarships={scholarships} showAllScholarshipsLink={activeOnly} />
    </GenericPage>
  );
};

export default ScholarshipPage;
