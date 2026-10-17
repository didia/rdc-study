'use client';

// Vendor
import React from 'react';
import T from 'prop-types';
import {useIntl} from 'react-intl';
import classnames from 'classnames';

// Styles
import styles from './styles.module.scss';

// constants
const LEVEL_ORDERS = ['undergraduate', 'graduate', 'postgraduate', 'research', 'internship'];

const ScholarshipLevels = ({className, levels, tag}) => {
  const intl = useIntl();
  const Tag = tag || 'div';
  const safeLevels = Array.isArray(levels) ? levels : [];

  const levelsText = safeLevels
    .sort((level1, level2) => LEVEL_ORDERS.indexOf(level1) - LEVEL_ORDERS.indexOf(level2))
    .map((level) => intl.formatMessage({id: `scholarship-levels.${level}`}))
    .join(', ');

  return (
    <Tag className={className}>
      <span className="fas fa-graduation-cap">
        <span className={styles.text}> {levelsText}</span>
      </span>
    </Tag>
  );
};

ScholarshipLevels.propTypes = {
  className: T.string,
  tag: T.elementType,
  levels: T.arrayOf(T.string.isRequired)
};

export default ScholarshipLevels;
