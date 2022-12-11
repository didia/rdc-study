import { Link } from 'gatsby';
import React from 'react';
import T from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { RecoilRoot } from 'recoil';
import { useQueryParam, StringParam } from 'use-query-params';

// Styles
import styles from './styles.module.scss';


// Components
import GenericPage from '../GenericPage';
import AssistanceForm, { initializeState } from '../../AssistanceForm';
import CompetitiveAdvantages from '../IndexPage/CompetitiveAdvantages';
import { Steps, StepRegistry } from './steps';

const page = {
  description: "Nous savons comment l'achat du billet peut être un casse tête pour vous ! Trouvez le bon itinéraire qui correspond à vos besoins et vos moyens n'est toujours pas évident ! Procurez-vous un billet à un prix imbattable!",
  title: 'Je veux acheter un billet',
  path: '/accompagnement'
};



const AssistanceBuyTickets = ({ assistancePackages, services }) => {
  const [fromGuide] = useQueryParam('pour', StringParam);
  const [service] = useQueryParam('service', StringParam);

  return (
    <GenericPage page={page} bannerClassName={styles.banner}>
      <RecoilRoot initializeState={initializeState({ assistancePackages, services, fromGuide, service })}>
        <AssistanceForm steps={Steps} stepRegistry={StepRegistry} initialStep={Steps.DestinationDetail} />

        <section className={styles['offer-block']}>
          <CompetitiveAdvantages />

          <p style={{ marginTop: '20px' }}>
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

AssistanceBuyTickets.propTypes = {
  assistancePackages: T.object.isRequired,
  services: T.array.isRequired
};

export default AssistanceBuyTickets;
