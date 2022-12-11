// Vendor
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { string, object } from 'yup';
import classnames from 'classnames';
import { useRecoilState } from 'recoil';
import T from 'prop-types';
import { CSSTransition } from 'react-transition-group';

// Styles
import styles from './styles.module.scss';

// Utils
import { formikFieldErrorClass } from '../../AssistanceForm/utils';

// Components
import Selector from '../../Selector';
import StepActions from '../../AssistanceForm/StepActions';
import StepForm from '../../AssistanceForm/StepForm';
// States
import { destinationCountryState, selectedServiceState } from './states';

// Constants
import DestinationCountries from '../../AssistanceForm/destination-countries';
import { getCountryOptions, options } from './destination-options';
//import steps from './steps';

const SUPPORTED_DESTINATION_COUNTRIES = [
  DestinationCountries.CANADA,
  DestinationCountries.NORTH_CYPRUS,
  DestinationCountries.BELGIUM,
  DestinationCountries.FRANCE,
  DestinationCountries.USA,
  DestinationCountries.INDIA,
  DestinationCountries.TUNISIE,
  DestinationCountries.TURQUIE
];

const destinationCountrySchema = (intl) =>
  object().shape({
    destinationCountry: string().required(intl.formatMessage({ id: 'shared.forms.validation.required' }))
  });
// eslint-disable-next-line complexity


const DestinationCountryStep = ({ onNextStep, onPreviousStep, recapMode, steps }) => {
  const intl = useIntl();
  const [destinationCountry, setDestinationCountry] = useRecoilState(destinationCountryState);
  const [selectedService, setSelectedService] = useRecoilState(selectedServiceState);
  
  const getOptionField = (country) => {
    const options = getCountryOptions(country);
    
    return (
      <Field name="destinationCountryOption">
        {({ field, meta }) => (
          <Selector
            {...field}
            options={options}
            className={classnames(styles.input, formikFieldErrorClass(meta))}
            disabled={recapMode}
            placeholderKey="shared.country-option-selector.placeholder"
            onChange={onChangeSelectedService(field)}
          />
        )}
      </Field>
    )
  }

  const onChangeDestinationCountry = (field) => (event) => {
    const country = event.target.value;
    setDestinationCountry(country);
    field.onChange(event);
  };

  const onChangeSelectedService = (field) => (event) => {
    const service = event.target.value;
    setSelectedService(service);
    field.onChange(event);
  };

  return (
    <StepForm recapMode={recapMode} title={intl.formatMessage({ id: 'assistance-form.steps.destination-country.title' })}>
      <Formik
        initialValues={{ destinationCountry }}
        validationSchema={destinationCountrySchema(intl)}
        onSubmit={(values) => {
          setDestinationCountry(values.destinationCountry);
          onNextStep(steps.AboutCandidate);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className={styles.fields}>
              <div className={classnames('field', styles.field)}>
                <Field name="destinationCountry">
                  {({ field, meta }) => (
                    <Selector
                      {...field}
                      options={SUPPORTED_DESTINATION_COUNTRIES}
                      className={classnames(styles.input, formikFieldErrorClass(meta))}
                      disabled={recapMode}
                      placeholderKey="shared.country-selector.placeholder"
                      onChange={onChangeDestinationCountry(field)}
                    />
                  )}
                </Field>
                <br/>
                {destinationCountry && getOptionField(destinationCountry) }

                <ErrorMessage name="destinationCountry" className={styles['error-message']} component="div" />
              </div>


            </div>

            <StepActions disabled={isSubmitting} onPrevious={onPreviousStep} />
          </Form>
        )}
      </Formik>
    </StepForm>
  );
};

DestinationCountryStep.propTypes = {
  onNextStep: T.func,
  onPreviousStep: T.func,
  recapMode: T.bool
};

export default DestinationCountryStep;
