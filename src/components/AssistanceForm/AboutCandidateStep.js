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

// Components
import CountrySelector from '../CountrySelector';
import StepActions from './StepActions';
import StepForm from './StepForm';

// States
import {aboutCandidateState} from './state';

// Const
const SUPPORTED_ORIGIN_COUNTRIES = [
  {labelKey: 'shared.countries.be'},
  {labelKey: 'shared.countries.bf'},
  {labelKey: 'shared.countries.bj'},
  {labelKey: 'shared.countries.br'},
  {labelKey: 'shared.countries.ca'},
  {labelKey: 'shared.countries.cd'},
  {labelKey: 'shared.countries.cg'},
  {labelKey: 'shared.countries.ch'},
  {labelKey: 'shared.countries.ci'},
  {labelKey: 'shared.countries.cn'},
  {labelKey: 'shared.countries.de'},
  {labelKey: 'shared.countries.fr'},
  {labelKey: 'shared.countries.ga'},
  {labelKey: 'shared.countries.gb'},
  {labelKey: 'shared.countries.gh'},
  {labelKey: 'shared.countries.gn'},
  {labelKey: 'shared.countries.ht'},
  {labelKey: 'shared.countries.in'},
  {labelKey: 'shared.countries.jp'},
  {labelKey: 'shared.countries.ml'},
  {labelKey: 'shared.countries.ne'},
  {labelKey: 'shared.countries.ro'},
  {labelKey: 'shared.countries.ru'},
  {labelKey: 'shared.countries.rw'},
  {labelKey: 'shared.countries.sa'},
  {labelKey: 'shared.countries.sn'},
  {labelKey: 'shared.countries.tg'},
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

const AboutCandidateStep = ({onEditStep, onNextStep, onPreviousStep, recapMode}) => {
  const intl = useIntl();
  const [aboutCandidateData, setAboutCandidateData] = useRecoilState(aboutCandidateState);

  return (
    <StepForm
      recapMode={recapMode}
      title={intl.formatMessage({id: 'assistance-form.steps.about-candidate.title'})}
      description={intl.formatMessage({id: 'assistance-form.steps.about-candidate.description'})}
      onEditStep={onEditStep}
    >
      <Formik
        initialValues={aboutCandidateData}
        validationSchema={aboutCandidateSchema(intl)}
        onSubmit={(values) => {
          setAboutCandidateData(values);
          onNextStep();
        }}
      >
        {({isSubmitting}) => (
          <Form>
            <div className={styles.fields}>
              <div className={classnames('field', styles.field)}>
                <label htmlFor="firstName" className={styles.label}>
                  {intl.formatMessage({id: 'assistance-form.steps.about-candidate.labels.first-name'})}
                </label>

                <Field name="firstName">
                  {({field, meta}) => (
                    <input
                      type="text"
                      className={classnames(styles.input, formikFieldErrorClass(meta))}
                      disabled={recapMode}
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
                      disabled={recapMode}
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
                      disabled={recapMode}
                      placeholder={intl.formatMessage({id: 'assistance-form.steps.about-candidate.placeholders.email'})}
                      {...field}
                    />
                  )}
                </Field>

                <ErrorMessage name="email" className={styles['error-message']} component="div" />
              </div>

              <div className={classnames('field', styles.field)}>
                <label htmlFor="originCountry" className={styles.label}>
                  {intl.formatMessage({id: 'assistance-form.steps.about-candidate.labels.origin-country'})}
                </label>

                <Field name="originCountry">
                  {({field, meta}) => (
                    <CountrySelector
                      countryOptions={SUPPORTED_ORIGIN_COUNTRIES}
                      className={classnames(styles.input, formikFieldErrorClass(meta))}
                      disabled={recapMode}
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
  onEditStep: T.func,
  onNextStep: T.func,
  onPreviousStep: T.func,
  recapMode: T.bool
};

export default AboutCandidateStep;
