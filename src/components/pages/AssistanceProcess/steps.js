// Components
import AboutCandidateStep from '../../AssistanceForm/AboutCandidateStep';
import BelgiumEquivalenceCheckStep from '../../AssistanceForm/BelgiumEquivalenceCheckStep';
import CanadaCAQCheckStep from '../../AssistanceForm/CanadaCAQCheckStep';
import DestinationCountryStep from '../../AssistanceForm/DestinationCountryStep';
import AssistanceLevelCheckStep from '../../AssistanceForm/AssistanceLevelCheckStep';
import FormSubmittedStep from '../../AssistanceForm/FormSubmittedStep';
import SubmitFormStep from '../../AssistanceForm/SubmitFormStep';

export const Steps = {
  AboutCandidate: 'AboutCandidate',
  AssistanceLevelCheck: 'AssistanceLevelCheck',
  BelgiumEquivalenceCheck: 'BelgiumEquivalenceCheck',
  CanadaCAQCheck: 'CanadaCAQCheck',
  DestinationCountry: 'DestinationCountry',
  FormSubmitted: 'FormSubmitted',
  SubmitForm: 'SubmitForm'
};

export const StepRegistry = {
  [Steps.AboutCandidate]: AboutCandidateStep,
  [Steps.AssistanceLevelCheck]: AssistanceLevelCheckStep,
  [Steps.BelgiumEquivalenceCheck]: BelgiumEquivalenceCheckStep,
  [Steps.CanadaCAQCheck]: CanadaCAQCheckStep,
  [Steps.DestinationCountry]: DestinationCountryStep,
  [Steps.FormSubmitted]: FormSubmittedStep,
  [Steps.SubmitForm]: SubmitFormStep
};
