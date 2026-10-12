'use client';

import {create} from 'zustand';

import DestinationCountries, {destinationCountrySlugs} from './destination-countries';
import Steps from './steps';
import {AssistanceTypes} from '../../constants/assistance';
import {DEFAULT_PRICES} from '@/lib/default-prices';
import {priceFor, type PriceRow} from '@/lib/price-resolve';
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
  guideSlugs: string[];
  services: Service[];
  service: string;
  prices: PriceRow[];
  idempotencyKey: string | null;
  requestReference: string | null;

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
  setRequestReference: (reference: string | null) => void;

  // Derived getters
  getPreviousStep: () => string | null;
  getAssistancePackage: () => any;
  getAvailableAssistanceTypes: () => AssistanceType[];
  getPriceCents: (serviceType: string) => number;
  getIntakePayload: (args: {message: string; sourceUrl: string}) => Record<string, unknown>;
  getGuidePath: () => string;

  // Initialization
  initialize: (initialData: {
    fromGuide?: string | null;
    assistancePackages: AssistancePackageDictionary;
    services: Service[];
    guideSlugs?: string[];
    prices?: PriceRow[];
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

const getAssistancePackageSlug = (state: AssistanceFormState): string =>
  `${state.destinationCountry}/${getSelectedPackage(state)}`;

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

  // Without the destination the selected package cannot be resolved later in the form.
  set({destinationCountry});

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
  guideSlugs: [],
  services: [],
  service: '',
  prices: DEFAULT_PRICES,
  idempotencyKey: null,
  requestReference: null,

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
  setService: (value) => set({service: value, idempotencyKey: null, requestReference: null}),
  setRequestReference: (reference) => set({requestReference: reference}),

  // Derived getters
  getPreviousStep: () => {
    const {previousSteps} = get();
    return previousSteps.length < 1 ? null : previousSteps[previousSteps.length - 1];
  },

  getAssistancePackage: () => {
    const state = get();
    return state.assistancePackages[getAssistancePackageSlug(state)];
  },

  getAvailableAssistanceTypes: () => {
    const state = get();
    const {isAlreadyAdvanced, destinationCountry} = state;
    const priceOf = (type: string) => state.getPriceCents(type) / 100;

    const assistanceTypesList: AssistanceType[] = [];

    assistanceTypesList.push({
      type: AssistanceTypes.INFORMATION,
      title: 'shared.assistance-types.information.title',
      price: priceOf(AssistanceTypes.INFORMATION)
    });

    if (isAlreadyAdvanced) {
      assistanceTypesList.push({
        type: AssistanceTypes.VERIFICATION,
        title: 'shared.assistance-types.verification.title',
        price: priceOf(AssistanceTypes.VERIFICATION)
      });

      if (destinationCountry === DestinationCountries.CANADA.value) {
        assistanceTypesList.push({
          type: AssistanceTypes.VERIFICATION_ET_LETTRE,
          title: 'shared.assistance-types.verification-et-lettre.title',
          price: priceOf(AssistanceTypes.VERIFICATION_ET_LETTRE)
        });
      }
    } else {
      assistanceTypesList.push({
        type: AssistanceTypes.ASSISTANCE,
        title: 'shared.assistance-types.assistance.title',
        price: priceOf(AssistanceTypes.ASSISTANCE)
      });
    }

    return assistanceTypesList;
  },

  // Price (in cents) the visitor is shown for a service, for the package they are going through.
  getPriceCents: (serviceType) => {
    const state = get();
    return priceFor(state.prices, serviceType, getAssistancePackageSlug(state)) ?? 0;
  },

  // Structured version of the request for POST /api/requests. The idempotency key is created once per
  // submission attempt and reused on retries, so a double click or a retry never creates two requests.
  getIntakePayload: ({message, sourceUrl}) => {
    const state = get();
    let idempotencyKey = state.idempotencyKey;
    if (!idempotencyKey) {
      idempotencyKey =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      set({idempotencyKey});
    }
    const {firstName, lastName, email, phone, originCountry} = state.aboutCandidate;
    return {
      idempotencyKey,
      firstName,
      lastName,
      email,
      phone,
      originCountry,
      destinationCountry: state.destinationCountry,
      packageSlug: getAssistancePackageSlug(state),
      serviceType: state.service,
      formAnswers: {
        hasAdmission: state.hasAdmission,
        isGoingToQuebec: state.isGoingToQuebec,
        hasCAQ: state.hasCAQ,
        hasGraduateStudiesDiploma: state.hasGraduateStudiesDiploma,
        hasHighSchoolDiplomaEquivalence: state.hasHighSchoolDiplomaEquivalence,
        hasReadGuide: state.hasReadGuide,
        isAlreadyAdvanced: state.isAlreadyAdvanced
      },
      message,
      sourceUrl,
      displayedPriceCents: state.getPriceCents(state.service)
    };
  },

  getGuidePath: () => {
    const state = get();
    const guideSlug = getAssistancePackageSlug(state);
    const hasGuide = state.guideSlugs.includes(guideSlug);

    // Fall back to the country guide when the selected package has no dedicated guide
    return `/guides/${hasGuide ? guideSlug : state.destinationCountry}`;
  },

  // Initialization
  initialize: ({fromGuide, assistancePackages, services, guideSlugs = [], prices}) => {
    set({assistancePackages, services, guideSlugs, ...(prices ? {prices} : {})});
    preselectAssistancePackage((partial) => set(partial), fromGuide);
  }
}));
