// Vendor
import React from 'react';
import {useIntl} from 'react-intl';
import T from 'prop-types';
import {useRecoilState, useSetRecoilState} from 'recoil';

// Styles
import styles from './styles.module.scss';
import {previousStepsState, currentStepState} from './state';
import {getStepComponent, goToStep} from './steps';

const SubmitFormStep = () => {
  const intl = useIntl();

  const [previousSteps, setPreviousSteps] = useRecoilState(previousStepsState);
  const setCurrentStep = useSetRecoilState(currentStepState);

  const stepComponents = previousSteps.map((stepKey) => ({key: stepKey, component: getStepComponent(stepKey)}));

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
        <button className="special">
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
