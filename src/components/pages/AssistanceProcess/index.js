import {Link} from 'gatsby';
import React from 'react';
import T from 'prop-types';
import {FormattedMessage} from 'react-intl';
import {RecoilRoot} from 'recoil';
import {useQueryParam, StringParam} from 'use-query-params';
import {Steps, StepRegistry} from "./steps";

// Styles
import styles from './styles.module.scss';

// Components
import GenericPage from '../GenericPage';
import AssistanceForm, {initializeState} from '../../AssistanceForm';

import CompetitiveAdvantages from '../IndexPage/CompetitiveAdvantages';


const page = {
  description:"L'accampagnement RDC ETUDES consiste à vous orienter dans votre projet d'études du choix de l'université jusqu'à l'obtention de votre visa.",
  title: 'JE SOUHAITE ETRE ASSISTE PAR UN MENTOR RDC ETUDES.',
  path: '/accompagnement'
};

const AssistanceProcess = ({assistancePackages, services}) => {
  const [fromGuide] = useQueryParam('pour', StringParam);
  const [service] = useQueryParam('service', StringParam);

  return (
    <GenericPage page={page} bannerClassName={styles.banner}>
      <RecoilRoot initializeState={initializeState({assistancePackages, services, fromGuide, service})}>
        <AssistanceForm 
          steps={Steps} 
          initialStep={Steps.DestinationCountry} 
          stepRegistry={StepRegistry}
          />

        <section className={styles['offer-block']}>
          <CompetitiveAdvantages />

          <p style={{marginTop: '20px'}}>
            <FormattedMessage id="pages.assistance.visa.warning" />
            <FormattedMessage id="pages.assistance.visa.warning-learn-more">
              {(text) => <Link to="/assistance-visa">{text}</Link>}
            </FormattedMessage>
          </p>
        </section>
      </RecoilRoot>
    </GenericPage>
  );
};

AssistanceProcess.propTypes = {
  assistancePackages: T.object.isRequired,
  services: T.array.isRequired
};

export default AssistanceProcess;
