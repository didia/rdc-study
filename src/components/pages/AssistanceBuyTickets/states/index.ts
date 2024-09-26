import { atom, selector } from 'recoil';
import { AssistancePrices, AssistanceTypes } from '../../../../constants/assistance';

export const destinationDetailState = atom({
  key: 'destinationDetail',
  default: {
    country: '',
    city: '',
  }
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

export const availableAssistanceTypesState = selector({
  key: 'availableAssistanceTypes',

  get: ({ get }) => {

    var assistanceTypesList = [];

    const consultationPrice = AssistancePrices[AssistanceTypes.CONSULTATION];

    assistanceTypesList.push(
      {
        type: AssistanceTypes.CONSULTATION,
        title: 'shared.assistance-types.buy-ticket.consultation.title',
        price: consultationPrice
      }
    );


    return assistanceTypesList;
  }
});

export const setInitialStep = (initialStep: string) => {
  return atom({
    key: 'currentStep',
    default: initialStep
  });
}

export const previousStepsState = atom({
  key: 'previousSteps',
  default: []
});

export const previousStepState = selector({
  key: 'previousFormStep',

  get: ({ get }) => {
    const previousSteps = get(previousStepsState);

    return previousSteps.length < 1 ? null : previousSteps[previousSteps.length - 1];
  }
});