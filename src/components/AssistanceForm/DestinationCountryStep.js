// Vendor
import React from 'react';
import {useIntl} from 'react-intl';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import {string, object} from 'yup';
import classnames from 'classnames';

// Styles
import styles from './styles.module.scss';

// Utils
import {formikFieldErrorClass} from './utils';

// Components
import CountrySelector from '../CountrySelector';
import PreviousNextActions from './PreviousNextActions';

const destinationCountrySchema = (intl) =>
  object().shape({
    destinationCountry: string().required(intl.formatMessage({id: 'shared.forms.validation.required'})),
  });

const DestinationCountryStep = () => {
  const intl = useIntl();

  return (
    <div>
      <h2 className={styles.title}>{intl.formatMessage({id: 'assistance-form.destination-country.title'})}</h2>

      <Formik
        initialValues={{destinationCountry: ''}}
        validationSchema={destinationCountrySchema(intl)}
        onSubmit={(values) => {
          window.console.log(values);
        }}
      >
        {({isSubmitting}) => (
          <Form>
            <div className={classnames('field', styles.field)}>
              <Field name="destinationCountry">
                {({field, meta}) => (
                  <CountrySelector className={classnames(styles.input, formikFieldErrorClass(meta))} {...field} />
                )}
              </Field>

              <ErrorMessage name="destinationCountry" className={styles['error-message']} component="div" />
            </div>

            <PreviousNextActions disabled={isSubmitting} />
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default DestinationCountryStep;
