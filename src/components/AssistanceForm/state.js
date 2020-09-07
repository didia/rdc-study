import {atom, selector} from 'recoil';

import Steps from './steps';
import DestinationCountries from './destination-countries';

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

export const isGoingToQuebecState = atom({
  key: 'isGoingToQuebec',
  default: false
});

export const hasCAQState = atom({
  key: 'hasCAQ',
  default: false
});

export const hasGraduateStudiesDiplomaState = atom({
  key: 'hasGraduateStudiesDiploma',
  default: true
});

export const hasHighSchoolDiplomaEquivalenceState = atom({
  key: 'hasHighSchoolDiplomaEquivalence',
  default: false
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
    const selectedPackage = getSelectedPackage(get);

    return `${destinationCountry}/${selectedPackage}`;
  }
});

const getSelectedPackage = (get) => {
  const destinationCountry = get(destinationCountryState);

  if (destinationCountry === DestinationCountries.CANADA.value) {
    return getSelectedPackageForCanada(get);
  } else if (destinationCountry === DestinationCountries.BELGIUM.value) {
    return getSelectedPackageForBelgium(get);
  } else {
    return get(hasAdmissionState) ? ASSISTANCE_PACKAGE.VISA : ASSISTANCE_PACKAGE.ADMISSION;
  }
};

const getSelectedPackageForCanada = (get) => {
  const hasAdmission = get(hasAdmissionState);

  if (!hasAdmission) {
    return ASSISTANCE_PACKAGE.ADMISSION;
  }

  const isGoingToQuebec = get(isGoingToQuebecState);

  if (!isGoingToQuebec) {
    return ASSISTANCE_PACKAGE.VISA;
  }

  const hasCAQ = get(hasCAQState);

  return hasCAQ ? ASSISTANCE_PACKAGE.VISA : ASSISTANCE_PACKAGE.CAQ;
};

const getSelectedPackageForBelgium = (get) => {
  const hasAdmission = get(hasAdmissionState);

  if (hasAdmission) {
    return ASSISTANCE_PACKAGE.VISA;
  }

  const hasGraduateStudiesDiploma = get(hasGraduateStudiesDiplomaState);

  if (hasGraduateStudiesDiploma) {
    return ASSISTANCE_PACKAGE.ADMISSION;
  }

  const hasHighSchoolDiplomaEquivalence = get(hasHighSchoolDiplomaEquivalenceState);

  return hasHighSchoolDiplomaEquivalence ? ASSISTANCE_PACKAGE.ADMISSION : ASSISTANCE_PACKAGE.EQUIVALENCE;
};
