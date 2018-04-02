// Vendor
import React from 'react';
import T from 'prop-types';
import classnames from 'classnames';

// Styles
import styles from './styles.module.scss';

import Banner from './Banner';
import Content from './Content';
import SEO from '../../SEO';

const CountryGuidePage = ({country}) => {
  const metaSEO = {
    description: country.excerpt,
    image: country.coverImage,
    path: country.path,
    title: country.title
  };
  return (
    <div>
      <SEO meta={metaSEO} />

      <Banner country={country} />

      <section className={classnames(styles.wrapper, styles['wrapper--content'])}>
        <Content className={styles.inner} country={country} />
      </section>
    </div>
  );
};

CountryGuidePage.propTypes = {
  country: T.shape({
    content: T.string.isRequired,
    coverImage: T.string.isRequired,
    excerpt: T.string.isRequired,
    path: T.string.isRequired,
    title: T.string.isRequired
  })
};

export default CountryGuidePage;
