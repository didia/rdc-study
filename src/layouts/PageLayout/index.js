// Vendor
import React from 'react';
import T from 'prop-types';
import {IntlProvider, addLocaleData} from 'react-intl';
import fr from 'react-intl/locale-data/fr';

// Locale
import messages from '../../locales/fr.json';

// Styles
import '../../assets/styles/main.scss';
import styles from './styles.module.scss';

// Components
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import SEO from '../../components/SEO';

addLocaleData(fr);

const TemplateWrapper = ({children, headerWithTitle}) => (
  <IntlProvider locale="fr" messages={messages}>
    <div className={styles['page-wrapper']}>
      <SEO />
      <Header withTitle={headerWithTitle} />
      {children}
      <Footer />
    </div>
  </IntlProvider>
);

TemplateWrapper.propTypes = {
  children: T.element.isRequired,
  headerWithTitle: T.bool
};

export default TemplateWrapper;
