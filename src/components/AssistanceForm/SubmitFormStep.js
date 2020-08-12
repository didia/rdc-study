// Vendor
import React from 'react';
import {useIntl} from 'react-intl';
import T from 'prop-types';
import {useRecoilValue} from 'recoil';

// Styles
import styles from './styles.module.scss';

// Components
import HtmlContent from '../HtmlContent';

// State
import {assistanceFormState, assistancePackageState} from './state';

const SubmitFormStep = ({onNextStep, assistancePackages}) => {
  const intl = useIntl();

  const assistanceFormValues = useRecoilValue(assistanceFormState);
  const assistancePackageSlug = useRecoilValue(assistancePackageState);

  const assistancePackage = assistancePackages[assistancePackageSlug];

  const onSubmit = () => {
    window.console.log(assistanceFormValues);
    onNextStep();
  };

  return (
    <div>
      <h2 className={styles.title}>{assistancePackage.title}</h2>

      <HtmlContent content={assistancePackage.content} />

      <div className={styles['centralized-button-wrapper']}>
        <button className="special" onClick={onSubmit}>
          {intl.formatMessage({id: 'assistance-form.steps.submit-form.button-label'})}
        </button>
      </div>
    </div>
  );
};

SubmitFormStep.propTypes = {
  assistancePackages: T.objectOf(
    T.shape({
      content: T.string.isRequired,
      slug: T.string.isRequired,
      title: T.string.isRequired
    })
  ),
  onNextStep: T.func
};

export default SubmitFormStep;
