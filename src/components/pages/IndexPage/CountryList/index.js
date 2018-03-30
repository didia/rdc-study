// Vendor
import React from 'react';
import T from 'prop-types';
import classnames from 'classnames';
import {FormattedMessage} from 'react-intl';
import Img from 'gatsby-image';

// Styles
import styles from './styles.module.scss';

const Country = ({country}) => {
  return (
    <article className={styles.article}>
      <a href="#" className={classnames(styles['image-wrapper'], 'image')}>
        <Img className={styles.image} sizes={country.image.sizes} alt={country.name} />
      </a>
      <h3 className="major">{country.name}</h3>
      <p>{country.description}</p>
      <FormattedMessage id="pages.index.country-list.learn-more-text">
        {text => (
          <a href="#" className="special">
            {text}
          </a>
        )}
      </FormattedMessage>
    </article>
  );
};

Country.propTypes = {
  country: T.shape({
    description: T.string.isRequired,
    name: T.string.isRequired,
    image: T.shape({
      sizes: T.object
    }).isRequired
  })
};

const CountryList = ({className, countries}) => {
  return (
    <div className={className}>
      <FormattedMessage id="pages.index.country-list.title">
        {text => <h2 className="major">{text}</h2>}
      </FormattedMessage>

      <FormattedMessage id="pages.index.country-list.description">{text => <p>{text}</p>}</FormattedMessage>

      <section className={styles['guides-wrapper']}>
        {countries.map((country, i) => <Country key={i} country={country} />)}
      </section>
    </div>
  );
};

CountryList.propTypes = {
  className: T.string,
  countries: T.arrayOf(T.object)
};

export default CountryList;
