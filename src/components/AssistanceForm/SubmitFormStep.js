'use client';

// Vendor
import React, {useState} from 'react';
import {useIntl} from 'react-intl';
import axios from 'axios';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import classnames from 'classnames';

// Styles
import styles from './styles.module.scss';

// Components
import HtmlContent from '../HtmlContent';

// Store
import {useAssistanceFormStore} from './store';

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

const serviceSchema = (intl) =>
  z.object({
    service: z.string().min(1, intl.formatMessage({id: 'shared.assistance-types.required'}))
  });

const formattedAssistancePrice = (intl, price) => {
  const translationKey = price ? 'shared.assistance-types.price' : 'shared.assistance-types.price-free';
  return intl.formatMessage({id: translationKey}, {price});
};

const SubmitFormStep = ({onNextStep, onRestart}) => {
  const intl = useIntl();
  const [showError, setShowError] = useState(false);
  const [message, setMessage] = useState(null);

  const aboutCandidate = useAssistanceFormStore((s) => s.aboutCandidate);
  const getAssistancePackage = useAssistanceFormStore((s) => s.getAssistancePackage);
  const getAvailableAssistanceTypes = useAssistanceFormStore((s) => s.getAvailableAssistanceTypes);
  const setService = useAssistanceFormStore((s) => s.setService);
  const assistancePackage = getAssistancePackage();
  const availableAssistanceTypes = getAvailableAssistanceTypes();

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

  const {
    register,
    handleSubmit,
    watch,
    formState: {errors, isSubmitting}
  } = useForm({
    resolver: zodResolver(serviceSchema(intl)),
    defaultValues: {service: ''}
  });

  const serviceValue = watch('service');

  const onSubmit = async (values) => {
    setShowError(false);
    setService(values.service);

    const assistancePackageTitle = assistancePackage.title.replace(/Assistance/gi, values.service);

    const msg = intl.formatMessage(
      {id: messageTranslationKey},
      {
        name,
        assistancePackage: assistancePackageTitle,
        originCountry: aboutCandidate.originCountry,
        phone: aboutCandidate.phone
      }
    );

    setMessage(msg);

    try {
      if (values.service === AssistanceTypes.INFORMATION) {
        await subscribeToNewsletter({
          email: aboutCandidate.email,
          firstName: aboutCandidate.firstName,
          lastName: aboutCandidate.lastName
        });
      } else {
        await submitAssistance(msg);
      }

      analyticsPushEvent({
        category: 'AssistanceForm',
        action: values.service,
        label: assistancePackage.slug,
        value: AssistancePrices[values.service]
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

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div
          className={classnames(
            styles['radio-button-group'],
            errors.service ? styles['radio-button-group--invalid'] : null
          )}
        >
          {availableAssistanceTypes.map((assistanceType) => (
            <label
              key={assistanceType.type}
              className={classnames(
                'radio-button-label',
                styles['radio-button-label'],
                getCheckedClassName(serviceValue, assistanceType.type)
              )}
            >
              <input
                type="radio"
                value={assistanceType.type}
                className={styles.input}
                {...register('service')}
              />
              <div>
                {intl.formatMessage({id: assistanceType.title})}
                <p className="bold">{formattedAssistancePrice(intl, assistanceType.price)}</p>
              </div>
            </label>
          ))}
        </div>

        {errors.service && <p className={styles['error-message']}>{errors.service.message}</p>}

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
      </form>
    </StepForm>
  );
};

export default SubmitFormStep;
