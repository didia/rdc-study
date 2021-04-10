// Vendor
import React, {useState} from 'react';
import {useIntl} from 'react-intl';
import T from 'prop-types';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import axios from 'axios';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import classnames from 'classnames';
import {object, string} from 'yup';

// Styles
import styles from './styles.module.scss';

// Components
import HtmlContent from '../HtmlContent';

// State
import {availableAssistanceTypesState, assistancePackageState, aboutCandidateState, assistanceTypeState} from './state';

// Config
import config from '../../../config';

const {contactFormEndpoint} = config;

// Constants
import Steps from './steps';
import {AssistanceTypes, AssistancePrices} from '../../constants/assistance';

// Utils
import getCurrentUrl from '../../utils/get-current-url';
import analyticsPushEvent from '../../utils/push-analytics-event';
import StepActions from './StepActions';
import StepForm from './StepForm';
import subscribeToNewsletter from '../../utils/subscribe-to-newsletter';

const getCheckedClassName = (currentValue, expectedValue) =>
  currentValue === expectedValue
    ? classnames('radio-button-label--checked', styles['radio-button-label--checked'])
    : null;

const assistanceTypeSchema = (intl) =>
  object().shape({
    assistanceType: string().required(intl.formatMessage({id: 'shared.assistance-types.required'}))
  });

const formattedAssistancePrice = (intl, price) => {
  const translationKey = price ? 'shared.assistance-types.price' : 'shared.assistance-types.price-free';
  return intl.formatMessage({id: translationKey}, {price});
};

const SubmitFormStep = ({onNextStep, onRestart, assistancePackages}) => {
  const intl = useIntl();
  const [showError, setShowError] = useState(false);
  const [message, setMessage] = useState(null);

  const aboutCandidate = useRecoilValue(aboutCandidateState);
  const assistancePackageSlug = useRecoilValue(assistancePackageState);
  const availableAssistanceTypes = useRecoilValue(availableAssistanceTypesState);
  const setAssistanceType = useSetRecoilState(assistanceTypeState);

  const assistancePackage = assistancePackages[assistancePackageSlug];

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

  const onSubmit = async (assistanceType) => {
    setShowError(false);

    const assistancePackageTitle = assistancePackage.title.replace(/Assistance/gi, assistanceType);

    const message = intl.formatMessage(
      {id: messageTranslationKey},
      {
        name,
        assistancePackage: assistancePackageTitle,
        originCountry: aboutCandidate.originCountry,
        phone: aboutCandidate.phone
      }
    );

    setMessage(message);

    try {
      if (assistanceType === AssistanceTypes.INFORMATION) {
        await subscribeToNewsletter({
          email: aboutCandidate.email,
          firstName: aboutCandidate.firstName,
          lastName: aboutCandidate.lastName
        });
      } else {
        await submitAssistance(message);
      }

      analyticsPushEvent({
        category: 'AssistanceForm',
        action: assistanceType,
        label: assistancePackageSlug,
        value: AssistancePrices[assistanceType]
      });

      onNextStep(Steps.FormSubmitted);
    } catch (error) {
      setShowError(true);

      if (!window.Sentry) {
        return;
      }

      window.Sentry.captureException(error);
    }
  };

  return (
    <StepForm className={styles['submit-step']} title={assistancePackage.title}>
      <HtmlContent content={assistancePackage.content} className={styles['assistance-package']} />

      <h3 className={styles.subtitle} id="submit-step-assistance-types-group">
        {intl.formatMessage({
          id: 'assistance-form.steps.submit-form.assistance-types-prompt'
        })}
      </h3>

      <Formik
        initialValues={{assistanceType: ''}}
        validationSchema={assistanceTypeSchema(intl)}
        onSubmit={(values) => {
          setAssistanceType(values.assistanceType);
          return onSubmit(values.assistanceType);
        }}
      >
        {({isSubmitting, isValid, values}) => (
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
                    getCheckedClassName(values.assistanceType, assistanceType.type)
                  )}
                >
                  <Field type="radio" name="assistanceType" value={assistanceType.type} className={styles.input} />
                  <div>
                    {intl.formatMessage({id: assistanceType.title})}
                    <p className="bold">{formattedAssistancePrice(intl, assistanceType.price)}</p>
                  </div>
                </label>
              ))}
            </div>

            <ErrorMessage name="assistanceType" className={styles['error-message']} component="p" />

            {showError && (
              <p
                className={styles['error-message']}
                dangerouslySetInnerHTML={{
                  __html: intl.formatMessage({id: 'assistance-form.steps.submit-form.error-message'}, {message})
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
