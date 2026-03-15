'use client';

import React from 'react';
import Link from 'next/link';
import {FormattedMessage} from 'react-intl';
import classnames from 'classnames';

import styles from './styles.module.scss';

const Header = ({withTitle, onToggleMenu}) => {
  const className = withTitle ? classnames(styles.header, styles['header--with-title']) : styles.header;

  return (
    <header className={className}>
      <h1 className={styles.title}>
        <FormattedMessage id="header.title">
          {(text) => (
            <Link href="/" className={styles.title__link}>
              {text}
            </Link>
          )}
        </FormattedMessage>
      </h1>

      <nav className={styles.nav}>
        <FormattedMessage id="header.menu-toggle-label">
          {(text) => (
            <a className={styles.nav__link} onClick={onToggleMenu} href="#">
              {text}
              <i className={classnames('fas fa-bars', styles['nav-link__icon'])} />
            </a>
          )}
        </FormattedMessage>
      </nav>
    </header>
  );
};

export default Header;
