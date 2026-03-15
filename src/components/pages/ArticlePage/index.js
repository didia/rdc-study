// Vendor
import React from 'react';
import classnames from 'classnames';
import Image from 'next/image';

// Styles
import styles from './styles.module.scss';

// From styles.cover__image-wrapper: max-height 400px, width 100%
const COVER_IMAGE_WIDTH = 800;
const COVER_IMAGE_HEIGHT = 400;

// Components
import PageLayout from '../../PageLayout';
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
      <section key="content" className={classnames(styles.wrapper, styles['wrapper--content'])}>
        <div className={styles.inner}>
          <div className={styles.cover}>
            <div className={styles['cover__image-wrapper']}>
              <Image
                src={article.thumbnail}
                alt={article.title}
                width={COVER_IMAGE_WIDTH}
                height={COVER_IMAGE_HEIGHT}
                className={styles.coverImage}
                style={{objectFit: 'cover', width: '100%', height: 'auto'}}
              />
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

export default ArticlePage;
