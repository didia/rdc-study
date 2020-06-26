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
import StepActions from './StepActions';

// States
import {destinationCountryState} from './state';

// Const
const SUPPORTED_DESTINATION_COUNTRIES = [
  {
    labelKey: 'shared.countries.be',
    value: 'belgique',
  },
  {
    labelKey: 'shared.countries.ca',
    value: 'canada',
  },
  {
    labelKey: 'shared.countries.fr',
    value: 'france',
  },
  {
    labelKey: 'shared.countries.us',
    value: 'usa',
  },
];

const destinationCountrySchema = (intl) =>
  object().shape({
    destinationCountry: string().required(intl.formatMessage({id: 'shared.forms.validation.required'})),
  });

const DestinationCountryStep = ({onEditStep, onNextStep, onPreviousStep, recapMode}) => {
  const intl = useIntl();
  const [destinationCountry, setDestinationCountry] = useRecoilState(destinationCountryState);
  const recapClassName = recapMode ? styles['recap-mode'] : null;

  const TitleTag = recapMode ? 'h3' : 'h2';

  return (
    <div className={recapClassName}>
      <TitleTag className={styles.title}>
        {intl.formatMessage({id: 'assistance-form.steps.destination-country.title'})}
      </TitleTag>

      <Formik
        initialValues={{destinationCountry}}
        validationSchema={destinationCountrySchema(intl)}
        onSubmit={(values) => {
          setDestinationCountry(values.destinationCountry);
          onNextStep();
        }}
      >
        {({isSubmitting, handleSubmit}) => (
          <Form>
            <div className={classnames('field', styles.field)}>
              <Field name="destinationCountry">
                {({field, meta}) => (
                  <CountrySelector
                    countryOptions={SUPPORTED_DESTINATION_COUNTRIES}
                    className={classnames(styles.input, formikFieldErrorClass(meta))}
                    disabled={recapMode}
                    {...field}
                  />
                )}
              </Field>

              <ErrorMessage name="destinationCountry" className={styles['error-message']} component="div" />
            </div>

            <StepActions disabled={isSubmitting} onEdit={onEditStep} onNext={handleSubmit} onPrevious={onPreviousStep}  />
          </Form>
        )}
      </Formik>
    </div>
  );
};

DestinationCountryStep.propTypes = {
  onEditStep: T.func,
  onNextStep: T.func,
  onPreviousStep: T.func,
  recapMode: T.bool
};

export default DestinationCountryStep;
