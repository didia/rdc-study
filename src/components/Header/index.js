// Vendor
import React from 'react';
import Link from 'gatsby-link';
import {FormattedMessage} from 'react-intl';

// Styles
import styles from './styles.module.scss';

const Header = () => (
  <div className={styles.header}>
    <div className={styles['header__inner-wrapper']}>
      <h1 style={{margin: 0}}>
        <Link to="/" className={styles.header__link}>
          <FormattedMessage id="header.title" />
        </Link>
      </h1>
    </div>
  </div>
);

export default Header;
