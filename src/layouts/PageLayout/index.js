// Vendor
import React from 'react';
import T from 'prop-types';
import Helmet from 'react-helmet';
import {IntlProvider, addLocaleData} from 'react-intl';
import fr from 'react-intl/locale-data/fr';

// Locale
import messages from '../../locales/fr.json';

// Styles
import '../../assets/styles/main.scss';
import styles from './styles.module.scss';

// Components
import Header from '../../components/Header';

addLocaleData(fr);

const TemplateWrapper = ({children}) => (
  <IntlProvider locale="fr" messages={messages}>
    <div className={styles['page-wrapper']}>
      <Helmet
        title="RDC Study"
        meta={[
          {name: 'description', content: 'Le guide des études à l’étranger'},
          {name: 'keywords', content: 'etudier à l’étranger, étudier au Canada, étudier en Russie'}
        ]}
      />
      <Header />
      {children}
    </div>
  </IntlProvider>
);

TemplateWrapper.propTypes = {
  children: T.element.isRequired
};

export default TemplateWrapper;
