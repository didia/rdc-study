// Vendor
import React from 'react';
import T from 'prop-types';
import {FormattedMessage} from 'react-intl';

const CountrySelector = ({className, countryOptions, ...props}) => (
  <select className={className} name={name ? name : 'country'} {...props}>
    <FormattedMessage id="shared.country-selector.placeholder">
      {(placeholder) => (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
    </FormattedMessage>

    {countryOptions.map((option) => (
      <FormattedMessage id={option.labelKey} key={option.labelKey}>
        {(countryName) => (
          <option key={option.labelKey} value={option.value || countryName}>
            {countryName}
          </option>
        )}
      </FormattedMessage>
    ))}
  </select>
);

CountrySelector.propTypes = {
  className: T.string,
  name: T.string,
  value: T.string,
  onChange: T.func.isRequired,
  countryOptions: T.arrayOf(
    T.shape({
      labelKey: T.string.isRequired,
      value: T.string,
    }).isRequired
  ).isRequired,
};

export default CountrySelector;
