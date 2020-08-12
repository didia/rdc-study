import {atom, selector} from 'recoil';

import Steps from './steps';

const ASSISTANCE_PACKAGE = {
  ADMISSION: 'admission',
  CAQ: 'caq',
  EQUIVALENCE: 'equivalence',
  TRAVEL: 'voyage',
  VISA: 'visa'
};

export const currentStepState = atom({
  key: 'currentStep',
  default: Steps.DestinationCountry
});

export const previousStepsState = atom({
  key: 'previousSteps',
  default: []
});

export const aboutCandidateState = atom({
  key: 'aboutCandidate',
  default: {
    firstName: '',
    lastName: '',
    email: '',
    originCountry: ''
  }
});

export const destinationCountryState = atom({
  key: 'destinationCountry',
  default: ''
});

export const hasAdmissionState = atom({
  key: 'hasAdmission',
  default: false
});

export const nextStepState = selector({
  key: 'nextFormStep',

  get: ({get}) => {
    const currentState = get(currentStepState);

    switch (currentState) {
      case Steps.AboutCandidate:
        return Steps.DestinationCountry;
      case Steps.DestinationCountry:
        return Steps.SubmitForm;
      case Steps.SubmitForm:
        return Steps.FormSubmitted;
      default:
        return Steps.AboutCandidate;
    }
  }
});

export const previousStepState = selector({
  key: 'previousFormStep',

  get: ({get}) => {
    const previousSteps = get(previousStepsState);

    return previousSteps.length < 1 ? null : previousSteps[previousSteps.length - 1];
  }
});

export const assistancePackageState = selector({
  key: 'assistancePackage',

  get: ({get}) => {
    const destinationCountry = get(destinationCountryState);
    const hasAdmission = get(hasAdmissionState);

    return hasAdmission
      ? `${destinationCountry}/${ASSISTANCE_PACKAGE.VISA}`
      : `${destinationCountry}/${ASSISTANCE_PACKAGE.ADMISSION}`;
  }
});

export const assistanceFormState = selector({
  key: 'assistanceFormAggregateValuesState',

  get: ({get}) => {
    const aboutCandidate = get(aboutCandidateState);
    const assistancePackage = get(assistancePackageState);

    return {
      aboutCandidate,
      assistancePackage
    };
  }
});
