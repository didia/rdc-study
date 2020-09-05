// Vendor
import React, {useRef} from 'react';
import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil';
import T from 'prop-types';

// State
import {currentStepState, previousStepState, previousStepsState} from './state';
import {getStepComponent, goToNextStep, goToPreviousStep} from './steps';
import analyticsPushEvent from '../../utils/push-analytics-event';

const MasterForm = ({assistancePackages}) => {
  const currentStepRef = useRef(null);
  const setPreviousSteps = useSetRecoilState(previousStepsState);
  const [currentStep, setCurrentStep] = useRecoilState(currentStepState);
  const previousStep = useRecoilValue(previousStepState);

  const onPreviousStep = () => {
    if (!previousStep) {
      return;
    }

    goToPreviousStep({currentStep, previousStep, setCurrentStep, setPreviousSteps});

    analyticsPushEvent({
      category: 'AssistanceForm',
      action: 'previous',
      label: currentStep
    });
  };

  const onNextStep = (nextStep) => {
    goToNextStep({currentStep, nextStep, setCurrentStep, setPreviousSteps});
    currentStepRef.current.scrollIntoView();
  };

  const CurrentStepComponent = getStepComponent(currentStep);

  return (
    <div ref={currentStepRef}>
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
