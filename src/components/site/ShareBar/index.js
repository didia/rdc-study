'use client';

import React from 'react';
import {useIntl} from 'react-intl';

import styles from './styles.module.scss';
import SocialShareButtons from '../../SocialShareButtons';

const ShareBar = ({path, title, excerpt}) => {
  const intl = useIntl();

  return (
    <div className={styles.share}>
      <span>{intl.formatMessage({id: 'site.share.label'})}</span>
      <SocialShareButtons path={path} title={title} excerpt={excerpt} />
    </div>
  );
};

export default ShareBar;
