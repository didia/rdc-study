import {atom, selector, SetRecoilState} from 'recoil';

import DestinationCountries from '../destination-countries';
import {AssistanceTypes, AssistancePrices} from '../../../constants/assistance';

import {aboutCandidateState, destinationCountryState} from './common-state';
import {Service} from "../../../types/services";

export const hasReadGuideState = atom({
  key: 'hasReadGuide',
  default: false
});

export const isAlreadyAdvancedState = atom({
  key: 'isAlreadyAdvanced',
  default: false
});

const servicesState = atom({
  key: 'services',
  default: []
});

export const serviceState = atom({
  key: 'assistanceType',
  default: ''
});

export const availableAssistanceTypesState = selector({
  key: 'availableAssistanceTypes',

  get: ({get}) => {
    const hasReadGuide = get(hasReadGuideState);
    const isAlreadyAdvanced = get(isAlreadyAdvancedState);
    const country = get(destinationCountryState);
    const {originCountry} = get(aboutCandidateState);

    const assistanceTypesList = [];

    const consultationPrice = AssistancePrices[AssistanceTypes.CONSULTATION];

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

export type ServiceStateInitialData = {
  services: Service[];
};

export const initializeState: (set: SetRecoilState, initialData: ServiceStateInitialData) => void = (set, {services}) => {
  set(servicesState, services);
};
