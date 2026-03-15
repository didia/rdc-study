'use client';

import {create} from 'zustand';

import DestinationCountries, {destinationCountrySlugs} from './destination-countries';
import Steps from './steps';
import {AssistanceTypes, AssistancePrices} from '../../constants/assistance';
import {AssistancePackageDictionary, Service} from '@/lib/types';

enum AssistancePackageType {
  Admission = 'admission',
  CAQ = 'caq',
  Equivalence = 'equivalence',
  Visa = 'visa'
}

type AboutCandidate = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  originCountry: string;
};

type AssistanceType = {
  type: string;
  title: string;
  price: number;
};

type AssistanceFormState = {
  // Common state
  currentStep: string;
  previousSteps: string[];
  aboutCandidate: AboutCandidate;
  destinationCountry: string;

  // Assistance package state
  assistancePackages: AssistancePackageDictionary;
  hasAdmission: boolean;
  isGoingToQuebec: boolean;
  hasCAQ: boolean;
  hasGraduateStudiesDiploma: boolean;
  hasHighSchoolDiplomaEquivalence: boolean;

  // Service state
  hasReadGuide: boolean;
  isAlreadyAdvanced: boolean;
  services: Service[];
  service: string;

  // Actions
  setCurrentStep: (step: string) => void;
  setPreviousSteps: (updater: string[] | ((prev: string[]) => string[])) => void;
  setAboutCandidate: (data: AboutCandidate) => void;
  setDestinationCountry: (country: string) => void;
  setHasAdmission: (value: boolean) => void;
  setIsGoingToQuebec: (value: boolean) => void;
  setHasCAQ: (value: boolean) => void;
  setHasGraduateStudiesDiploma: (value: boolean) => void;
  setHasHighSchoolDiplomaEquivalence: (value: boolean) => void;
  setHasReadGuide: (value: boolean) => void;
  setIsAlreadyAdvanced: (value: boolean) => void;
  setService: (value: string) => void;

  // Derived getters
  getPreviousStep: () => string | null;
  getAssistancePackage: () => any;
  getAvailableAssistanceTypes: () => AssistanceType[];

  // Initialization
  initialize: (initialData: {
    fromGuide?: string | null;
    assistancePackages: AssistancePackageDictionary;
    services: Service[];
  }) => void;
};

const getSelectedPackageForCanada = (state: AssistanceFormState): AssistancePackageType => {
  if (!state.hasAdmission) {
    return AssistancePackageType.Admission;
  }

  if (!state.isGoingToQuebec) {
    return AssistancePackageType.Visa;
  }

  return state.hasCAQ ? AssistancePackageType.Visa : AssistancePackageType.CAQ;
};

const getSelectedPackageForBelgium = (state: AssistanceFormState): AssistancePackageType => {
  if (state.hasAdmission) {
    return AssistancePackageType.Visa;
  }

  if (state.hasGraduateStudiesDiploma) {
    return AssistancePackageType.Admission;
  }

  return state.hasHighSchoolDiplomaEquivalence ? AssistancePackageType.Admission : AssistancePackageType.Equivalence;
};

const getSelectedPackage = (state: AssistanceFormState): AssistancePackageType => {
  if (state.destinationCountry === DestinationCountries.CANADA.value) {
    return getSelectedPackageForCanada(state);
  } else if (state.destinationCountry === DestinationCountries.BELGIUM.value) {
    return getSelectedPackageForBelgium(state);
  } else {
    return state.hasAdmission ? AssistancePackageType.Visa : AssistancePackageType.Admission;
  }
};

// eslint-disable-next-line complexity
const preselectAssistancePackage = (
  set: (partial: Partial<AssistanceFormState>) => void,
  fromGuide: string | null | undefined
) => {
  if (!fromGuide) {
    return;
  }

  const [destinationCountry, guideType] = fromGuide.split('/');

  if (destinationCountrySlugs.indexOf(destinationCountry) === -1) {
    return;
  }

  switch (guideType) {
    case AssistancePackageType.Admission:
      set({hasAdmission: false});

      if (destinationCountry === DestinationCountries.BELGIUM.value) {
        set({currentStep: Steps.BelgiumEquivalenceCheck});
      }
      break;
    case AssistancePackageType.Equivalence:
      set({hasAdmission: false, hasHighSchoolDiplomaEquivalence: false});
      break;
    case AssistancePackageType.CAQ:
      set({hasAdmission: true, hasCAQ: false});
      break;
    case AssistancePackageType.Visa:
      set({hasAdmission: true});

      if (destinationCountry === DestinationCountries.CANADA.value) {
        set({currentStep: Steps.CanadaCAQCheck});
      }
      break;
    default:
      set({currentStep: Steps.DestinationCountry});
  }
};

export const useAssistanceFormStore = create<AssistanceFormState>((set, get) => ({
  // Common state
  currentStep: Steps.DestinationCountry,
  previousSteps: [],
  aboutCandidate: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    originCountry: ''
  },
  destinationCountry: '',

  // Assistance package state
  assistancePackages: {} as AssistancePackageDictionary,
  hasAdmission: false,
  isGoingToQuebec: false,
  hasCAQ: false,
  hasGraduateStudiesDiploma: true,
  hasHighSchoolDiplomaEquivalence: false,

  // Service state
  hasReadGuide: false,
  isAlreadyAdvanced: false,
  services: [],
  service: '',

  // Actions
  setCurrentStep: (step) => set({currentStep: step}),
  setPreviousSteps: (updater) =>
    set((state) => ({
      previousSteps: typeof updater === 'function' ? updater(state.previousSteps) : updater
    })),
  setAboutCandidate: (data) => set({aboutCandidate: data}),
  setDestinationCountry: (country) => set({destinationCountry: country}),
  setHasAdmission: (value) => set({hasAdmission: value}),
  setIsGoingToQuebec: (value) => set({isGoingToQuebec: value}),
  setHasCAQ: (value) => set({hasCAQ: value}),
  setHasGraduateStudiesDiploma: (value) => set({hasGraduateStudiesDiploma: value}),
  setHasHighSchoolDiplomaEquivalence: (value) => set({hasHighSchoolDiplomaEquivalence: value}),
  setHasReadGuide: (value) => set({hasReadGuide: value}),
  setIsAlreadyAdvanced: (value) => set({isAlreadyAdvanced: value}),
  setService: (value) => set({service: value}),

  // Derived getters
  getPreviousStep: () => {
    const {previousSteps} = get();
    return previousSteps.length < 1 ? null : previousSteps[previousSteps.length - 1];
  },

  getAssistancePackage: () => {
    const state = get();
    const selectedPackage = getSelectedPackage(state);
    const assistancePackageSlug = `${state.destinationCountry}/${selectedPackage}`;
    return state.assistancePackages[assistancePackageSlug];
  },

  getAvailableAssistanceTypes: () => {
    const state = get();
    const {isAlreadyAdvanced, destinationCountry} = state;

    const assistanceTypesList: AssistanceType[] = [];

    assistanceTypesList.push({
      type: AssistanceTypes.INFORMATION,
      title: 'shared.assistance-types.information.title',
      price: AssistancePrices[AssistanceTypes.INFORMATION]
    });

    if (isAlreadyAdvanced) {
      assistanceTypesList.push({
        type: AssistanceTypes.VERIFICATION,
        title: 'shared.assistance-types.verification.title',
        price: AssistancePrices[AssistanceTypes.VERIFICATION]
      });

      if (destinationCountry === DestinationCountries.CANADA.value) {
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
  },

  // Initialization
  initialize: ({fromGuide, assistancePackages, services}) => {
    set({assistancePackages, services});
    preselectAssistancePackage((partial) => set(partial), fromGuide);
  }
}));
