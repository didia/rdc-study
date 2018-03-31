// Vendor
import React from 'react';
import T from 'prop-types';

// Styles
import styles from './styles.module.scss';

const Banner = ({country}) => (
  <section>
    <header className={styles.banner}>
      <div className={styles.wrapper}>
        <h2 className={styles.title}>{country.title}</h2>
        <p className={styles.description}>{country.excerpt}</p>
      </div>
    </header>
  </section>
);

Banner.propTypes = {
  country: T.shape({
    excerpt: T.string.isRequired,
    title: T.string.isRequired
  })
};

export default Banner;
