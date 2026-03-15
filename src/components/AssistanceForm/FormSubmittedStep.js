'use client';

// Vendor
import React from 'react';
import {useIntl} from 'react-intl';
import Link from 'next/link';

// Styles
import styles from './styles.module.scss';

// Store
import {useAssistanceFormStore} from './store';

// Config
import config from '../../../config';

// Constants
import {AssistanceTypes} from '../../constants/assistance';

const translationKeysMap = {
  [AssistanceTypes.ASSISTANCE]: {
    title: 'assistance-form.steps.form-submitted.assistance.title',
    firstParagraph: 'assistance-form.steps.form-submitted.assistance.first-paragraph',
    secondParagraph: 'assistance-form.steps.form-submitted.guide-call-to-action'
  },
  [AssistanceTypes.INFORMATION]: {
    title: 'assistance-form.steps.form-submitted.information.title',
    firstParagraph: 'assistance-form.steps.form-submitted.information.first-paragraph',
    secondParagraph: 'assistance-form.steps.form-submitted.information.second-paragraph'
  },
  [AssistanceTypes.VERIFICATION]: {
    title: 'assistance-form.steps.form-submitted.verification.title',
    firstParagraph: 'assistance-form.steps.form-submitted.verification.first-paragraph',
    secondParagraph: 'assistance-form.steps.form-submitted.verification.second-paragraph'
  },
  [AssistanceTypes.VERIFICATION_ET_LETTRE]: {
    title: 'assistance-form.steps.form-submitted.verification.title',
    firstParagraph: 'assistance-form.steps.form-submitted.verification.first-paragraph',
    secondParagraph: 'assistance-form.steps.form-submitted.verification.second-paragraph'
  }
};

const FormSubmittedStep = () => {
  const intl = useIntl();
  const aboutCandidate = useAssistanceFormStore((s) => s.aboutCandidate);
  const getAssistancePackage = useAssistanceFormStore((s) => s.getAssistancePackage);
  const assistanceType = useAssistanceFormStore((s) => s.service);
  const assistancePackage = getAssistancePackage();

  const translations = translationKeysMap[assistanceType];
  const guidePath = `/guides/${assistancePackage.slug}`;

  const name = `${aboutCandidate.firstName} ${aboutCandidate.lastName}`;
  const assistancePackageTitle = assistancePackage.title.replace(/Assistance/gi, assistanceType);
  const messageTranslationKey = aboutCandidate.phone
    ? 'assistance-form.steps.submit-form.assistance-request-message-with-phone'
    : 'assistance-form.steps.submit-form.assistance-request-message';
  const assistanceMessage = intl.formatMessage(
    {id: messageTranslationKey},
    {
      name,
      assistancePackage: assistancePackageTitle,
      originCountry: aboutCandidate.originCountry,
      phone: aboutCandidate.phone
    }
  );
  const whatsAppBaseLink = config.contact?.phones?.[0]?.link || 'https://wa.me/16139171416';
  const whatsAppLink = `${whatsAppBaseLink}${whatsAppBaseLink.includes('?') ? '&' : '?'}text=${encodeURIComponent(assistanceMessage)}`;

  return (
    <div>
      <h2 className={styles.title} style={{textAlign: 'center'}}>
        {intl.formatMessage({id: translations.title})}
      </h2>

      <p className={styles['form-submitted-paragraph']}>{intl.formatMessage({id: translations.firstParagraph})}</p>

      <p
        dangerouslySetInnerHTML={{__html: intl.formatMessage({id: translations.secondParagraph})}}
        className={styles['form-submitted-paragraph']}
      />

      <div className={styles['centralized-button-wrapper']}>
        <Link href={guidePath} className="button special call-to-action">
          {intl.formatMessage({id: 'assistance-form.steps.form-submitted.read-guide-button'})}
        </Link>
        <a href={whatsAppLink} target="_blank" rel="noopener noreferrer" className="button call-to-action">
          {intl.formatMessage({id: 'assistance-form.steps.form-submitted.contact-whatsapp'})}
        </a>
      </div>
    </div>
  );
};

export default FormSubmittedStep;
