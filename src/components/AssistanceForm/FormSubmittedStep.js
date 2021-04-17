// Vendor
import React from 'react';
import {useIntl} from 'react-intl';
import {Link} from 'gatsby';
import {useRecoilValue} from 'recoil';

// Styles
import styles from './styles.module.scss';

// States
import {assistancePackageState, serviceState} from './state';

// Constants
import {AssistanceTypes} from '../../constants/assistance';

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
  },
  [AssistanceTypes.VERIFICATION]: {
    title: 'assistance-form.steps.form-submitted.verification.title',
    firstParagraph: 'assistance-form.steps.form-submitted.verification.first-paragraph',
    secondParagraph: 'assistance-form.steps.form-submitted.verification.second-paragraph'
  },
  [AssistanceTypes.VERIFICATION_ET_LETTRE]: {
    title: 'assistance-form.steps.form-submitted.verification.title',
    firstParagraph: 'assistance-form.steps.form-submitted.verification.first-paragraph',
    secondParagraph: 'assistance-form.steps.form-submitted.verification.second-paragraph'
  }
};

const FormSubmittedStep = () => {
  const intl = useIntl();
  const assistancePackage = useRecoilValue(assistancePackageState);
  const assistanceType = useRecoilValue(serviceState);

  const translations = translationKeysMap[assistanceType];

  const guidePath = `/guides/${assistancePackage.slug}`;

  return (
    <div>
      <h2 className={styles.title} style={{textAlign: 'center'}}>
        {intl.formatMessage({id: translations.title})}
      </h2>

      <p className={styles['form-submitted-paragraph']}>{intl.formatMessage({id: translations.firstParagraph})}</p>

      <p
        dangerouslySetInnerHTML={{__html: intl.formatMessage({id: translations.secondParagraph})}}
        className={styles['form-submitted-paragraph']}
      />

      <div className={styles['centralized-button-wrapper']}>
        <Link to={guidePath} className="button special call-to-action">
          {intl.formatMessage({id: 'assistance-form.steps.form-submitted.read-guide-button'})}
        </Link>
      </div>
    </div>
  );
};

export default FormSubmittedStep;
