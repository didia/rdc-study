// Vendor
import React, {useEffect} from 'react';
import T from 'prop-types';
import {InlineShareButtons} from 'sharethis-reactjs';
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
    <InlineShareButtons
      config={{
        property: shareThisProperty,
        alignment: 'right',
        color: 'social',
        enabled: true,
        labels: 'cta',
        language: 'fr',
        networks: ['whatsapp', 'facebook', 'twitter', 'email'],
        // eslint-disable-next-line camelcase
        min_count: 10,
        // eslint-disable-next-line camelcase
        show_total: true,
        // OPTIONAL PARAMETERS
        message: emailMessage, // (only for email sharing)
        subject: title, // (only for email sharing)
        username: '@rdcetudes' // (only for twitter sharing)
      }}
    />
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
