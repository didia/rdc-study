// Vendor
import React from 'react';
import Link from 'gatsby-link';
import T from 'prop-types';
import {FormattedMessage} from 'react-intl';
import classnames from 'classnames';
import enhanceWithClickOutside from 'react-click-outside';

// Styles
import styles from './styles.module.scss';

const MENU_ITEMS = [
  {
    labelKey: 'menu.home-link-label',
    to: '/'
  },
  {
    labelKey: 'menu.assistance-link-label',
    to: '/accompagnement'
  },
  {
    labelKey: 'menu.about-us-link-label',
    to: '/a-propos'
  }
];

class InnerMenu extends React.Component {
  handleClickOutside() {
    if (this.props.isVisible) {
      this.props.onToggleMenu();
    }
  }

  render() {
    const {onToggleMenu} = this.props;

    return (
      <div className={styles.inner}>
        <FormattedMessage id="menu.title">{text => <h2 className={styles.title}>{text}</h2>}</FormattedMessage>

        <ul className={styles.links}>
          {MENU_ITEMS.map((item, index) => (
            <li key={`menu-item-${index}`} className={styles.links__item}>
              <FormattedMessage id={item.labelKey}>
                {text => (
                  <Link onClick={onToggleMenu} className={styles['links-item__link']} to={item.to}>
                    {text}
                  </Link>
                )}
              </FormattedMessage>
            </li>
          ))}
        </ul>

        <FormattedMessage id="menu.close-button-label">
          {text => (
            <a className={styles['close-button']} href="javascript:;" onClick={onToggleMenu}>
              {text}
            </a>
          )}
        </FormattedMessage>
      </div>
    );
  }
}

const InnerMenuWithClickOutside = enhanceWithClickOutside(InnerMenu);

InnerMenu.propTypes = {
  isVisible: T.bool,
  onToggleMenu: T.func.isRequired
};

const Menu = ({isVisible, onToggleMenu}) => {
  const visibilityClass = isVisible ? styles['menu--visible'] : null;

  return (
    <nav className={classnames(styles.menu, visibilityClass)}>
      <InnerMenuWithClickOutside isVisible={isVisible} onToggleMenu={onToggleMenu} />
    </nav>
  );
};

Menu.propTypes = {
  isVisible: T.bool,
  onToggleMenu: T.func.isRequired
};

export default Menu;
