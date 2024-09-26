import {atom, selector} from 'recoil';

import Steps from '../steps';

export const setInitialStep = (initialStep : string) => {
  return atom({
    key: 'currentStep',
    default: initialStep
  });
}

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
    phone: '',
    originCountry: ''
  }
});

export const destinationCountryState = atom({
  key: 'destinationCountry',
  default: ''
});

export const previousStepState = selector({
  key: 'previousFormStep',

  get: ({get}) => {
    const previousSteps = get(previousStepsState);

    return previousSteps.length < 1 ? null : previousSteps[previousSteps.length - 1];
  }
});
