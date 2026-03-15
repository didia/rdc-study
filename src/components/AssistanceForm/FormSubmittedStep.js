'use client';

// Vendor
import React from 'react';
import {useIntl} from 'react-intl';

// Styles
import styles from './styles.module.scss';

// Store
import {useAssistanceFormStore} from './store';

// Config
import config from '../../../config';

const FormSubmittedStep = () => {
  const intl = useIntl();
  const aboutCandidate = useAssistanceFormStore((s) => s.aboutCandidate);
  const getAssistancePackage = useAssistanceFormStore((s) => s.getAssistancePackage);
  const assistanceType = useAssistanceFormStore((s) => s.service);
  const assistancePackage = getAssistancePackage();

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
        {intl.formatMessage({id: 'assistance-form.steps.form-submitted.title'})}
      </h2>

      <p className={styles['form-submitted-paragraph']}>
        {intl.formatMessage({id: 'assistance-form.steps.form-submitted.message'})}
      </p>

      <div className={styles['centralized-button-wrapper']}>
        <a
          href={whatsAppLink}
          target="_blank"
          rel="noopener noreferrer"
          className="button special call-to-action"
        >
          {intl.formatMessage({id: 'assistance-form.steps.form-submitted.contact-whatsapp'})}
        </a>
      </div>
    </div>
  );
};

export default FormSubmittedStep;
