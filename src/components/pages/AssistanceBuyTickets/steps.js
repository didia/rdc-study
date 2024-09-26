//components
import FormSubmittedStep from './FormSubmittedStep';
import AboutCandidateStep from "../../AssistanceForm/AboutCandidateStep";
import SubmitFormStep from "./SubmitFormStep";
//import SubmitFormStep from './SubmitFormStep';
import DetsinationDetailStep from './DestinationDetailStep';



export const Steps = {
  DestinationDetail: 'DestinationDetail',
  AboutCandidate: "AboutCandidate",
  SubmitForm: 'SubmitForm',
  FormSubmitted: 'FormSubmitted',
};

export const StepRegistry = {
  [Steps.DestinationDetail]: DetsinationDetailStep,
  [Steps.AboutCandidate]: AboutCandidateStep,
  [Steps.SubmitForm]: SubmitFormStep,
  [Steps.FormSubmitted]: FormSubmittedStep,
};