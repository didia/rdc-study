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
 title: 'JE VEUX UNE ASSISTANCE',
  path: '/accompagnement'
};

const AssistancePage = ({assistancePackages, services}) => {
  const [fromGuide] = useQueryParam('pour', StringParam);
  const [service] = useQueryParam('service', StringParam);

  return (
    <GenericPage page={page} bannerClassName={styles.banner}>
      <RecoilRoot initializeState={initializeState({assistancePackages, services, fromGuide, service})}>
        <section style={{position: 'relative', marginTop: '-176px'}}>
          <div style={{margin: 'auto', width: '585px'}}>
            <FormattedMessage id="pages.assistance.call-to-action-button-text">
              {(text) => (
                <Link to="/assistance-bourse" className="button special call-to-action" style={{marginRight: '7px'}}>
                  {text}
                </Link>
              )}
            </FormattedMessage>
            <FormattedMessage id="pages.accompanied.call-to-action-button-text">
              {(text) => (
                <Link to="/assistance-process" className="button special call-to-action">
                  {text}
                </Link>
              )}
            </FormattedMessage>
          </div>
          <br />
          <br />
          <br />
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
  assistancePackages: T.object.isRequired,
  services: T.array.isRequired
};

export default AssistancePage;
