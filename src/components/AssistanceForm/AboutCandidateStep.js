'use client';

// Vendor
import React from 'react';
import {useIntl} from 'react-intl';
import classnames from 'classnames';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';

// Styles
import styles from './styles.module.scss';

// Components
import Selector from '../Selector';
import StepActions from './StepActions';
import StepForm from './StepForm';

// Store
import {useAssistanceFormStore} from './store';

// Const
import {Steps} from './steps';

const SUPPORTED_ORIGIN_COUNTRIES = [
  {
    labelKey: 'shared.countries.cd',
    value: 'congo-kinshasa'
  },
  {
    labelKey: 'shared.countries.cg',
    value: 'congo-brazza'
  },
  {labelKey: 'shared.countries.gn'},
  {labelKey: 'shared.countries.ga'},
  {labelKey: 'shared.countries.ci'},
  {labelKey: 'shared.countries.ne'},
  {labelKey: 'shared.countries.tg'}, // Alphabetical order after here
  {labelKey: 'shared.countries.bf'},
  {labelKey: 'shared.countries.bi'},
  {labelKey: 'shared.countries.bj'},
  {labelKey: 'shared.countries.cf'},
  {labelKey: 'shared.countries.cm'},
  {labelKey: 'shared.countries.dj'},
  {labelKey: 'shared.countries.dz'},
  {labelKey: 'shared.countries.gb'},
  {labelKey: 'shared.countries.gh'},
  {labelKey: 'shared.countries.km'},
  {labelKey: 'shared.countries.ma'},
  {labelKey: 'shared.countries.mg'},
  {labelKey: 'shared.countries.ml'},
  {labelKey: 'shared.countries.mu'},
  {labelKey: 'shared.countries.rw'},
  {labelKey: 'shared.countries.sa'},
  {labelKey: 'shared.countries.sc'},
  {labelKey: 'shared.countries.sn'},
  {labelKey: 'shared.countries.td'},
  {labelKey: 'shared.countries.tn'},
  {labelKey: 'shared.countries.be'}, // Non African Countries
  {labelKey: 'shared.countries.br'},
  {labelKey: 'shared.countries.ca'},
  {labelKey: 'shared.countries.ch'},
  {labelKey: 'shared.countries.cn'},
  {labelKey: 'shared.countries.cytr'},
  {labelKey: 'shared.countries.de'},
  {labelKey: 'shared.countries.fr'},
  {labelKey: 'shared.countries.ht'},
  {labelKey: 'shared.countries.in'},
  {labelKey: 'shared.countries.jp'},
  {labelKey: 'shared.countries.ro'},
  {labelKey: 'shared.countries.ru'},
  {labelKey: 'shared.countries.tr'},
  {labelKey: 'shared.countries.us'},
  {labelKey: 'shared.other-text'}
];

const aboutCandidateSchema = (intl) =>
  z.object({
    firstName: z.string().min(1, intl.formatMessage({id: 'shared.forms.validation.required'})),
    lastName: z.string().min(1, intl.formatMessage({id: 'shared.forms.validation.required'})),
    phone: z.string().min(1, intl.formatMessage({id: 'shared.forms.validation.required'})),
    email: z
      .string()
      .min(1, intl.formatMessage({id: 'shared.forms.validation.required'}))
      .email(intl.formatMessage({id: 'shared.forms.validation.email'})),
    originCountry: z.string().min(1, intl.formatMessage({id: 'shared.forms.validation.required'}))
  });

const AboutCandidateStep = ({onNextStep, onPreviousStep}) => {
  const intl = useIntl();
  const aboutCandidateData = useAssistanceFormStore((s) => s.aboutCandidate);
  const setAboutCandidateData = useAssistanceFormStore((s) => s.setAboutCandidate);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: {errors, isSubmitting}
  } = useForm({
    resolver: zodResolver(aboutCandidateSchema(intl)),
    defaultValues: aboutCandidateData
  });

  const originCountryValue = watch('originCountry');

  const onSubmit = (values) => {
    setAboutCandidateData(values);
    onNextStep(Steps.SubmitForm);
  };

  return (
    <StepForm
      title={intl.formatMessage({id: 'assistance-form.steps.about-candidate.title'})}
      description={intl.formatMessage({id: 'assistance-form.steps.about-candidate.description'})}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={classnames(styles.fields, styles['fields--2-by-2'])}>
          <div className={classnames('field', styles.field)}>
            <label htmlFor="firstName" className={styles.label}>
              {intl.formatMessage({id: 'assistance-form.steps.about-candidate.labels.first-name'})}
            </label>

            <input
              type="text"
              className={classnames(styles.input, errors.firstName ? styles.error : null)}
              placeholder={intl.formatMessage({
                id: 'assistance-form.steps.about-candidate.placeholders.first-name'
              })}
              {...register('firstName')}
            />

            {errors.firstName && <div className={styles['error-message']}>{errors.firstName.message}</div>}
          </div>

          <div className={classnames('field', styles.field)}>
            <label htmlFor="lastName" className={styles.label}>
              {intl.formatMessage({id: 'assistance-form.steps.about-candidate.labels.last-name'})}
            </label>

            <input
              type="text"
              className={classnames(styles.input, errors.lastName ? styles.error : null)}
              placeholder={intl.formatMessage({
                id: 'assistance-form.steps.about-candidate.placeholders.last-name'
              })}
              {...register('lastName')}
            />

            {errors.lastName && <div className={styles['error-message']}>{errors.lastName.message}</div>}
          </div>

          <div className={classnames('field', styles.field)}>
            <label htmlFor="email" className={styles.label}>
              {intl.formatMessage({id: 'assistance-form.steps.about-candidate.labels.email'})}
            </label>

            <input
              type="email"
              className={classnames(styles.input, errors.email ? styles.error : null)}
              placeholder={intl.formatMessage({id: 'assistance-form.steps.about-candidate.placeholders.email'})}
              {...register('email')}
            />

            {errors.email && <div className={styles['error-message']}>{errors.email.message}</div>}
          </div>

          <div className={classnames('field', styles.field)}>
            <label htmlFor="phone" className={styles.label}>
              {intl.formatMessage({id: 'assistance-form.steps.about-candidate.labels.phone'})}
            </label>

            <input
              type="tel"
              className={classnames(styles.input, errors.phone ? styles.error : null)}
              placeholder={intl.formatMessage({id: 'assistance-form.steps.about-candidate.placeholders.phone'})}
              {...register('phone')}
            />

            {errors.phone && <div className={styles['error-message']}>{errors.phone.message}</div>}
          </div>

          <div className={classnames('field', styles.field)}>
            <label htmlFor="originCountry" className={styles.label}>
              {intl.formatMessage({id: 'assistance-form.steps.about-candidate.labels.origin-country'})}
            </label>

            <Selector
              options={SUPPORTED_ORIGIN_COUNTRIES}
              className={classnames(styles.input, errors.originCountry ? styles.error : null)}
              placeholderKey="shared.country-selector.placeholder"
              name="originCountry"
              value={originCountryValue}
              onChange={(e) => setValue('originCountry', e.target.value, {shouldValidate: true})}
            />

            {errors.originCountry && <div className={styles['error-message']}>{errors.originCountry.message}</div>}
          </div>
        </div>

        <StepActions disabled={isSubmitting} onPrevious={onPreviousStep} />
      </form>
    </StepForm>
  );
};

export default AboutCandidateStep;
