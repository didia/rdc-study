// Components
import AboutCandidateStep from './AboutCandidateStep';
import DestinationCountryStep from './DestinationCountryStep';
import FormSubmittedStep from './FormSubmittedStep';
import SubmitFormStep from './SubmitFormStep';

const Steps = {
  AboutCandidate: 'AboutCandidate',
  DestinationCountry: 'DestinationCountry',
  FormSubmitted: 'FormSubmitted',
  SubmitForm: 'SubmitForm',
};

const StepRegistry = {
  [Steps.AboutCandidate]: AboutCandidateStep,
  [Steps.DestinationCountry]: DestinationCountryStep,
  [Steps.FormSubmitted]: FormSubmittedStep,
  [Steps.SubmitForm]: SubmitFormStep
};

export const getStepComponent = (key) => {
  return StepRegistry[key];
};

export const goToNextStep = ({currentStep, nextStep, setCurrentStep, setPreviousSteps}) => () => {
  setPreviousSteps((oldPreviousSteps) => [...oldPreviousSteps, currentStep]);
  setCurrentStep(nextStep);
};

export const goToPreviousStep = ({previousStep, setCurrentStep, setPreviousSteps}) => () => {
  setPreviousSteps((previousSteps) => {
    return [...previousSteps.slice(0, previousSteps.length - 1)];
  });

  setCurrentStep(previousStep);
};

export const goToStep = ({step, setCurrentStep, setPreviousSteps}) => {
  setPreviousSteps((previousSteps) => {
    const stepIndex = previousSteps.indexOf(step);

    if (stepIndex === -1) {
      return previousSteps;
    }

    return previousSteps.slice(0, stepIndex);
  });

  setCurrentStep(step);
};

export default Steps;
