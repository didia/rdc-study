import {atom, selector} from 'recoil';

import DestinationCountries, {destinationCountrySlugs} from '../destination-countries';
import Steps from '../steps';

import {currentStepState, destinationCountryState} from './common-state';

const ASSISTANCE_PACKAGE = {
  ADMISSION: 'admission',
  CAQ: 'caq',
  EQUIVALENCE: 'equivalence',
  TRAVEL: 'voyage',
  VISA: 'visa'
};

const assistancePackagesState = atom({
  key: 'assistancePackages',
  default: []
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

export const assistancePackageState = selector({
  key: 'assistancePackage',

  get: ({get}) => {
    const destinationCountry = get(destinationCountryState);
    const selectedPackages = get(assistancePackagesState);
    const selectedPackage = getSelectedPackage(get);
    const assistancePackageSlug = `${destinationCountry}/${selectedPackage}`;

    return selectedPackages[assistancePackageSlug];
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

// eslint-disable-next-line complexity
const preselectAssistancePackage = (set, fromGuide) => {
  if (!fromGuide) {
    return null;
  }

  const [destinationCountry, guideType, _] = fromGuide.split('/');

  if (destinationCountrySlugs.indexOf(destinationCountry) === -1) {
    return null;
  }

  switch (guideType) {
    case ASSISTANCE_PACKAGE.ADMISSION:
      set(hasAdmissionState, false);

      if (destinationCountry === DestinationCountries.BELGIUM.value) {
        set(currentStepState, Steps.BelgiumEquivalenceCheck);
      }
      break;
    case ASSISTANCE_PACKAGE.EQUIVALENCE:
      set(hasAdmissionState, false);
      set(hasHighSchoolDiplomaEquivalenceState, false);
      break;
    case ASSISTANCE_PACKAGE.CAQ:
      set(hasAdmissionState, true);
      set(hasCAQState, false);
      break;
    case ASSISTANCE_PACKAGE.VISA:
      set(hasAdmissionState, true);

      if (destinationCountry === DestinationCountries.CANADA.value) {
        set(currentStepState, Steps.CanadaCAQCheck);
      }
      break;
    default:
      set(currentStepState, Steps.DestinationCountry);
  }
};

export const initializeState = ({fromGuide, assistancePackages}) => {
  // eslint-disable-next-line complexity
  return ({set}) => {
    set(assistancePackagesState, assistancePackages);
    preselectAssistancePackage(set, fromGuide);
  };
};
