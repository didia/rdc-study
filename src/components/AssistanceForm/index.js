// Vendor
import React from 'react';
import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil';
import T from 'prop-types';

// State
import {currentStepState, previousStepState, previousStepsState} from './state';
import {getStepComponent, goToNextStep, goToPreviousStep} from './steps';

const MasterForm = ({assistancePackages}) => {
  const setPreviousSteps = useSetRecoilState(previousStepsState);
  const [currentStep, setCurrentStep] = useRecoilState(currentStepState);
  const previousStep = useRecoilValue(previousStepState);

  const onPreviousStep = previousStep ? goToPreviousStep({previousStep, setCurrentStep, setPreviousSteps}) : null;
  const onNextStep = goToNextStep({currentStep, setCurrentStep, setPreviousSteps});

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
