// Vendor
import React, {useRef} from 'react';
import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil';
import T from 'prop-types';

// Components
import Card from '../Card';

// Styles
import styles from './styles.module.scss';

// State
import { setInitialStep ,previousStepState, previousStepsState, initializeState} from './states';
import { goToNextStep, goToPreviousStep, goToStep} from './steps';

export {initializeState};

// Utils
import isScrolledIntoView from '../../utils/is-scrolled-into-view';

const MasterForm = ({initialStep, steps, stepRegistry}) => {
  const currentStepRef = useRef(null);
  const setPreviousSteps = useSetRecoilState(previousStepsState);
  const [currentStep, setCurrentStep] = useRecoilState(setInitialStep(initialStep));
  const previousStep = useRecoilValue(previousStepState);

  const scrollIntoViewIfNecessary = () => {
    if (!isScrolledIntoView(currentStepRef.current)) {
      currentStepRef.current.scrollIntoView();
    }
  };

  const onPreviousStep = previousStep
    ? () => {
        goToPreviousStep({currentStep, previousStep, setCurrentStep, setPreviousSteps});
        scrollIntoViewIfNecessary();
      }
    : null;

  const onNextStep = (nextStep) => {
    goToNextStep({currentStep, nextStep, setCurrentStep, setPreviousSteps});
    scrollIntoViewIfNecessary();
  };

  const onRestart = () => {
    goToStep({setCurrentStep, setPreviousSteps, step: steps.DestinationCountry});
    scrollIntoViewIfNecessary();
  };

  const getStepComponent = (key) => {
    return stepRegistry[key];
  };

  const CurrentStepComponent = getStepComponent(currentStep);

  return (
    <div ref={currentStepRef} className={styles['card-wrapper']}>
      <Card className={styles.card}>
        <CurrentStepComponent
          steps={steps}
          onNextStep={onNextStep}
          onPreviousStep={onPreviousStep}
          onRestart={onRestart}
        />
      </Card>
    </div>
  );
};

MasterForm.proptype = {
  initialStep: T.string.isRequired, 
  steps: T.object.isRequired, 
  stepRegistry: T.object.isRequired
};

export default MasterForm;
