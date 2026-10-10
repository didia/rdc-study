'use client';

// Vendor
import React, {useRef, useEffect} from 'react';
import classnames from 'classnames';
import T from 'prop-types';

// Components
import Card from '../Card';

// Styles
import styles from './styles.module.scss';

// Store
import {useAssistanceFormStore} from './store';
import Steps, {getStepComponent, goToNextStep, goToPreviousStep, goToStep} from './steps';

// Utils
import isScrolledIntoView from '../../utils/is-scrolled-into-view';

const FLOW_STAGES = [
  {
    label: 'Projet',
    steps: [Steps.DestinationCountry, Steps.BelgiumEquivalenceCheck, Steps.CanadaCAQCheck, Steps.AssistanceLevelCheck]
  },
  {label: 'Profil', steps: [Steps.AboutCandidate]},
  {label: 'Service', steps: [Steps.SubmitForm]},
  {label: 'Validation', steps: [Steps.AccompagnementTerms, Steps.FormSubmitted]}
];

const MasterForm = ({assistancePackages, services, guideSlugs, fromGuide, service}) => {
  const currentStepRef = useRef(null);

  const currentStep = useAssistanceFormStore((s) => s.currentStep);
  const previousSteps = useAssistanceFormStore((s) => s.previousSteps);
  const setCurrentStep = useAssistanceFormStore((s) => s.setCurrentStep);
  const setPreviousSteps = useAssistanceFormStore((s) => s.setPreviousSteps);
  const initialize = useAssistanceFormStore((s) => s.initialize);
  const getPreviousStep = useAssistanceFormStore((s) => s.getPreviousStep);

  const previousStep = getPreviousStep();

  useEffect(() => {
    initialize({fromGuide, assistancePackages, services, guideSlugs});
  }, [fromGuide, assistancePackages, services, guideSlugs, initialize]);

  const scrollIntoViewIfNecessary = () => {
    if (!isScrolledIntoView(currentStepRef.current)) {
      currentStepRef.current.scrollIntoView();
    }
  };

  const onPreviousStep = previousStep
    ? () => {
        goToPreviousStep({currentStep, previousStep, setCurrentStep, setPreviousSteps});
        scrollIntoViewIfNecessary();
      }
    : null;

  const onNextStep = (nextStep) => {
    goToNextStep({currentStep, nextStep, setCurrentStep, setPreviousSteps});
    scrollIntoViewIfNecessary();
  };

  const onRestart = () => {
    goToStep({setCurrentStep, setPreviousSteps, step: Steps.DestinationCountry});
    scrollIntoViewIfNecessary();
  };

  const CurrentStepComponent = getStepComponent(currentStep);
  const activeStageIndex = FLOW_STAGES.findIndex((stage) => stage.steps.includes(currentStep));

  return (
    <div ref={currentStepRef} className={styles['card-wrapper']}>
      <ol className={styles.progress} aria-label="Progression du formulaire">
        {FLOW_STAGES.map((stage, index) => (
          <li
            key={stage.label}
            className={classnames(
              styles.stage,
              index === activeStageIndex ? styles['stage--active'] : null,
              index < activeStageIndex ? styles['stage--completed'] : null
            )}
            aria-current={index === activeStageIndex ? 'step' : undefined}
          >
            <span className={styles.stage__number}>{index < activeStageIndex ? '✓' : index + 1}</span>
            <span className={styles.stage__label}>{stage.label}</span>
          </li>
        ))}
      </ol>
      <Card className={styles.card}>
        <CurrentStepComponent onNextStep={onNextStep} onPreviousStep={onPreviousStep} onRestart={onRestart} />
      </Card>
    </div>
  );
};

MasterForm.propTypes = {
  assistancePackages: T.object,
  services: T.array,
  guideSlugs: T.array,
  fromGuide: T.string,
  service: T.string
};

export default MasterForm;
