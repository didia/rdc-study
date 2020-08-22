// Components
import AboutCandidateStep from './AboutCandidateStep';
import BelgiumEquivalenceCheckStep from './BelgiumEquivalenceCheckStep';
import CanadaCAQCheckStep from './CanadaCAQCheckStep';
import DestinationCountryStep from './DestinationCountryStep';
import FormSubmittedStep from './FormSubmittedStep';
import SubmitFormStep from './SubmitFormStep';

export const Steps = {
  AboutCandidate: 'AboutCandidate',
  BelgiumEquivalenceCheck: 'BelgiumEquivalenceCheck',
  CanadaCAQCheck: 'CanadaCAQCheck',
  DestinationCountry: 'DestinationCountry',
  FormSubmitted: 'FormSubmitted',
  SubmitForm: 'SubmitForm'
};

const StepRegistry = {
  [Steps.AboutCandidate]: AboutCandidateStep,
  [Steps.BelgiumEquivalenceCheck]: BelgiumEquivalenceCheckStep,
  [Steps.CanadaCAQCheck]: CanadaCAQCheckStep,
  [Steps.DestinationCountry]: DestinationCountryStep,
  [Steps.FormSubmitted]: FormSubmittedStep,
  [Steps.SubmitForm]: SubmitFormStep
};

export const getStepComponent = (key) => {
  return StepRegistry[key];
};

export const goToNextStep = ({currentStep, setCurrentStep, setPreviousSteps}) => (nextStep) => {
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
