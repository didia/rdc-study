// Vendor
import React from 'react';
import {useIntl} from 'react-intl';
import classnames from 'classnames';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import {string, object} from 'yup';
import T from 'prop-types';
import {useRecoilState} from 'recoil';

// Styles
import styles from './styles.module.scss';

// Utils
import {formikFieldErrorClass} from './utils';
import analyticsPushEvent from '../../utils/push-analytics-event';

// Components
import Selector from '../Selector';
import StepActions from './StepActions';
import StepForm from './StepForm';

// States
import {aboutCandidateState} from './state';

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
  object().shape({
    firstName: string().required(intl.formatMessage({id: 'shared.forms.validation.required'})),
    lastName: string().required(intl.formatMessage({id: 'shared.forms.validation.required'})),
    email: string()
      .email(intl.formatMessage({id: 'shared.forms.validation.email'}))
      .required(intl.formatMessage({id: 'shared.forms.validation.required'})),
    originCountry: string().required(intl.formatMessage({id: 'shared.forms.validation.required'}))
  });

const AboutCandidateStep = ({onNextStep, onPreviousStep}) => {
  const intl = useIntl();
  const [aboutCandidateData, setAboutCandidateData] = useRecoilState(aboutCandidateState);

  return (
    <StepForm
      title={intl.formatMessage({id: 'assistance-form.steps.about-candidate.title'})}
      description={intl.formatMessage({id: 'assistance-form.steps.about-candidate.description'})}
    >
      <Formik
        initialValues={aboutCandidateData}
        validationSchema={aboutCandidateSchema(intl)}
        onSubmit={(values) => {
          setAboutCandidateData(values);
          onNextStep(Steps.SubmitForm);
          analyticsPushEvent({
            category: 'AssistanceForm',
            action: 'next',
            label: Steps.AboutCandidate,
            value: values.originCountry
          });
        }}
      >
        {({isSubmitting}) => (
          <Form>
            <div className={classnames(styles.fields, styles['fields--2-by-2'])}>
              <div className={classnames('field', styles.field)}>
                <label htmlFor="firstName" className={styles.label}>
                  {intl.formatMessage({id: 'assistance-form.steps.about-candidate.labels.first-name'})}
                </label>

                <Field name="firstName">
                  {({field, meta}) => (
                    <input
                      type="text"
                      className={classnames(styles.input, formikFieldErrorClass(meta))}
                      placeholder={intl.formatMessage({
                        id: 'assistance-form.steps.about-candidate.placeholders.first-name'
                      })}
                      {...field}
                    />
                  )}
                </Field>

                <ErrorMessage name="firstName" className={styles['error-message']} component="div" />
              </div>

              <div className={classnames('field', styles.field)}>
                <label htmlFor="lastName" className={styles.label}>
                  {intl.formatMessage({id: 'assistance-form.steps.about-candidate.labels.last-name'})}
                </label>

                <Field name="lastName">
                  {({field, meta}) => (
                    <input
                      type="text"
                      className={classnames(styles.input, formikFieldErrorClass(meta))}
                      placeholder={intl.formatMessage({
                        id: 'assistance-form.steps.about-candidate.placeholders.last-name'
                      })}
                      {...field}
                    />
                  )}
                </Field>

                <ErrorMessage name="lastName" className={styles['error-message']} component="div" />
              </div>

              <div className={classnames('field', styles.field)}>
                <label htmlFor="email" className={styles.label}>
                  {intl.formatMessage({id: 'assistance-form.steps.about-candidate.labels.email'})}
                </label>

                <Field name="email">
                  {({field, meta}) => (
                    <input
                      type="email"
                      className={classnames(styles.input, formikFieldErrorClass(meta))}
                      placeholder={intl.formatMessage({id: 'assistance-form.steps.about-candidate.placeholders.email'})}
                      {...field}
                    />
                  )}
                </Field>

                <ErrorMessage name="email" className={styles['error-message']} component="div" />
              </div>

              <div className={classnames('field', styles.field)}>
                <label htmlFor="phone" className={styles.label}>
                  {intl.formatMessage({id: 'assistance-form.steps.about-candidate.labels.phone'})}
                </label>

                <Field name="phone">
                  {({field}) => (
                    <input
                      type="tel"
                      className={classnames(styles.input)}
                      placeholder={intl.formatMessage({id: 'assistance-form.steps.about-candidate.placeholders.phone'})}
                      {...field}
                    />
                  )}
                </Field>
              </div>

              <div className={classnames('field', styles.field)}>
                <label htmlFor="originCountry" className={styles.label}>
                  {intl.formatMessage({id: 'assistance-form.steps.about-candidate.labels.origin-country'})}
                </label>

                <Field name="originCountry">
                  {({field, meta}) => (
                    <Selector
                      options={SUPPORTED_ORIGIN_COUNTRIES}
                      className={classnames(styles.input, formikFieldErrorClass(meta))}
                      placeholderKey="shared.country-selector.placeholder"
                      {...field}
                    />
                  )}
                </Field>

                <ErrorMessage name="originCountry" className={styles['error-message']} component="div" />
              </div>
            </div>

            <StepActions disabled={isSubmitting} onPrevious={onPreviousStep} />
          </Form>
        )}
      </Formik>
    </StepForm>
  );
};

AboutCandidateStep.propTypes = {
  onNextStep: T.func,
  onPreviousStep: T.func
};

export default AboutCandidateStep;
