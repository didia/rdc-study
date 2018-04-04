// Vendor
import React from 'react';
import classnames from 'classnames';
import T from 'prop-types';

// Styles
import styles from './styles.module.scss';

export default function ActivityIndicator({isActive}) {
  const modifierClassName = isActive ? 'activity-indicator--active' : null;
  return (
    <div className={classnames(styles['activity-indicator'], styles[modifierClassName])}>
      <div className={styles['decorator-bar']} />
    </div>
  );
}

ActivityIndicator.propTypes = {
  isActive: T.bool
};
