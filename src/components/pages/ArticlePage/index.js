// Vendor
import React from 'react';
import T from 'prop-types';
import classnames from 'classnames';
import Img from 'gatsby-image';

// Styles
import styles from './styles.module.scss';

// Components
import PageLayout from '../../PageLayout';
import SEO from '../../SEO';
import ArticleList from '../../ArticleList';
import PostMeta from '../../PostMeta';
import SocialShareButtons from '../../SocialShareButtons';
import HtmlContent from '../../HtmlContent';

const ArticlePage = ({article, hasMoreArticles, otherArticles}) => {
  const page = {
    description: article.excerpt,
    image: article.metaImage,
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
              <Img fluid={article.thumbnail.fluid} alt={article.title} />
            </div>

            {article.thumbnailCredits && (
              <div
                className={styles['thumbnail-credit']}
                dangerouslySetInnerHTML={{__html: article.thumbnailCredits}}
              />
            )}

            <div className={styles['cover__title-excerpt-wrapper']}>
              <h1 className={styles.cover__title}>{article.title}</h1>
              <p className={styles.cover__description}>{article.excerpt}</p>
              <PostMeta post={article} />
            </div>

            <SocialShareButtons path={article.path} title={article.title} excerpt={article.excerpt} />
          </div>

          <HtmlContent content={article.content} />

          {otherArticles && otherArticles.length > 0 && (
            <ArticleList
              articles={otherArticles}
              hasMoreArticles={hasMoreArticles}
              titleKey="pages.articles-show.other-articles.title"
            />
          )}
        </div>
      </section>
    </PageLayout>
  );
};

ArticlePage.propTypes = {
  article: T.shape({
    content: T.string.isRequired,
    metaImage: T.object.isRequired,
    date: T.string.isRequired,
    excerpt: T.string.isRequired,
    path: T.string.isRequired,
    tags: T.arrayOf(T.string),
    thumbnail: T.object.isRequired,
    thumbnailCredits: T.string,
    timeToRead: T.number.isRequired,
    title: T.string.isRequired
  }).isRequired,
  hasMoreArticles: T.bool,
  otherArticles: T.arrayOf(T.object)
};

export default ArticlePage;
