// Vendor
import React from 'react';
import T from 'prop-types';
import {FormattedMessage} from 'react-intl';

const Selector = ({className, name, options, placeholderKey, ...props}) => (
  <select className={className} name={name} {...props}>
    {placeholderKey && (
      <FormattedMessage id={placeholderKey}>
        {(placeholder) => (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
      </FormattedMessage>
    )}

    {options.map((option) => (
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

Selector.propTypes = {
  className: T.string,
  name: T.string.isRequired,
  value: T.string,
  onChange: T.func.isRequired,
  placeholderKey: T.string,
  options: T.arrayOf(
    T.shape({
      labelKey: T.string.isRequired,
      value: T.string
    }).isRequired
  ).isRequired
};

export default Selector;
