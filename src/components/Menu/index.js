// Vendor
import React from 'react';
import Link from 'gatsby-link';
import T from 'prop-types';
import {FormattedMessage} from 'react-intl';
import classnames from 'classnames';
import enhanceWithClickOutside from 'react-click-outside';

// Styles
import styles from './styles.module.scss';

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
          <li className={styles.links__item}>
            <FormattedMessage id="menu.home-link-label">
              {text => (
                <Link onClick={onToggleMenu} className={styles['links-item__link']} to="/">
                  {text}
                </Link>
              )}
            </FormattedMessage>
          </li>

          <li className={styles.links__item}>
            <FormattedMessage id="menu.about-us-link-label">
              {text => (
                <Link onClick={onToggleMenu} className={styles['links-item__link']} to="/a-propos">
                  {text}
                </Link>
              )}
            </FormattedMessage>
          </li>
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
