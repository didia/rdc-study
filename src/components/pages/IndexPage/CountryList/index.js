// Vendor
import React from 'react';
import T from 'prop-types';
import classnames from 'classnames';
import {FormattedMessage} from 'react-intl';
import Img from 'gatsby-image';
import Link from 'gatsby-link';

// Styles
import styles from './styles.module.scss';

const Country = ({country}) => {
  return (
    <Link to={country.path} className={styles.article}>
      <article>
        <div className={classnames(styles['image-wrapper'], 'image')}>
          <Img className={styles.image} sizes={country.thumbnail.sizes} alt={country.name} />
        </div>
        <h3 className="major">{country.title}</h3>
        <p>{country.excerpt}</p>
        <FormattedMessage id="pages.index.country-list.learn-more-text">
          {text => <span className="special">{text}</span>}
        </FormattedMessage>
      </article>
    </Link>
  );
};

Country.propTypes = {
  country: T.shape({
    excerpt: T.string.isRequired,
    path: T.string.isRequired,
    title: T.string.isRequired,
    thumbnail: T.shape({
      sizes: T.object
    }).isRequired
  })
};

const CountryList = ({className, countries}) => {
  return (
    <div id="guides" className={className}>
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
