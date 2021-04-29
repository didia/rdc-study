import {initializeState as initializeAssistancePackageState} from './assistance-package-state';
import {initializeState as initialzeServiceState} from './service-state';

export * from './common-state';
export * from './assistance-package-state';
export * from './service-state';

export const initializeState = (initialData) => {
  return ({set}) => {
    initializeAssistancePackageState(initialData)(set);
    initialzeServiceState(initialData)(set);
  };
};
