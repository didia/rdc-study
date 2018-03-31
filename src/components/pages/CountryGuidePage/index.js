// Vendor
import React from 'react';
import T from 'prop-types';
import classnames from 'classnames';

// Styles
import styles from './styles.module.scss';

import Banner from './Banner';
import Content from './Content';

const CountryGuidePage = ({country}) => {
  return (
    <div>
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
    excerpt: T.string.isRequired,
    title: T.string.isRequired
  })
};

export default CountryGuidePage;
