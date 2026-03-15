'use client';

// Vendor
import React from 'react';
import {useIntl} from 'react-intl';
import T from 'prop-types';

// Components
import YesNoStepForm from './YesNoStepForm';

// Store
import {useAssistanceFormStore} from './store';

// Constants
import {Steps} from './steps';

const ASSISTANCE_LEVEL_OPTIONS = [
  {
    labelKey: 'assistance-form.steps.assistance-level-check.negative-option',
    value: 'false'
  },
  {
    labelKey: 'assistance-form.steps.assistance-level-check.positive-option',
    value: 'true'
  }
];

const AssistanceLevelCheckStep = ({onNextStep, onPreviousStep}) => {
  const intl = useIntl();
  const isAlreadyAdvanced = useAssistanceFormStore((s) => s.isAlreadyAdvanced);
  const setIsAlreadyAdvanced = useAssistanceFormStore((s) => s.setIsAlreadyAdvanced);

  return (
    <YesNoStepForm
      title={intl.formatMessage({id: 'assistance-form.steps.assistance-level-check.title'})}
      value={isAlreadyAdvanced}
      onPreviousStep={onPreviousStep}
      options={ASSISTANCE_LEVEL_OPTIONS}
      onSubmit={(isAlreadyAdvanced) => {
        setIsAlreadyAdvanced(isAlreadyAdvanced);
        onNextStep(Steps.AboutCandidate);
      }}
    />
  );
};

export default AssistanceLevelCheckStep;

AssistanceLevelCheckStep.propTypes = {
  onNextStep: T.func,
  onPreviousStep: T.func
};
