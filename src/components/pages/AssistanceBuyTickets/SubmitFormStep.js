// Vendor
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import T from 'prop-types';
import { useRecoilValue } from 'recoil';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import classnames from 'classnames';
import { object, string } from 'yup';

// Styles
import styles from './styles.module.scss';

// Components
import HtmlContent from '../../HtmlContent';

// State
import { aboutCandidateState, availableAssistanceTypesState, destinationDetailState } from './states';

// Config
import config from '../../../../config';

const { contactFormEndpoint } = config;

// Constants
//import Steps from './steps';
import { AssistanceTypes, AssistancePrices } from '../../../constants/assistance';

// Utils
import getCurrentUrl from '../../../utils/get-current-url';
import analyticsPushEvent from '../../../utils/push-analytics-event';
import StepActions from '../../AssistanceForm/StepActions';
import StepForm from '../../AssistanceForm/StepForm';
import subscribeToNewsletter from '../../../utils/subscribe-to-newsletter';

const getCheckedClassName = (currentValue, expectedValue) =>
  currentValue === expectedValue
    ? classnames('radio-button-label--checked', styles['radio-button-label--checked'])
    : null;

const serviceSchema = (intl) =>
  object().shape({
    service: string().required(intl.formatMessage({ id: 'shared.assistance-types.required' }))
  });

const formattedAssistancePrice = (intl, price) => {
  const translationKey = price ? 'shared.assistance-types.price' : 'shared.assistance-types.price-free';
  return intl.formatMessage({ id: translationKey }, { price });
};

const SubmitFormStep = ({ onNextStep, onRestart, steps }) => {
  const intl = useIntl();
  const [showError, setShowError] = useState(false);
  const [message, setMessage] = useState(null);

  const aboutCandidate = useRecoilValue(aboutCandidateState);
  const destinationDetail = useRecoilValue(destinationDetailState);
  const availableAssistanceTypes = useRecoilValue(availableAssistanceTypesState);

  const name = `${aboutCandidate.firstName} ${aboutCandidate.lastName}`;
  const messageTranslationKey = aboutCandidate.phone
    ? 'assistance-form.steps.submit-form.assistance-request-message-with-phone'
    : 'assistance-form.steps.submit-form.assistance-request-message';

  const submitAssistance = async (message) => {
    const payload = {
      message,
      name,
      form: 'assistance',
      email: aboutCandidate.email,
      link: getCurrentUrl()
    };

    await axios.post(contactFormEndpoint, payload);
  };

  const onSubmit = async (service) => {
    setShowError(false);

    const message = intl.formatMessage(
      { id: messageTranslationKey },
      {
        name,
        assistancePackage: "Achat-Billet",
        country: destinationDetail.country,
        city: destinationDetail.city,
        originCountry: aboutCandidate.originCountry,
        phone: aboutCandidate.phone
      }
    );

    setMessage(message);

    try {
      await submitAssistance(message);

      analyticsPushEvent({
        category: 'AssistanceForm',
        action: service,
        label: 'Achat-Billet',
        value: AssistancePrices[service]
      });

      onNextStep(steps.FormSubmitted);
    } catch (error) {
      setShowError(true);

      if (!window.Sentry) {
        return;
      }

      window.Sentry.captureException(error);
    }
  };

  return (
    <StepForm className={styles['submit-step']} title={'Achat Billet'}>
      
      <h3 className={styles.subtitle} id="submit-step-assistance-types-group">
        {intl.formatMessage({
          id: 'assistance-form.steps.submit-form.assistance-types-prompt'
        })}
      </h3>

      <Formik
        initialValues={{ service: '' }}
        validationSchema={serviceSchema(intl)}
        onSubmit={() => {
          return onSubmit(AssistanceTypes.CONSULTATION);
        }}
      >
        {({ isSubmitting, isValid, values }) => (
          <Form className={styles.form}>
            <div
              className={classnames(
                styles['radio-button-group'],
                !isValid ? styles['radio-button-group--invalid'] : null
              )}
            >
              {availableAssistanceTypes.map((assistanceType) => (
                <label
                  key={assistanceType.type}
                  className={classnames(
                    'radio-button-label',
                    styles['radio-button-label'],
                    getCheckedClassName(values.service, assistanceType.type)
                  )}
                >
                  <Field type="radio" name="service" value={assistanceType.type} className={styles.input} />
                  <div>
                    {intl.formatMessage({ id: assistanceType.title })}
                    <p className="bold">{formattedAssistancePrice(intl, assistanceType.price)}</p>
                  </div>
                </label>
              ))}
            </div>

            <ErrorMessage name="service" className={styles['error-message']} component="p" />

            {showError && (
              <p
                className={styles['error-message']}
                dangerouslySetInnerHTML={{
                  __html: intl.formatMessage({ id: 'assistance-form.steps.submit-form.error-message' }, { message })
                }}
              />
            )}

            <StepActions
              disabled={isSubmitting}
              nextButtonLabelKey="assistance-form.steps.submit-form.next-button-label"
              previousButtonLabelKey="assistance-form.steps.submit-form.restart-button-label"
              onPrevious={onRestart}
            />
          </Form>
        )}
      </Formik>
    </StepForm>
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
