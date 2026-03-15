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

const CanadaCAQCheckStep = ({onNextStep, onPreviousStep}) => {
  const intl = useIntl();
  const isGoingToQuebec = useAssistanceFormStore((s) => s.isGoingToQuebec);
  const setIsGoingToQuebec = useAssistanceFormStore((s) => s.setIsGoingToQuebec);
  const hasCAQ = useAssistanceFormStore((s) => s.hasCAQ);
  const setHasCAQ = useAssistanceFormStore((s) => s.setHasCAQ);

  const [showHasCAQ, setShowHasCAQ] = useState(isGoingToQuebec);

  const methods = useForm({
    defaultValues: {
      isGoingToQuebec: isGoingToQuebec ? 'true' : 'false',
      hasCAQ: hasCAQ ? 'true' : 'false'
    }
  });

  const {handleSubmit, formState: {isSubmitting}} = methods;

  const onSubmit = (values) => {
    const isGoingToQuebec = values.isGoingToQuebec === 'true';
    const hasCAQ = values.hasCAQ === 'true';

    setIsGoingToQuebec(isGoingToQuebec);
    setHasCAQ(hasCAQ);

    onNextStep(!isGoingToQuebec || hasCAQ ? Steps.AssistanceLevelCheck : Steps.AboutCandidate);
  };

  return (
    <StepForm title={intl.formatMessage({id: 'assistance-form.steps.canada-caq-check.title'})}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.fields}>
            <YesNoField name="isGoingToQuebec" onChange={(value) => setShowHasCAQ(value === 'true')} />

            <CSSTransition in={showHasCAQ} timeout={200} classNames="fade" unmountOnExit>
              <YesNoField
                label={intl.formatMessage({id: 'assistance-form.steps.canada-caq-check.has-caq'})}
                name="hasCAQ"
              />
            </CSSTransition>
          </div>

          <StepActions disabled={isSubmitting} onPrevious={onPreviousStep} />
        </form>
      </FormProvider>
    </StepForm>
  );
};

export default CanadaCAQCheckStep;
