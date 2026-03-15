'use client';

// Vendor
import React, {useState} from 'react';
import {useIntl} from 'react-intl';
import {useForm, FormProvider} from 'react-hook-form';
import {CSSTransition} from 'react-transition-group';

// Components
import StepForm from './StepForm';
import StepActions from './StepActions';
import {YesNoField} from './YesNoStepForm';

// Store
import {useAssistanceFormStore} from './store';

// Styles
import styles from './styles.module.scss';

// Constants
import {Steps} from './steps';

const BelgiumEquivalenceCheckStep = ({onNextStep, onPreviousStep}) => {
  const intl = useIntl();
  const hasGraduateStudiesDiploma = useAssistanceFormStore((s) => s.hasGraduateStudiesDiploma);
  const setHasGraduateStudiesDiploma = useAssistanceFormStore((s) => s.setHasGraduateStudiesDiploma);
  const hasHighSchoolDiplomaEquivalence = useAssistanceFormStore((s) => s.hasHighSchoolDiplomaEquivalence);
  const setHasHighSchoolDiplomaEquivalence = useAssistanceFormStore((s) => s.setHasHighSchoolDiplomaEquivalence);

  const [showHasHighSchoolDiplomaEquivalence, setShowHasHighSchoolDiplomaEquivalence] = useState(
    !hasGraduateStudiesDiploma
  );

  const methods = useForm({
    defaultValues: {
      hasGraduateStudiesDiploma: hasGraduateStudiesDiploma ? 'true' : 'false',
      hasHighSchoolDiplomaEquivalence: hasHighSchoolDiplomaEquivalence ? 'true' : 'false'
    }
  });

  const {handleSubmit, formState: {isSubmitting}} = methods;

  const onSubmit = (values) => {
    const hasGraduateStudiesDiploma = values.hasGraduateStudiesDiploma === 'true';
    const hasHighSchoolDiplomaEquivalence = values.hasHighSchoolDiplomaEquivalence === 'true';

    setHasGraduateStudiesDiploma(hasGraduateStudiesDiploma);
    setHasHighSchoolDiplomaEquivalence(hasHighSchoolDiplomaEquivalence);

    onNextStep(Steps.AboutCandidate);
  };

  return (
    <StepForm title={intl.formatMessage({id: 'assistance-form.steps.belgium-equivalence-check.title'})}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.fields}>
            <YesNoField
              name="hasGraduateStudiesDiploma"
              onChange={(value) => setShowHasHighSchoolDiplomaEquivalence(value === 'false')}
            />

            <CSSTransition in={showHasHighSchoolDiplomaEquivalence} timeout={200} classNames="fade" unmountOnExit>
              <YesNoField
                label={intl.formatMessage({id: 'assistance-form.steps.belgium-equivalence-check.has-equivalence'})}
                name="hasHighSchoolDiplomaEquivalence"
              />
            </CSSTransition>
          </div>

          <StepActions disabled={isSubmitting} onPrevious={onPreviousStep} />
        </form>
      </FormProvider>
    </StepForm>
  );
};

export default BelgiumEquivalenceCheckStep;
