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
import PreviousNextActions from './PreviousNextActions';

// States
import {aboutCandidateState} from './state';

const aboutCandidateSchema = (intl) =>
  object().shape({
    firstName: string().required(intl.formatMessage({id: 'shared.forms.validation.required'})),
    lastName: string().required(intl.formatMessage({id: 'shared.forms.validation.required'})),
    email: string()
      .email(intl.formatMessage({id: 'shared.forms.validation.email'}))
      .required(intl.formatMessage({id: 'shared.forms.validation.required'})),
    originCountry: string().required(intl.formatMessage({id: 'shared.forms.validation.required'})),
  });

const AboutCandidateStep = ({onNextStep, onPreviousStep}) => {
  const intl = useIntl();
  const [aboutCandidateData, setAboutCandidateData] = useRecoilState(aboutCandidateState);

  return (
    <div>
      <h2 className={styles.title}>{intl.formatMessage({id: 'assistance-form.steps.about-candidate.title'})}</h2>
      <p className={styles.description}>
        {intl.formatMessage({id: 'assistance-form.steps.about-candidate.description'})}
      </p>

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
                      placeholder={intl.formatMessage({
                        id: 'assistance-form.steps.about-candidate.placeholders.first-name',
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
                        id: 'assistance-form.steps.about-candidate.placeholders.last-name',
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
                <label htmlFor="originCountry" className={styles.label}>
                  {intl.formatMessage({id: 'assistance-form.steps.about-candidate.labels.origin-country'})}
                </label>

                <Field name="originCountry">
                  {({field, meta}) => (
                    <CountrySelector className={classnames(styles.input, formikFieldErrorClass(meta))} {...field} />
                  )}
                </Field>

                <ErrorMessage name="originCountry" className={styles['error-message']} component="div" />
              </div>
            </div>

            <PreviousNextActions disabled={isSubmitting} onPrevious={onPreviousStep} />
          </Form>
        )}
      </Formik>
    </div>
  );
};

AboutCandidateStep.propTypes = {
  onNextStep: T.func.isRequired,
  onPreviousStep: T.func,
};

export default AboutCandidateStep;
