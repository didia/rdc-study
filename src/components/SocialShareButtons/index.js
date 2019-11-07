// Vendor
import React, {useEffect} from 'react';
import T from 'prop-types';
import {StickyShareButtons} from 'sharethis-reactjs';
import {injectIntl} from 'react-intl';

// Utils
import getCanonicalLink from '../../utils/get-canonical-link';
import {pushCurrentBranch} from '../../utils/push-analytics-event';

// Config
import config from '../../../config';

const {shareThisProperty} = config;

const SocialShareButtons = injectIntl(({intl, title, excerpt, path}) => {
  const link = `${getCanonicalLink(path)}?utm_source=rdcetudes.com&utm_medium=email&campaign=user_share`;
  const emailMessage = intl.formatMessage({id: 'shared.social-share.email.message'}, {excerpt, link});

  useEffect(() => {
    pushCurrentBranch();
  }, [path]);
  return (
    /* eslint-disable camelcase */
    <StickyShareButtons
      config={{
        property: shareThisProperty,
        alignment: 'left',
        color: 'social',
        enabled: true,
        labels: 'cta',
        language: 'fr',
        networks: ['whatsapp', 'facebook', 'twitter', 'email'],
        min_count: 0,
        show_mobile: true,
        show_toggle: false,
        show_total: true,
        message: emailMessage,
        subject: title,
        username: '@rdcetudes'
      }}
    />
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
