'use client';

import React from 'react';
import classnames from 'classnames';

import styles from './styles.module.scss';

import PageLayout from '../../PageLayout';
import Banner from './Banner';

const GenericPage = ({children, bannerClassName, footerClassName, page, pageWrapperClassName}) => {
  return (
    <PageLayout pageWrapperClassName={pageWrapperClassName} footerClassName={footerClassName}>
      <Banner key="banner" page={page} className={bannerClassName} />
      <section key="content" className={classnames(styles.wrapper, styles['wrapper--content'])}>
        <div className={styles.inner}>{children}</div>
      </section>
    </PageLayout>
  );
};

export default GenericPage;
