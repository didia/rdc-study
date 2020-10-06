// Vendor
import React from 'react';
import T from 'prop-types';
import classnames from 'classnames';

// Styles
import styles from './styles.module.scss';

import PageLayout from '../../PageLayout';
import Banner from './Banner';
import GuideList from './GuideList';
import ArticleList from '../../ArticleList';
import ScholarshipList from '../../ScholarshipList';
import Newsletter from '../../Newsletter';
import CompetitiveAdvantages from './CompetitiveAdvantages';

const IndexPage = ({articles, countries, scholarships, hasMoreArticles}) => {
  return (
    <PageLayout headerWithTitle={true}>
      <Banner />

      <section>
        <section className={classnames(styles.wrapper, styles['wrapper--at-position-1'])}>
          <GuideList id="guides" className={styles.inner} guides={countries} />
        </section>

        <section className={classnames(styles.wrapper, styles['wrapper--at-position-2'])}>
          <CompetitiveAdvantages className={styles.inner} />
        </section>

        <section className={classnames(styles.wrapper, styles['wrapper--at-position-3'])}>
          <Newsletter className={classnames(styles.inner, styles.newsletter)} />
        </section>

        <section className={classnames(styles.wrapper, styles['wrapper--at-position-4'])}>
          <ArticleList
            className={styles.inner}
            articles={articles}
            hasMoreArticles={hasMoreArticles}
            titleKey="pages.index.article-list.title"
          />
        </section>

        <section className={classnames(styles.wrapper, styles['wrapper--at-position-5'])}>
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
