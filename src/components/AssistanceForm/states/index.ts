import {MutableSnapshot} from 'recoil';
import {
  AssistancePackageStateInitialData,
  initializeState as initializeAssistancePackageState
} from './assistance-package-state';
import {initializeState as initializeServiceState, ServiceStateInitialData} from './service-state';

export * from './common-state';
export * from './assistance-package-state';
export * from './service-state';

export const initializeState = (initialData: ServiceStateInitialData & AssistancePackageStateInitialData) => {
  return ({set}: MutableSnapshot): void => {
    initializeAssistancePackageState(set, initialData);
    initializeServiceState(set, initialData);
  };
};
