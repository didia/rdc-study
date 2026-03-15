'use client';

// Vendor
import React, {useState} from 'react';
import {useIntl} from 'react-intl';
import {useForm, FormProvider} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import classnames from 'classnames';
import {CSSTransition} from 'react-transition-group';

// Styles
import styles from './styles.module.scss';

// Components
import Selector from '../Selector';
import StepActions from './StepActions';
import StepForm from './StepForm';
import {YesNoField} from './YesNoStepForm';

// Store
import {useAssistanceFormStore} from './store';

// Constants
import DestinationCountries from './destination-countries';
import Steps from './steps';

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
  z.object({
    destinationCountry: z.string().min(1, intl.formatMessage({id: 'shared.forms.validation.required'})),
    hasAdmission: z.string()
  });

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
  const destinationCountry = useAssistanceFormStore((s) => s.destinationCountry);
  const setDestinationCountry = useAssistanceFormStore((s) => s.setDestinationCountry);
  const hasAdmission = useAssistanceFormStore((s) => s.hasAdmission);
  const setHasAdmission = useAssistanceFormStore((s) => s.setHasAdmission);

  const [showHasAdmission, setShowHasAdmission] = useState(!!destinationCountry);

  const methods = useForm({
    resolver: zodResolver(destinationCountrySchema(intl)),
    defaultValues: {
      destinationCountry,
      hasAdmission: hasAdmission ? 'true' : 'false'
    }
  });

  const {handleSubmit, setValue, watch, formState: {errors, isSubmitting}} = methods;
  const destinationCountryValue = watch('destinationCountry');

  const onSubmit = (values) => {
    const hasAdmission = values.hasAdmission === 'true';

    setDestinationCountry(values.destinationCountry);
    setHasAdmission(hasAdmission);

    const nextStep = getNextStep({hasAdmission, destinationCountry: values.destinationCountry});

    onNextStep(nextStep);
  };

  const onChangeDestinationCountry = (event) => {
    setShowHasAdmission(true);
    setValue('destinationCountry', event.target.value, {shouldValidate: true});
  };

  return (
    <StepForm recapMode={recapMode} title={intl.formatMessage({id: 'assistance-form.steps.destination-country.title'})}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.fields}>
            <div className={classnames('field', styles.field)}>
              <Selector
                name="destinationCountry"
                value={destinationCountryValue}
                options={SUPPORTED_DESTINATION_COUNTRIES}
                className={classnames(styles.input, errors.destinationCountry ? styles.error : null)}
                disabled={recapMode}
                placeholderKey="shared.country-selector.placeholder"
                onChange={onChangeDestinationCountry}
              />

              {errors.destinationCountry && (
                <div className={styles['error-message']}>{errors.destinationCountry.message}</div>
              )}
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
        </form>
      </FormProvider>
    </StepForm>
  );
};

export default DestinationCountryStep;
