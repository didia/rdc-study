// Vendor
import React, {useState, useEffect} from 'react';
import {useIntl} from 'react-intl';
import T from 'prop-types';
import {useRecoilValue} from 'recoil';
import axios from 'axios';

// Styles
import styles from './styles.module.scss';

// Components
import HtmlContent from '../HtmlContent';

// State
import {assistancePackageState, aboutCandidateState} from './state';

// Config
import config from '../../../config';

const {contactFormEndpoint} = config;

// Constants
import Steps from './steps';

// Utils
import getCurrentUrl from '../../utils/get-current-url';
import analyticsPushEvent from '../../utils/push-analytics-event';
import StepActions from './StepActions';

const SubmitFormStep = ({onNextStep, onRestart, assistancePackages}) => {
  const intl = useIntl();
  const [isSubmitting, setSubmitting] = useState(false);
  const [showError, setShowError] = useState(false);

  const aboutCandidate = useRecoilValue(aboutCandidateState);
  const assistancePackageSlug = useRecoilValue(assistancePackageState);

  const assistancePackage = assistancePackages[assistancePackageSlug];

  const name = `${aboutCandidate.firstName} ${aboutCandidate.lastName}`;
  const messageTranslationKey = aboutCandidate.phone ? 'assistance-form.steps.submit-form.assistance-request-message-with-phone' : 'assistance-form.steps.submit-form.assistance-request-message';
  const message = intl.formatMessage(
    {id: messageTranslationKey},
    {name, assistancePackage: assistancePackage.title, originCountry: aboutCandidate.originCountry, phone: aboutCandidate.phone}
  );

  useEffect(() => {
    analyticsPushEvent({
      category: 'AssistanceForm',
      action: 'ShowAssistancePackage',
      label: assistancePackageSlug
    });
  }, []);

  const onSubmit = async () => {
    setSubmitting(true);
    setShowError(false);

    const payload = {
      message,
      name,
      form: 'assistance',
      email: aboutCandidate.email,
      link: getCurrentUrl()
    };

    try {
      await axios.post(contactFormEndpoint, payload);
      onNextStep(Steps.FormSubmitted);

      analyticsPushEvent({
        category: 'AssistanceForm',
        action: 'SubmitSuccess',
        label: assistancePackageSlug
      });
    } catch (error) {
      setShowError(true);
      setSubmitting(false);

      analyticsPushEvent({
        category: 'AssistanceForm',
        action: 'SubmitError',
        label: assistancePackageSlug,
        value: error
      });

      window.console.error('An error occured: ', error);
    }
  };

  return (
    <div className={styles['submit-step']}>
      <h2 className={styles.title}>{assistancePackage.title}</h2>

      <p>{intl.formatMessage({id: 'assistance-form.steps.submit-form.greetings'}, {name: aboutCandidate.firstName})}</p>

      <HtmlContent content={assistancePackage.content} className={styles['assistance-package']} />

      <p
        dangerouslySetInnerHTML={{
          __html: intl.formatMessage(
            {id: 'assistance-form.steps.submit-form.pricing-paragraph1'},
            {email: aboutCandidate.email}
          )
        }}
      />
      <p>{intl.formatMessage({id: 'assistance-form.steps.submit-form.pricing-paragraph2'})}</p>

      <p>{intl.formatMessage({id: 'assistance-form.steps.submit-form.call-to-action'})}</p>

      {showError && (
        <p
          className={styles['error-message']}
          dangerouslySetInnerHTML={{
            __html: intl.formatMessage(
              {id: 'assistance-form.steps.submit-form.error-message'},
              {message, assistancePackage: assistancePackage.title}
            )
          }}
        />
      )}

      <StepActions
        disabled={isSubmitting}
        nextButtonLabelKey="assistance-form.steps.submit-form.next-button-label"
        previousButtonLabelKey="assistance-form.steps.submit-form.restart-button-label"
        onPrevious={onRestart}
        onNext={onSubmit}
      />
    </div>
  );
};

SubmitFormStep.propTypes = {
  assistancePackages: T.objectOf(
    T.shape({
      content: T.string.isRequired,
      slug: T.string.isRequired,
      title: T.string.isRequired
    })
  ),
  onNextStep: T.func,
  onRestart: T.func
};

export default SubmitFormStep;
