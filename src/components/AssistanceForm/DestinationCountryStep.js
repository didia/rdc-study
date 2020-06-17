// Vendor
import React from 'react';
import {useIntl} from 'react-intl';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import {string, object} from 'yup';
import classnames from 'classnames';
import {useRecoilState} from 'recoil';
import T from 'prop-types';

// Styles
import styles from './styles.module.scss';

// Utils
import {formikFieldErrorClass} from './utils';

// Components
import CountrySelector from '../CountrySelector';
import PreviousNextActions from './PreviousNextActions';

// States
import {destinationCountryState} from './state';

const destinationCountrySchema = (intl) =>
  object().shape({
    destinationCountry: string().required(intl.formatMessage({id: 'shared.forms.validation.required'})),
  });

const DestinationCountryStep = ({onNextStep, onPreviousStep}) => {
  const intl = useIntl();

  const [destinationCountry, setDestinationCountry] = useRecoilState(destinationCountryState);

  return (
    <div>
      <h2 className={styles.title}>{intl.formatMessage({id: 'assistance-form.steps.destination-country.title'})}</h2>

      <Formik
        initialValues={{destinationCountry}}
        validationSchema={destinationCountrySchema(intl)}
        onSubmit={(values) => {
          setDestinationCountry(values.destinationCountry);
          onNextStep();
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

            <PreviousNextActions disabled={isSubmitting} onNext={onNextStep} onPrevious={onPreviousStep} />
          </Form>
        )}
      </Formik>
    </div>
  );
};

DestinationCountryStep.propTypes = {
  onNextStep: T.func.isRequired,
  onPreviousStep: T.func,
};

export default DestinationCountryStep;
