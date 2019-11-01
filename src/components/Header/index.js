// Vendor
import React from 'react';
import {Link} from 'gatsby';
import {FormattedMessage} from 'react-intl';
import classnames from 'classnames';
import T from 'prop-types';

// Styles
import styles from './styles.module.scss';

const Header = ({withTitle, onToggleMenu}) => {
  const className = withTitle ? classnames(styles.header, styles['header--with-title']) : styles.header;

  return (
    <header className={className}>
      <h1 className={styles.title}>
        <FormattedMessage id="header.title">
          {text => (
            <Link to="/" className={styles.title__link}>
              {text}
            </Link>
          )}
        </FormattedMessage>
      </h1>

      <nav className={styles.nav}>
        <FormattedMessage id="header.menu-toggle-label">
          {text => (
            <a className={styles.nav__link} onClick={onToggleMenu} href="#">
              {text}
            </a>
          )}
        </FormattedMessage>
      </nav>
    </header>
  );
};

Header.propTypes = {
  onToggleMenu: T.func.isRequired,
  withTitle: T.bool
};

export default Header;
