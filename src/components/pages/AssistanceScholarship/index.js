import { Link } from 'gatsby';
import React from 'react';
import { FormattedMessage } from 'react-intl';

// Components
import GenericPage from '../GenericPage';
import CompetitiveAdvantages from '../IndexPage/CompetitiveAdvantages';

// Styles
import styles from './styles.module.scss';


const page = {
  description: "Nous n'offrons malheureusement pas des bourses! Nous accompagnons ceux qui souhaitent poursuivre leurs études supérieures à l'étranger par leurs propres moyens. Vous trouverez toutes les offres des bourses dont nous avons connaissance sur notre site web",
  title: "JE VEUX UNE BOURSE D'ETUDES",
  path: '/accompagnement'
};

const AssistanceScholarship = ({ }) => {
  return (
    <GenericPage page={page}>
      <section style={{position: 'relative', marginTop: '-176px'}}>
        <div className={styles['call-to-action-wrapper']}>
          <FormattedMessage id="pages.souhait.call-to-action-button-text">
            {(text) => (
              <Link to="/bourses" className="button special call-to-action">
                {text}
              </Link>
            )}
          </FormattedMessage>

        </div>
        <CompetitiveAdvantages />

        <p style={{ marginTop: '20px' }}>
          <FormattedMessage id="pages.assistance.visa.warning" />
          <FormattedMessage id="pages.assistance.visa.warning-learn-more">
            {(text) => <Link to="/assistance-visa">{text}</Link>}
          </FormattedMessage>
        </p>
      </section>
    </GenericPage>
  );
};

export default AssistanceScholarship;
