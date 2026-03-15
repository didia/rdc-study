'use client';

import React, {useCallback, useRef, useEffect} from 'react';
import Link from 'next/link';
import {FormattedMessage} from 'react-intl';
import classnames from 'classnames';

import styles from './styles.module.scss';

const MENU_ITEMS = [
  {labelKey: 'menu.home-link-label', to: '/'},
  {labelKey: 'menu.scholarships-link-label', to: '/bourses'},
  {labelKey: 'menu.assistance-link-label', to: '/accompagnement'},
  {labelKey: 'menu.about-us-link-label', to: '/a-propos'},
  {labelKey: 'menu.partner-link-label', to: '/nos-partenaires'},
  {labelKey: 'menu.faq-label', to: '/questions-populaires'},
  {labelKey: 'menu.legal-notes-label', to: '/assistance-visa'},
  {labelKey: 'menu.privacy-policy-link-label', to: '/politique-de-confidentialite'},
];

const Menu = ({isVisible, onToggleMenu}) => {
  const innerRef = useRef(null);

  const handleClickOutside = useCallback(
    (event) => {
      if (isVisible && innerRef.current && !innerRef.current.contains(event.target)) {
        onToggleMenu();
      }
    },
    [isVisible, onToggleMenu]
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  const visibilityClass = isVisible ? styles['menu--visible'] : null;

  return (
    <nav className={classnames(styles.menu, visibilityClass)}>
      <div className={styles.inner} ref={innerRef}>
        <FormattedMessage id="menu.title">{(text) => <h2 className={styles.title}>{text}</h2>}</FormattedMessage>

        <ul className={styles.links}>
          {MENU_ITEMS.map((item, index) => (
            <li key={`menu-item-${index}`} className={styles.links__item}>
              <FormattedMessage id={item.labelKey}>
                {(text) => (
                  <Link onClick={onToggleMenu} className={styles['links-item__link']} href={item.to}>
                    {text}
                  </Link>
                )}
              </FormattedMessage>
            </li>
          ))}
        </ul>

        <FormattedMessage id="menu.close-button-label">
          {(text) => (
            <a className={styles['close-button']} href="#" onClick={onToggleMenu}>
              {text}
            </a>
          )}
        </FormattedMessage>
      </div>
    </nav>
  );
};

export default Menu;
