// Vendor
import React, {useState} from 'react';
import {useIntl} from 'react-intl';
import {Formik, Form} from 'formik';
import T from 'prop-types';
import {useRecoilState} from 'recoil';
import {CSSTransition} from 'react-transition-group';

// Components
import StepForm from './StepForm';
import StepActions from './StepActions';
import {YesNoField} from './YesNoStepForm';

// States
import {hasGraduateStudiesDiplomaState, hasHighSchoolDiplomaEquivalenceState} from './state';

// Styles
import styles from './styles.module.scss';

// Constants
import {Steps} from './steps';

const BelgiumEquivalenceCheckStep = ({onNextStep, onPreviousStep}) => {
  const intl = useIntl();
  const [hasGraduateStudiesDiploma, setHasGraduateStudiesDiploma] = useRecoilState(hasGraduateStudiesDiplomaState);
  const [hasHighSchoolDiplomaEquivalence, setHasHighSchoolDiplomaEquivalence] = useRecoilState(
    hasHighSchoolDiplomaEquivalenceState
  );

  const [showHasHighSchoolDiplomaEquivalence, setShowHasHighSchoolDiplomaEquivalence] = useState(
    !hasGraduateStudiesDiploma
  );

  const initialValues = {
    hasGraduateStudiesDiploma: hasGraduateStudiesDiploma ? 'true' : 'false',
    hasHighSchoolDiplomaEquivalence: hasHighSchoolDiplomaEquivalence ? 'true' : 'false'
  };

  return (
    <StepForm title={intl.formatMessage({id: 'assistance-form.steps.belgium-equivalence-check.title'})}>
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          const hasGraduateStudiesDiploma = values.hasGraduateStudiesDiploma === 'true';
          const hasHighSchoolDiplomaEquivalence = values.hasHighSchoolDiplomaEquivalence === 'true';

          setHasGraduateStudiesDiploma(hasGraduateStudiesDiploma);
          setHasHighSchoolDiplomaEquivalence(hasHighSchoolDiplomaEquivalence);

          onNextStep(Steps.AboutCandidate);
        }}
      >
        {({isSubmitting}) => (
          <Form>
            <div className={styles.fields}>
              <YesNoField
                name="hasGraduateStudiesDiploma"
                onChange={(value) => setShowHasHighSchoolDiplomaEquivalence(value === 'false')}
              />

              <CSSTransition in={showHasHighSchoolDiplomaEquivalence} timeout={200} classNames="fade" unmountOnExit>
                <YesNoField
                  label={intl.formatMessage({id: 'assistance-form.steps.belgium-equivalence-check.has-equivalence'})}
                  name="hasHighSchoolDiplomaEquivalence"
                />
              </CSSTransition>
            </div>

            <StepActions disabled={isSubmitting} onPrevious={onPreviousStep} />
          </Form>
        )}
      </Formik>
    </StepForm>
  );
};

export default BelgiumEquivalenceCheckStep;

BelgiumEquivalenceCheckStep.propTypes = {
  onNextStep: T.func,
  onPreviousStep: T.func
};
