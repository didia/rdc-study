import {atom, selector} from 'recoil';

import Steps from './steps';
import DestinationCountries, {destinationCountrySlugs} from './destination-countries';
import {AssistanceTypes, AssistancePrices} from '../../constants/assistance';

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

const servicesState = atom({
  key: 'services',
  default: []
})

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

export const serviceState = atom({
  key: 'assistanceType',
  default: ''
});

export const hasReadGuideState = atom({
  key: 'hasReadGuide',
  default: false
});

export const isAlreadyAdvancedState = atom({
  key: 'isAlreadyAdvanced',
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
    const selectedPackages = get(assistancePackagesState);
    const selectedPackage = getSelectedPackage(get);
    const assistancePackageSlug = `${destinationCountry}/${selectedPackage}`;

    return selectedPackages[assistancePackageSlug];
  }
});

export const availableAssistanceTypesState = selector({
  key: 'availableAssistanceTypes',

  get: ({get}) => {
    const hasReadGuide = get(hasReadGuideState);
    const isAlreadyAdvanced = get(isAlreadyAdvancedState);
    const country = get(destinationCountryState);
    const {originCountry} = get(aboutCandidateState);

    const assistanceTypesList = [];

    const consultationPrice =
      originCountry === 'congo-kinshasa'
        ? AssistancePrices[AssistanceTypes.CONSULTATION_LOCALE]
        : AssistancePrices[AssistanceTypes.CONSULTATION];

    if (hasReadGuide) {
      assistanceTypesList.push({
        type: AssistanceTypes.CONSULTATION,
        title: 'shared.assistance-types.consultation-from-guide.title',
        price: consultationPrice
      });
    } else {
      assistanceTypesList.push(
        {
          type: AssistanceTypes.INFORMATION,
          title: 'shared.assistance-types.information.title',
          price: AssistancePrices[AssistanceTypes.INFORMATION]
        },
        {
          type: AssistanceTypes.CONSULTATION,
          title: 'shared.assistance-types.consultation.title',
          price: consultationPrice
        }
      );
    }

    if (isAlreadyAdvanced) {
      assistanceTypesList.push({
        type: AssistanceTypes.VERIFICATION,
        title: 'shared.assistance-types.verification.title',
        price: AssistancePrices[AssistanceTypes.VERIFICATION]
      });

      if (country === DestinationCountries.CANADA.value) {
        assistanceTypesList.push({
          type: AssistanceTypes.VERIFICATION_ET_LETTRE,
          title: 'shared.assistance-types.verification-et-lettre.title',
          price: AssistancePrices[AssistanceTypes.VERIFICATION_ET_LETTRE]
        });
      }
    } else {
      assistanceTypesList.push({
        type: AssistanceTypes.ASSISTANCE,
        title: 'shared.assistance-types.assistance.title',
        price: AssistancePrices[AssistanceTypes.ASSISTANCE]
      });
    }

    return assistanceTypesList;
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

export const initializeState = ({fromGuide, assistancePackages, services}) => {
  // eslint-disable-next-line complexity
  return ({set}) => {
    set(assistancePackagesState, assistancePackages);
    set(servicesState, services);
    preselectAssistancePackage(set, fromGuide);
  };
};

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
