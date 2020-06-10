// Vendor
import React from 'react';
import {useIntl} from 'react-intl';
import classnames from 'classnames';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import {string, object} from 'yup';

// Styles
import styles from './styles.module.scss';

// Components
import CountrySelector from '../CountrySelector';

const aboutCandidateSchema = (intl) =>
  object().shape({
    firstName: string().required(intl.formatMessage({id: 'shared.forms.validation.required'})),
    lastName: string().required(intl.formatMessage({id: 'shared.forms.validation.required'})),
    email: string().email(intl.formatMessage({id: 'shared.forms.validation.email'})).required(intl.formatMessage({id: 'shared.forms.validation.required'})),
    originCountry: string().required(intl.formatMessage({id: 'shared.forms.validation.required'})),
  });

const AboutCandidateStep = () => {
  const intl = useIntl();

  return (
    <div>
      <h2 className={styles.title}>{intl.formatMessage({id: 'assistance-form.about-candidate.title'})}</h2>
      <p className={styles.description}>{intl.formatMessage({id: 'assistance-form.about-candidate.description'})}</p>

      <Formik
        initialValues={{firstName: '', lastName: '', email: '', originCountry: ''}}
        validationSchema={aboutCandidateSchema(intl)}
        onSubmit={(values) => {
          window.console.log(values);
        }}
      >
        {({isSubmitting}) => (
          <Form>
            <div className={styles.fields}>
              <div className={classnames('field', styles.field)}>
                <label htmlFor="firstName" className={styles.label}>
                  {intl.formatMessage({id: 'assistance-form.about-candidate.labels.first-name'})}
                </label>

                <Field
                  type="text"
                  name="firstName"
                  className={styles.input}
                  placeholder={intl.formatMessage({id: 'assistance-form.about-candidate.placeholders.first-name'})}
                />

                <ErrorMessage name="firstName" />
              </div>

              <div className={classnames('field', styles.field)}>
                <label htmlFor="lastName" className={styles.label}>
                  {intl.formatMessage({id: 'assistance-form.about-candidate.labels.last-name'})}
                </label>

                <Field
                  type="text"
                  name="lastName"
                  className={styles.input}
                  placeholder={intl.formatMessage({id: 'assistance-form.about-candidate.placeholders.last-name'})}
                />

                <ErrorMessage name="lastName" />
              </div>

              <div className={classnames('field', styles.field)}>
                <label htmlFor="email" className={styles.label}>
                  {intl.formatMessage({id: 'assistance-form.about-candidate.labels.email'})}
                </label>

                <Field
                  type="email"
                  name="email"
                  className={styles.input}
                  placeholder={intl.formatMessage({id: 'assistance-form.about-candidate.placeholders.email'})}
                />

                <ErrorMessage name="email" />
              </div>

              <div className={classnames('field', styles.field)}>
                <label htmlFor="originCountry" className={styles.label}>
                  {intl.formatMessage({id: 'assistance-form.about-candidate.labels.origin-country'})}
                </label>

                <Field name="originCountry">
                  {({field}) => <CountrySelector className={styles.input} {...field} />}
                </Field>

                <ErrorMessage name="originCountry" />
              </div>
            </div>

            <ul className={classnames('actions', styles.actions)}>
              <li>
                <button type="submit" className="special" disabled={isSubmitting}>
                  {intl.formatMessage({id: 'assistance-form.controls.next'})}
                </button>
              </li>
            </ul>
          </Form>
        )}
      </Formik>
    </div>
  );
};

const MasterForm = () => {
  return (
    <div>
      <AboutCandidateStep />
    </div>
  );
};

export default MasterForm;
