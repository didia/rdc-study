// Vendor
import React from 'react';
import {useIntl} from 'react-intl';
import T from 'prop-types';
import {useRecoilState, useSetRecoilState, useRecoilValue} from 'recoil';

// Styles
import styles from './styles.module.scss';

// State
import {previousStepsState, currentStepState, assistanceFormState} from './state';
import {getStepComponent, goToStep} from './steps';

const SubmitFormStep = ({onNextStep}) => {
  const intl = useIntl();

  const assistanceFormValues = useRecoilValue(assistanceFormState);
  const [previousSteps, setPreviousSteps] = useRecoilState(previousStepsState);
  const setCurrentStep = useSetRecoilState(currentStepState);

  const stepComponents = previousSteps.map((stepKey) => ({key: stepKey, component: getStepComponent(stepKey)}));

  const onSubmit = () => {
    window.console.log(assistanceFormValues);
    onNextStep();
  };

  return (
    <div>
      <h2 className={styles.title}>{intl.formatMessage({id: 'assistance-form.steps.submit-form.title'})}</h2>

      <p>{intl.formatMessage({id: 'assistance-form.steps.submit-form.description'})}</p>

      <div>
        {stepComponents.map(({key, component: Component}) => (
          <Component
            key={key}
            recapMode={true}
            onEditStep={() => goToStep({step: key, setCurrentStep, setPreviousSteps})}
          />
        ))}
      </div>

      <div className={styles['centralized-button-wrapper']}>
        <button className="special" onClick={onSubmit}>
          {intl.formatMessage({id: 'assistance-form.steps.submit-form.button-label'})}
        </button>
      </div>
    </div>
  );
};

SubmitFormStep.propTypes = {
  onNextStep: T.func
};

export default SubmitFormStep;
