export const AssistanceTypes = {
  INFORMATION: 'information',
  ASSISTANCE: 'assistance',
  CONSULTATION: 'consultation',
  VERIFICATION: 'verification',
  VERIFICATION_ET_LETTRE: 'verification-et-lettre'
};

export const AssistancePrices = {
  [AssistanceTypes.INFORMATION]: 0,
  [AssistanceTypes.ASSISTANCE]: 300,
  [AssistanceTypes.CONSULTATION]: 30,
  [AssistanceTypes.VERIFICATION]: 100,
  [AssistanceTypes.VERIFICATION_ET_LETTRE]: 150
};
