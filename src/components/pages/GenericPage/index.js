// Vendor
import React from 'react';
import T from 'prop-types';
import classnames from 'classnames';

// Styles
import styles from './styles.module.scss';

import PageLayout from '../../PageLayout';
import Banner from './Banner';
import SEO from '../../SEO';

const GenericPage = ({children, bannerClassName, footerClassName, page, pageWrapperClassName}) => {
  return (
    <PageLayout pageWrapperClassName={pageWrapperClassName} footerClassName={footerClassName}>
      <SEO key="seo" meta={page} />
      <Banner key="banner" page={page} className={bannerClassName} />
      <section key="content" className={classnames(styles.wrapper, styles['wrapper--content'])}>
        <div className={styles.inner}>{children}</div>
      </section>
    </PageLayout>
  );
};

GenericPage.propTypes = {
  bannerClassName: T.string,
  children: T.oneOfType([T.arrayOf(T.element), T.element]).isRequired,
  footerClassName: T.string,
  pageWrapperClassName: T.string,
  page: T.shape({
    description: T.string.isRequired,
    facebookShareButtonLabelKey: T.string,
    image: T.object,
    path: T.string.isRequired,
    title: T.string.isRequired,
  }),
};

export default GenericPage;
