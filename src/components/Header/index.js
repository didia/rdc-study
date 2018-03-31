// Vendor
import React from 'react';
import Link from 'gatsby-link';
import {FormattedMessage} from 'react-intl';
import classnames from 'classnames';
import T from 'prop-types';

// Styles
import styles from './styles.module.scss';

const Header = ({withTitle}) => {
  const className = withTitle ? classnames(styles.header, styles['header--with-title']) : styles.header;

  return (
    <header className={className}>
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
};

Header.propTypes = {
  withTitle: T.bool
};

export default Header;
