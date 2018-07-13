// Vendor
import React from 'react';
import T from 'prop-types';
import {FormattedMessage} from 'react-intl';
import classnames from 'classnames';

// Constants
const FACEBOOK_SHARER_URL = 'https://www.facebook.com/sharer/sharer.php?u=';
const WHATSAPP_SHARER_URL_MOBILE = 'whatsapp://send?text=';
const WHATSAPP_SHARER_URL_DESKTOP = 'https://web.whatsapp.com/send?text=';

// Utils
import getCanonicalLink from '../../utils/get-canonical-link';
import isMobileBrowser from '../../utils/is-mobile-browser';

// Styles
import styles from './styles.module.scss';

const shareButtons = [
  {
    icon: 'fa-facebook',
    labelKey: 'shared.share-on-facebook',
    sharerUrl: FACEBOOK_SHARER_URL
  },
  {
    dataAction: 'share/whatsapp/share',
    icon: 'fa-whatsapp',
    labelKey: 'shared.share-on-whatsapp',
    sharerUrl: isMobileBrowser() ? WHATSAPP_SHARER_URL_MOBILE : WHATSAPP_SHARER_URL_DESKTOP
  }
];

const SocialShareButtons = ({path}) => {
  return (
    <ul className={styles.list}>
      {shareButtons.map((button, i) => (
        <li key={i} className={styles.item}>
          <FormattedMessage id={button.labelKey}>
            {label => (
              <a
                className={classnames('button fit', styles.button, styles[button.icon])}
                href={`${button.sharerUrl}${getCanonicalLink(path)}`}
                rel="nofollow noopener noreferrer"
                target="_blank"
                title={label}
                data-action={button.dataAction}
              >
                <i className={classnames('fa', button.icon, styles.icon)} />
                <span className={styles['button-label']}>{label}</span>
              </a>
            )}
          </FormattedMessage>
        </li>
      ))}
    </ul>
  );
};

SocialShareButtons.propTypes = {
  path: T.string.isRequired
};

export default SocialShareButtons;
