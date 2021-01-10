export const AssistanceTypes = {
  INFORMATION: 'information',
  ASSISTANCE: 'assistance',
  CONSULTATION: 'consultation',
  VERIFICATION: 'verification',
  VERIFICATION_ET_LETTRE: 'verification-et-lettre'
};

export const AssistancePrices = {
  [AssistanceTypes.INFORMATION]: 0,
  [AssistanceTypes.ASSISTANCE]: 299.99,
  [AssistanceTypes.CONSULTATION]: 29.99,
  [AssistanceTypes.VERIFICATION]: 99.99,
  [AssistanceTypes.VERIFICATION_ET_LETTRE]: 149.99
};
