// Vendor
import React from 'react';
import T from 'prop-types';
import {FormattedMessage} from 'react-intl';

const SUPPORTED_COUNTRIES = [
  'shared.countries.be',
  'shared.countries.bf',
  'shared.countries.bj',
  'shared.countries.br',
  'shared.countries.ca',
  'shared.countries.cd',
  'shared.countries.cg',
  'shared.countries.ch',
  'shared.countries.ci',
  'shared.countries.cn',
  'shared.countries.de',
  'shared.countries.fr',
  'shared.countries.ga',
  'shared.countries.gb',
  'shared.countries.gh',
  'shared.countries.gn',
  'shared.countries.ht',
  'shared.countries.in',
  'shared.countries.jp',
  'shared.countries.ml',
  'shared.countries.ne',
  'shared.countries.ro',
  'shared.countries.ru',
  'shared.countries.rw',
  'shared.countries.sa',
  'shared.countries.sn',
  'shared.countries.tg',
  'shared.countries.tr',
  'shared.countries.us',
];

const CountrySelector = ({className, ...props}) => (
  <select className={className} name={name ? name : 'country'} {...props}>
    <FormattedMessage id="shared.country-selector.placeholder">
      {(placeholder) => (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
    </FormattedMessage>

    {SUPPORTED_COUNTRIES.map((code) => (
      <FormattedMessage id={code} key={code}>
        {(countryName) => (
          <option key={code} value={countryName}>
            {countryName}
          </option>
        )}
      </FormattedMessage>
    ))}
    <FormattedMessage id="shared.other-text">{(text) => <option key={text}>{text}</option>}</FormattedMessage>
  </select>
);

CountrySelector.propTypes = {
  className: T.string,
  name: T.string,
  value: T.string,
  onChange: T.func.isRequired,
};

export default CountrySelector;
