// Vendor
import React from 'react';
import T from 'prop-types';
import classnames from 'classnames';
import Img from 'gatsby-image';

// Styles
import styles from './styles.module.scss';

import PageLayout from '../../../layouts/PageLayout';
import SEO from '../../SEO';
import ArticleList from '../../ArticleList';
import PostMeta from '../../PostMeta';
import SocialShareButtons from '../../SocialShareButtons';

const ArticlePage = ({article, otherArticles}) => {
  const page = {
    description: article.excerpt,
    image: article.coverImage,
    keywords: article.tags,
    path: article.path,
    title: article.title
  };

  return (
    <PageLayout>
      <SEO key="seo" meta={page} />
      <section key="content" className={classnames(styles.wrapper, styles['wrapper--content'])}>
        <div className={styles.inner}>
          <div className={styles.cover}>
            <div className={styles['cover__image-wrapper']}>
              <Img className={styles.image} sizes={article.thumbnail.sizes} alt={article.title} />
            </div>

            <div>
              <h1 className={styles.cover__title}>{article.title}</h1>
              <p className={styles.cover__description}>{article.excerpt}</p>
            </div>

            <div>
              <PostMeta post={article} />
            </div>
          </div>

          <div dangerouslySetInnerHTML={{__html: article.content}} />

          <SocialShareButtons path={article.path} />

          {otherArticles &&
            otherArticles.length > 0 && (
              <ArticleList articles={otherArticles} titleKey="pages.articles-show.other-articles.title" />
            )}
        </div>
      </section>
    </PageLayout>
  );
};

ArticlePage.propTypes = {
  article: T.shape({
    content: T.string.isRequired,
    coverImage: T.string.isRequired,
    date: T.string.isRequired,
    excerpt: T.string.isRequired,
    path: T.string.isRequired,
    tags: T.arrayOf(T.string),
    timeToRead: T.number.isRequired,
    title: T.string.isRequired
  }).isRequired,
  otherArticles: T.arrayOf(T.object)
};

export default ArticlePage;
