// Vendor
import React, {useEffect, useState} from 'react';
import T from 'prop-types';
import {StickyShareButtons} from 'sharethis-reactjs';
import {injectIntl} from 'react-intl';

// Utils
import getCanonicalLink from '../../utils/get-canonical-link';

// Config
import config from '../../../config';

const {shareThisProperty} = config;

const SOCIAL_SHARE_BUTTONS_DELAY = 2000;

const SocialShareButtons = injectIntl(({intl, title, excerpt, path}) => {
  const [showShareButtons, setShowShareButtons] = useState(Boolean(window.__sharethis__));

  useEffect(() => {
    // eslint-disable-next-line max-nested-callbacks
    const timeout = setTimeout(() => setShowShareButtons(true), SOCIAL_SHARE_BUTTONS_DELAY);
    return () => clearTimeout(timeout);
  }, []);

  const canonicalLink = getCanonicalLink(path);
  const link = `${canonicalLink}?utm_source=rdcetudes.com&utm_medium=email&campaign=user_share`;
  const emailMessage = intl.formatMessage({id: 'shared.social-share.email.message'}, {excerpt, link});

  return (
    /* eslint-disable camelcase */
    showShareButtons && (
      <StickyShareButtons
        config={{
          property: shareThisProperty,
          alignment: 'left',
          color: 'social',
          enabled: true,
          labels: 'cta',
          language: 'fr',
          networks: ['whatsapp', 'facebook', 'twitter', 'email'],
          min_count: 10,
          show_mobile: true,
          show_toggle: false,
          show_total: true,
          top: 200,
          message: emailMessage,
          subject: title,
          username: '@rdcetudes',
          url: canonicalLink
        }}
      />
    )
    /* eslint-enable camelcase */
  );
});

SocialShareButtons.propTypes = {
  excerpt: T.string.isRequired,
  path: T.string.isRequired,
  title: T.string.isRequired,
  intl: T.shape({
    formatMessage: T.func
  })
};

export default SocialShareButtons;
