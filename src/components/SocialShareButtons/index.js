'use client';

// Vendor
import React from 'react';
import T from 'prop-types';
import {
  FacebookShareButton,
  XShareButton,
  WhatsappShareButton,
  EmailShareButton,
  FacebookIcon,
  XIcon,
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
      <WhatsappShareButton url={url} message={title} aria-label="Partager sur WhatsApp">
        <WhatsappIcon size={ICON_SIZE} round />
      </WhatsappShareButton>

      <FacebookShareButton url={url} aria-label="Partager sur Facebook">
        <FacebookIcon size={ICON_SIZE} round />
      </FacebookShareButton>

      <XShareButton url={url} text={title} via="rdcetudes" aria-label="Partager sur X">
        <XIcon size={ICON_SIZE} round />
      </XShareButton>

      <EmailShareButton url={url} subject={title} body={excerpt} aria-label="Partager par courriel">
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
