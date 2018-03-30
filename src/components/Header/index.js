// Vendor
import React from 'react';
import Link from 'gatsby-link';
import {FormattedMessage} from 'react-intl';
import classnames from 'classnames';

// Styles
import styles from './styles.module.scss';

const Header = () => (
  <header className={classnames(styles.header, styles['header--home'])}>
    <h1 className={styles.title}>
      <Link to="/" className={styles.title__link}>
        <FormattedMessage id="header.title" />
      </Link>
    </h1>

    <nav className={styles.nav}>
      <FormattedMessage id="header.menu-toggle-label">
        {text => (
          <a className={styles.nav__link} href="#menu">
            {text}
          </a>
        )}
      </FormattedMessage>
    </nav>
  </header>
);

export default Header;
