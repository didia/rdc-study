// Vendor
import React from 'react';
import T from 'prop-types';

// Config
import config from '../../../config';

// Constants
const FACEBOOK_URL = 'https://www.facebook.com/sharer/sharer.php';

const FacebookShareButton = ({label, path}) => {
  const url = `${config.siteURL}${path}`;
  return (
    <a href={`${FACEBOOK_URL}?u=${url}`} target="_blank">
      {label}
    </a>
  );
};

FacebookShareButton.propTypes = {
  label: T.string.isRequired,
  path: T.string.isRequired
};

export default FacebookShareButton;
