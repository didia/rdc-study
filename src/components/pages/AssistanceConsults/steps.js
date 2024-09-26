// Components
import DestinationCountryStep from './DestinationCountryConsults';
import FormSubmittedStep from './FormSubmittedStep';
import SubmitFormStep from './SubmitFormStep';
import AboutCandidateStep from '../../AssistanceForm/AboutCandidateStep';

export const Steps = {
  DestinationCountry: 'DestinationCountry',
  AboutCandidate: 'AboutCandidate',
  FormSubmitted: 'FormSubmitted',
  SubmitForm: 'SubmitForm'
};

export const StepRegistry = {
  [Steps.DestinationCountry]: DestinationCountryStep,
  [Steps.AboutCandidate]: AboutCandidateStep,
  [Steps.FormSubmitted]: FormSubmittedStep,
  [Steps.SubmitForm]: SubmitFormStep
};