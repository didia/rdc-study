// Vendor
import React from 'react';
import T from 'prop-types';
import classnames from 'classnames';

// Styles
import styles from './styles.module.scss';

import PageLayout from '../../PageLayout';
import Banner from './Banner';
import GuideList from '../../GuideList';
import ArticleList from '../../ArticleList';
import ScholarshipList from '../../ScholarshipList';
import Newsletter from '../../Newsletter';

const IndexPage = ({articles, countries, scholarships, hasMoreArticles}) => {
  return (
    <PageLayout headerWithTitle={true}>
      <Banner />

      <section>
        <section className={classnames(styles.wrapper, styles['wrapper--country-list'])}>
          <GuideList
            id="guides"
            className={styles.inner}
            guides={countries}
            titleKey="pages.index.country-list.title"
          />
        </section>

        <section className={classnames(styles.wrapper, styles['wrapper--article-list'])}>
          <ArticleList
            className={styles.inner}
            articles={articles}
            hasMoreArticles={hasMoreArticles}
            titleKey="pages.index.article-list.title"
          />
        </section>

        <section className={classnames(styles.wrapper, styles['wrapper--scholarship-list'])}>
          <Newsletter className={classnames(styles.inner, styles.newsletter)} />

          <ScholarshipList
            allScholarshipsLink="/bourses"
            showAllScholarshipsLink
            className={styles.inner}
            scholarships={scholarships}
            titleKey="pages.index.scholarship-list.title"
          />
        </section>
      </section>
    </PageLayout>
  );
};

IndexPage.propTypes = {
  articles: T.arrayOf(T.object).isRequired,
  countries: T.arrayOf(T.object).isRequired,
  scholarships: T.arrayOf(T.object).isRequired,
  hasMoreArticles: T.bool
};

export default IndexPage;
