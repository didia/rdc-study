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

// States
import {destinationCountryState, hasAdmissionState} from './state';

// Constants
const SUPPORTED_DESTINATION_COUNTRIES = [
  {
    labelKey: 'shared.countries.be',
    value: 'belgique'
  },
  {
    labelKey: 'shared.countries.ca',
    value: 'canada'
  },
  {
    labelKey: 'shared.countries.fr',
    value: 'france'
  },
  {
    labelKey: 'shared.countries.us',
    value: 'usa'
  }
];

const HAS_ADMISSION_OPTIONS = [
  {
    labelKey: 'assistance-form.steps.destination-country.labels.has-admission-positive-option',
    value: 'true'
  },
  {
    labelKey: 'assistance-form.steps.destination-country.labels.has-admission-negative-option',
    value: 'false'
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

const DestinationCountryStep = ({onEditStep, onNextStep, onPreviousStep, recapMode}) => {
  const intl = useIntl();
  const [destinationCountry, setDestinationCountry] = useRecoilState(destinationCountryState);
  const [hasAdmission, setHasAdmission] = useRecoilState(hasAdmissionState);

  const [showHasAdmission, setShowHasAdmission] = useState(hasAdmission);

  return (
    <StepForm
      recapMode={recapMode}
      title={intl.formatMessage({id: 'assistance-form.steps.destination-country.title'})}
      onEditStep={onEditStep}
    >
      <Formik
        initialValues={{destinationCountry, hasAdmission: hasAdmission ? 'true' : 'false'}}
        validationSchema={destinationCountrySchema(intl)}
        onSubmit={(values) => {
          setDestinationCountry(values.destinationCountry);
          setHasAdmission(values.hasAdmission === 'true');
          onNextStep();
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
                <div className={classnames('field', styles.field)}>
                  <label htmlFor="hasAdmission" className={styles.label}>
                    {intl.formatMessage({id: 'assistance-form.steps.destination-country.labels.has-admission'})}
                  </label>

                  <Field name="hasAdmission">
                    {({field}) => (
                      <Selector
                        options={HAS_ADMISSION_OPTIONS}
                        className={styles.input}
                        disabled={recapMode}
                        {...field}
                      />
                    )}
                  </Field>
                </div>
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
  onEditStep: T.func,
  onNextStep: T.func,
  onPreviousStep: T.func,
  recapMode: T.bool
};

export default DestinationCountryStep;
