// Vendor
import React from 'react';
import {useIntl} from 'react-intl';
import {Link} from 'gatsby';
import {useRecoilValue} from 'recoil';

// Styles
import styles from './styles.module.scss';

// States
import {assistancePackageState, assistanceTypeState} from './state';

// Constants
import {AssistanceTypes} from './constants';

const translationKeysMap = {
  [AssistanceTypes.ASSISTANCE]: {
    title: 'assistance-form.steps.form-submitted.assistance.title',
    firstParagraph: 'assistance-form.steps.form-submitted.assistance.first-paragraph',
    secondParagraph: 'assistance-form.steps.form-submitted.guide-call-to-action'
  },
  [AssistanceTypes.CONSULTATION]: {
    title: 'assistance-form.steps.form-submitted.consultation.title',
    firstParagraph: 'assistance-form.steps.form-submitted.consultation.first-paragraph',
    secondParagraph: 'assistance-form.steps.form-submitted.guide-call-to-action'
  },
  [AssistanceTypes.INFORMATION]: {
    title: 'assistance-form.steps.form-submitted.information.title',
    firstParagraph: 'assistance-form.steps.form-submitted.information.first-paragraph',
    secondParagraph: 'assistance-form.steps.form-submitted.information.second-paragraph'
  }
};

const FormSubmittedStep = () => {
  const intl = useIntl();
  const assistancePackage = useRecoilValue(assistancePackageState);
  const assistanceType = useRecoilValue(assistanceTypeState);

  const translations = translationKeysMap[assistanceType];

  const guidePath = `/guides/${assistancePackage}`;

  return (
    <div>
      <h2 className={styles.title} style={{textAlign: 'center'}}>
        {intl.formatMessage({id: translations.title})}
      </h2>

      <p className={styles['form-submitted-paragraph']}>{intl.formatMessage({id: translations.firstParagraph})}</p>

      <p>{intl.formatMessage({id: translations.secondParagraph})}</p>

      <div className={styles['centralized-button-wrapper']}>
        <Link to={guidePath} className="button special call-to-action">
          {intl.formatMessage({id: 'assistance-form.steps.form-submitted.read-guide-button'})}
        </Link>
      </div>
    </div>
  );
};

export default FormSubmittedStep;
