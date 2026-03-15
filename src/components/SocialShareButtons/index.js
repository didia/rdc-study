'use client';

// Vendor
import React from 'react';
import T from 'prop-types';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  EmailIcon
} from 'react-share';

// Config
import config from '../../../config';

// Styles
import styles from './styles.module.scss';

const ICON_SIZE = 40;

const SocialShareButtons = ({path, title, excerpt}) => {
  const url = `${config.siteURL}${path}`;

  return (
    <div className={styles.wrapper}>
      <WhatsappShareButton url={url} title={title}>
        <WhatsappIcon size={ICON_SIZE} round />
      </WhatsappShareButton>

      <FacebookShareButton url={url} quote={excerpt}>
        <FacebookIcon size={ICON_SIZE} round />
      </FacebookShareButton>

      <TwitterShareButton url={url} title={title} via="rdcetudes">
        <TwitterIcon size={ICON_SIZE} round />
      </TwitterShareButton>

      <EmailShareButton url={url} subject={title} body={excerpt}>
        <EmailIcon size={ICON_SIZE} round />
      </EmailShareButton>
    </div>
  );
};

SocialShareButtons.propTypes = {
  excerpt: T.string.isRequired,
  path: T.string.isRequired,
  title: T.string.isRequired
};

export default SocialShareButtons;
