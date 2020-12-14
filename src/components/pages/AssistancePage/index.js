// Vendor
import React from 'react';
import T from 'prop-types';
import {Link} from 'gatsby';
import {FormattedMessage} from 'react-intl';
import {RecoilRoot} from 'recoil';
import {useQueryParam, StringParam} from 'use-query-params';

// Styles
import styles from './styles.module.scss';

// Components
import GenericPage from '../GenericPage';
import AssistanceForm, {initializeState} from '../../AssistanceForm';
import CompetitiveAdvantages from '../IndexPage/CompetitiveAdvantages';

const page = {
  description:
    'Faites vos démarches en étant accompagné par un mentor qui a déjà eu à faire les mêmes démarches que vous et augmentez ainsi vos chances de réussir votre projet d’études.',
  title: 'Nous vous assistons dans vos démarches',
  path: '/accompagnement'
};

const AssistancePage = ({assistancePackages}) => {
  const [fromGuide] = useQueryParam('pour', StringParam);

  return (
    <GenericPage page={page} bannerClassName={styles.banner}>
      <RecoilRoot initializeState={initializeState({fromGuide})}>
        <AssistanceForm assistancePackages={assistancePackages} />

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

AssistancePage.propTypes = {
  assistancePackages: T.object.isRequired
};

export default AssistancePage;
