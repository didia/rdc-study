'use client';

// Vendor
import React from 'react';
import T from 'prop-types';
import {injectIntl} from 'react-intl';
import classnames from 'classnames';

// Styles
import styles from './styles.module.scss';

const ScholarshipCountries = injectIntl(({className, countries, tag, intl}) => {
  const Tag = tag || 'div';

  const safeCountries = Array.isArray(countries) ? countries : [];
  const levelsText = safeCountries.map((level) => intl.formatMessage({id: `shared.countries.${level}`})).join(', ');

  return (
    <Tag className={className}>
      <span className={classnames('fas fa-globe-africa', styles.text)}>{levelsText}</span>
    </Tag>
  );
});

ScholarshipCountries.propTypes = {
  className: T.string,
  tag: T.elementType,
  countries: T.arrayOf(T.string.isRequired),
  intl: T.shape({
    formatMessage: T.func,
  }),
};

export default ScholarshipCountries;
