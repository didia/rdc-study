import {Link} from 'gatsby';
import React from 'react';
import {FormattedMessage} from 'react-intl';

// Components
import GenericPage from '../GenericPage';
import CompetitiveAdvantages from '../IndexPage/CompetitiveAdvantages';

const page = {
  title: "JE VEUX UNE BOURSE D'ETUDES",
  path: '/accompagnement'
};

const AssistanceScholarship = ({}) => {
  return (
    <GenericPage page={page}>
      <section>
        <p>
          {' '}
          Nous n'offrons malheureusement pas des bourses! Nous accompagnons ceux qui souhaitent poursuivre leurs études
          supérieures à l'étranger par leurs propres moyens. Vous trouverez toutes les offres des bourses dont nous
          avons connaissance sur notre site web
          <FormattedMessage id="shared.link.site">{(text) => <Link to="/bourses">{text}</Link>}</FormattedMessage>
        </p>
        <CompetitiveAdvantages />

        <p style={{marginTop: '20px'}}>
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
