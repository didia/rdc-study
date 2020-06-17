// Components
import AboutCandidateStep from './AboutCandidateStep';
import DestinationCountryStep from './DestinationCountryStep';
import FormSubmittedStep from './FormSubmittedStep';

const Steps = {
  AboutCandidate: 'AboutCandidate',
  DestinationCountry: 'DestinationCountry',
  FormSubmitted: 'FormSubmitted',
};

const StepRegistry = {
  [Steps.AboutCandidate]: AboutCandidateStep,
  [Steps.DestinationCountry]: DestinationCountryStep,
  [Steps.FormSubmitted]: FormSubmittedStep,
};

export const getStepComponent = (key) => {
  return StepRegistry[key];
};

export const goToNextStep = ({currentStep, nextStep, setCurrentStep, setPreviousSteps}) => () => {
  setPreviousSteps((oldPreviousSteps) => [...oldPreviousSteps, currentStep]);
  setCurrentStep(nextStep);
};

export const goToPreviousStep = ({previousStep, setCurrentStep, setPreviousSteps}) => () => {
  setPreviousSteps((previousPreviousSteps) => {
    return [...previousPreviousSteps.slice(0, previousPreviousSteps.length - 1)];
  });

  setCurrentStep(previousStep);
};

export default Steps;
