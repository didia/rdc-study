// Vendor
import React, {useState} from 'react';
import {useIntl} from 'react-intl';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import {string, object} from 'yup';
import classnames from 'classnames';
import {useRecoilState} from 'recoil';
import T from 'prop-types';
import {CSSTransition} from 'react-transition-group';

// Styles
import styles from './styles.module.scss';

// Utils
import {formikFieldErrorClass} from './utils';

// Components
import Selector from '../Selector';
import StepActions from './StepActions';
import StepForm from './StepForm';
import {YesNoField} from './YesNoStepForm';

// States
import {destinationCountryState, hasAdmissionState} from './state';

// Constants
import DestinationCountries from './destination-countries';
import Steps from './steps';

const SUPPORTED_DESTINATION_COUNTRIES = [
  DestinationCountries.CANADA,
  DestinationCountries.NORTH_CYPRUS,
  DestinationCountries.BELGIUM,
  DestinationCountries.FRANCE,
  DestinationCountries.USA,
  DestinationCountries.INDIA
];

const HAS_ADMISSION_OPTIONS = [
  {
    labelKey: 'assistance-form.steps.destination-country.labels.has-admission-negative-option',
    value: 'false'
  },
  {
    labelKey: 'assistance-form.steps.destination-country.labels.has-admission-positive-option',
    value: 'true'
  }
];

const destinationCountrySchema = (intl) =>
  object().shape({
    destinationCountry: string().required(intl.formatMessage({id: 'shared.forms.validation.required'}))
  });

const onChangeDestinationCountry = (field, setShowHasAdmission) => (event) => {
  setShowHasAdmission(true);
  field.onChange(event);
};

// eslint-disable-next-line complexity
const getNextStep = ({destinationCountry, hasAdmission}) => {
  if (destinationCountry === DestinationCountries.CANADA.value && hasAdmission) {
    return Steps.CanadaCAQCheck;
  } else if (destinationCountry === DestinationCountries.BELGIUM.value && !hasAdmission) {
    return Steps.BelgiumEquivalenceCheck;
  }

  return hasAdmission ? Steps.AssistanceLevelCheck : Steps.AboutCandidate;
};

const DestinationCountryStep = ({onNextStep, onPreviousStep, recapMode}) => {
  const intl = useIntl();
  const [destinationCountry, setDestinationCountry] = useRecoilState(destinationCountryState);
  const [hasAdmission, setHasAdmission] = useRecoilState(hasAdmissionState);

  const [showHasAdmission, setShowHasAdmission] = useState(!!destinationCountry);

  return (
    <StepForm recapMode={recapMode} title={intl.formatMessage({id: 'assistance-form.steps.destination-country.title'})}>
      <Formik
        initialValues={{destinationCountry, hasAdmission: hasAdmission ? 'true' : 'false'}}
        validationSchema={destinationCountrySchema(intl)}
        onSubmit={(values) => {
          const hasAdmission = values.hasAdmission === 'true';

          setDestinationCountry(values.destinationCountry);
          setHasAdmission(hasAdmission);

          const nextStep = getNextStep({hasAdmission, destinationCountry: values.destinationCountry});

          onNextStep(nextStep);
        }}
      >
        {({isSubmitting}) => (
          <Form>
            <div className={styles.fields}>
              <div className={classnames('field', styles.field)}>
                <Field name="destinationCountry">
                  {({field, meta}) => (
                    <Selector
                      {...field}
                      options={SUPPORTED_DESTINATION_COUNTRIES}
                      className={classnames(styles.input, formikFieldErrorClass(meta))}
                      disabled={recapMode}
                      placeholderKey="shared.country-selector.placeholder"
                      onChange={onChangeDestinationCountry(field, setShowHasAdmission)}
                    />
                  )}
                </Field>

                <ErrorMessage name="destinationCountry" className={styles['error-message']} component="div" />
              </div>

              <CSSTransition in={showHasAdmission} timeout={200} classNames="fade" unmountOnExit>
                <YesNoField
                  label={intl.formatMessage({id: 'assistance-form.steps.destination-country.labels.has-admission'})}
                  name="hasAdmission"
                  options={HAS_ADMISSION_OPTIONS}
                />
              </CSSTransition>
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
