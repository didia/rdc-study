// Vendor
import React from 'react';
import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil';
import T from 'prop-types';

// State
import {currentStepState, nextStepState, previousStepState, previousStepsState} from './state';
import {getStepComponent, goToNextStep, goToPreviousStep} from './steps';

const MasterForm = ({assistancePackages}) => {
  const setPreviousSteps = useSetRecoilState(previousStepsState);
  const [currentStep, setCurrentStep] = useRecoilState(currentStepState);
  const nextStep = useRecoilValue(nextStepState);
  const previousStep = useRecoilValue(previousStepState);

  const onNextStep = nextStep ? goToNextStep({currentStep, nextStep, setCurrentStep, setPreviousSteps}) : null;
  const onPreviousStep = previousStep ? goToPreviousStep({previousStep, setCurrentStep, setPreviousSteps}) : null;

  const CurrentStepComponent = getStepComponent(currentStep);

  return (
    <div>
      <CurrentStepComponent
        onNextStep={onNextStep}
        onPreviousStep={onPreviousStep}
        assistancePackages={assistancePackages}
      />
    </div>
  );
};

MasterForm.propTypes = {
  assistancePackages: T.object.isRequired
};

export default MasterForm;
