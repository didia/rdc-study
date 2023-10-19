import {atom, GetRecoilValue, selector, SetRecoilState} from 'recoil';

import DestinationCountries, {destinationCountrySlugs} from '../destination-countries';
import Steps from '../steps';

import {currentStepState, destinationCountryState} from './common-state';
import {AssistancePackageDictionary} from '../../../types/assistance-packages';

enum AssistancePackageType {
  Admission = 'admission',
  CAQ = 'caq',
  Equivalence = 'equivalence',
  Visa = 'visa'
}

const assistancePackagesState = atom({
  key: 'assistancePackages',
  default: {}
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
    const assistancePackages = get(assistancePackagesState);
    const selectedPackage = getSelectedPackage(get);
    const assistancePackageSlug = `${destinationCountry}/${selectedPackage}`;

    return assistancePackages[assistancePackageSlug];
  }
});

const getSelectedPackage: (GetRecoilValue) => AssistancePackageType = (get) => {
  const destinationCountry = get(destinationCountryState);

  if (destinationCountry === DestinationCountries.CANADA.value) {
    return getSelectedPackageForCanada(get);
  } else if (destinationCountry === DestinationCountries.BELGIUM.value) {
    return getSelectedPackageForBelgium(get);
  } else {
    return get(hasAdmissionState) ? AssistancePackageType.Visa : AssistancePackageType.Admission;
  }
};

const getSelectedPackageForCanada: (GetRecoilValue) => AssistancePackageType = (get) => {
  const hasAdmission = get(hasAdmissionState);

  if (!hasAdmission) {
    return AssistancePackageType.Admission;
  }

  const isGoingToQuebec = get(isGoingToQuebecState);

  if (!isGoingToQuebec) {
    return AssistancePackageType.Visa;
  }

  const hasCAQ = get(hasCAQState);

  return hasCAQ ? AssistancePackageType.Visa : AssistancePackageType.CAQ;
};

const getSelectedPackageForBelgium = (get) => {
  const hasAdmission = get(hasAdmissionState);

  if (hasAdmission) {
    return AssistancePackageType.Visa;
  }

  const hasGraduateStudiesDiploma = get(hasGraduateStudiesDiplomaState);

  if (hasGraduateStudiesDiploma) {
    return AssistancePackageType.Admission;
  }

  const hasHighSchoolDiplomaEquivalence = get(hasHighSchoolDiplomaEquivalenceState);

  return hasHighSchoolDiplomaEquivalence ? AssistancePackageType.Admission : AssistancePackageType.Equivalence;
};

// eslint-disable-next-line complexity
const preselectAssistancePackage = (set, fromGuide) => {
  if (!fromGuide) {
    return null;
  }

  const [destinationCountry, guideType] = fromGuide.split('/');

  if (destinationCountrySlugs.indexOf(destinationCountry) === -1) {
    return null;
  }

  switch (guideType) {
    case AssistancePackageType.Admission:
      set(hasAdmissionState, false);

      if (destinationCountry === DestinationCountries.BELGIUM.value) {
        set(currentStepState, Steps.BelgiumEquivalenceCheck);
      }
      break;
    case AssistancePackageType.Equivalence:
      set(hasAdmissionState, false);
      set(hasHighSchoolDiplomaEquivalenceState, false);
      break;
    case AssistancePackageType.CAQ:
      set(hasAdmissionState, true);
      set(hasCAQState, false);
      break;
    case AssistancePackageType.Visa:
      set(hasAdmissionState, true);

      if (destinationCountry === DestinationCountries.CANADA.value) {
        set(currentStepState, Steps.CanadaCAQCheck);
      }
      break;
    default:
      set(currentStepState, Steps.DestinationCountry);
  }
};

export type AssistancePackageStateInitialData = {
  fromGuide: string | null;
  assistancePackages: AssistancePackageDictionary;
};

export const initializeState: (set: SetRecoilState, initialData: AssistancePackageStateInitialData) => void = (
  set,
  {fromGuide, assistancePackages}
) => {
  set(assistancePackagesState, assistancePackages);
  preselectAssistancePackage(set, fromGuide);
};
