// Vendor
import React from 'react';
import T from 'prop-types';
import classnames from 'classnames';

// Styles
import styles from './styles.module.scss';

import Banner from './Banner';
import SEO from '../../SEO';

const GenericPage = ({children, page}) => {
  return [
    <SEO key="seo" meta={page} />,
    <Banner key="banner" page={page} />,
    <section key="content" className={classnames(styles.wrapper, styles['wrapper--content'])}>
      <div className={styles.inner}>{children}</div>
    </section>
  ];
};

GenericPage.propTypes = {
  children: T.oneOfType([T.arrayOf(T.element), T.element]).isRequired,
  page: T.shape({
    description: T.string.isRequired,
    facebookShareButtonLabelKey: T.string,
    image: T.string,
    path: T.string.isRequired,
    title: T.string.isRequired
  })
};

export default GenericPage;
