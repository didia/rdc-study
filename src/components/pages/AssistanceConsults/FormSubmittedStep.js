// Vendor
import React from 'react';
import {useIntl} from 'react-intl';
import {Link} from 'gatsby';
import {useRecoilValue} from 'recoil';

// Styles
import styles from './styles.module.scss';

// States
import {destinationDetailState, aboutCandidateState} from './states';

// Constants
import {AssistanceTypes} from '../../../constants/assistance';
import axios from 'axios';

// Config
import config from '../../../../config';
const {contactFormEndpoint} = config;

const translationKeysMap = {
  [AssistanceTypes.ASSISTANCE]: {
    title: 'assistance-form.steps.form-submitted.assistance.title',
    firstParagraph: 'assistance-form.steps.form-submitted.assistance.first-paragraph',
    secondParagraph: 'assistance-form.steps.form-submitted.guide-call-to-action'
  },
};

const FormSubmittedStep = () => {
  const intl = useIntl();
  //const assistancePackage = useRecoilValue(destinationDetailState);
  //const assistanceType = useRecoilValue(serviceState);
  const destinationDetail = useRecoilValue(destinationDetailState);
  const aboutCandidate = useRecoilValue(aboutCandidateState);
  const translations = translationKeysMap[AssistanceTypes.ASSISTANCE];
  const name = `${aboutCandidate.firstName} ${aboutCandidate.lastName}`;
   
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
        
      </div>
    </div>
  );
};

export default FormSubmittedStep;
