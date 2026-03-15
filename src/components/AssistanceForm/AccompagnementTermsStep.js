'use client';

// Vendor
import React, {useState} from 'react';
import {useIntl} from 'react-intl';

// Styles
import styles from './styles.module.scss';

// Store
import {useAssistanceFormStore} from './store';

// Config
import config from '../../../config';

// Constants
import Steps from './steps';
import {AssistancePrices} from '../../constants/assistance';

// Utils
import getCurrentUrl from '../../utils/get-current-url';
import analyticsPushEvent from '../../utils/push-analytics-event';
import StepForm from './StepForm';
import {submitAssistanceRequest} from './utils';

const {contactFormEndpoint} = config;

const AccompagnementTermsStep = ({onNextStep, onPreviousStep}) => {
  const intl = useIntl();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showError, setShowError] = useState(false);

  const aboutCandidate = useAssistanceFormStore((s) => s.aboutCandidate);
  const getAssistancePackage = useAssistanceFormStore((s) => s.getAssistancePackage);
  const service = useAssistanceFormStore((s) => s.service);

  const assistancePackage = getAssistancePackage();
  const name = `${aboutCandidate.firstName} ${aboutCandidate.lastName}`;
  const assistancePackageTitle = assistancePackage.title.replace(/Assistance/gi, service);
  const messageTranslationKey = aboutCandidate.phone
    ? 'assistance-form.steps.submit-form.assistance-request-message-with-phone'
    : 'assistance-form.steps.submit-form.assistance-request-message';

  const msg = intl.formatMessage(
    {id: messageTranslationKey},
    {
      name,
      assistancePackage: assistancePackageTitle,
      originCountry: aboutCandidate.originCountry,
      phone: aboutCandidate.phone
    }
  );

  const handleConfirm = async () => {
    setShowError(false);
    setIsSubmitting(true);
    try {
      await submitAssistanceRequest({
        endpoint: contactFormEndpoint,
        message: msg,
        name,
        email: aboutCandidate.email,
        link: getCurrentUrl()
      });
      analyticsPushEvent({
        category: 'AssistanceForm',
        action: service,
        label: assistancePackage.slug,
        value: AssistancePrices[service]
      });
      onNextStep(Steps.FormSubmitted);
    } catch (error) {
      setShowError(true);
      if (typeof window !== 'undefined' && window.Sentry) {
        window.Sentry.captureException(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <StepForm
      className={styles['accompagnement-terms-step']}
      title={intl.formatMessage({id: 'assistance-form.steps.accompagnement-terms.title'})}
    >
      <p className={styles['form-submitted-paragraph']}>
        {intl.formatMessage({id: 'assistance-form.steps.accompagnement-terms.paragraph1'})}
      </p>
      <p className={styles['form-submitted-paragraph']}>
        {intl.formatMessage({id: 'assistance-form.steps.accompagnement-terms.paragraph2'})}
      </p>
      <p className={styles['form-submitted-paragraph']}>
        {intl.formatMessage({id: 'assistance-form.steps.accompagnement-terms.question'})}
      </p>

      {showError && (
        <p
          className={styles['error-message']}
          dangerouslySetInnerHTML={{
            __html: intl.formatMessage({id: 'assistance-form.steps.submit-form.error-message'}, {message: msg})
          }}
        />
      )}

      <div className={styles['centralized-button-wrapper']}>
        <button type="button" className="button special" onClick={handleConfirm} disabled={isSubmitting}>
          {intl.formatMessage({id: 'assistance-form.steps.accompagnement-terms.yes'})}
        </button>
        <button type="button" className="button" onClick={onPreviousStep} disabled={isSubmitting}>
          {intl.formatMessage({id: 'assistance-form.steps.accompagnement-terms.no'})}
        </button>
      </div>
    </StepForm>
  );
};

export default AccompagnementTermsStep;
