// Vendor
import React from 'react';
import T from 'prop-types';
import classnames from 'classnames';
import {FormattedMessage} from 'react-intl';
import Img from 'gatsby-image';
import Link from 'gatsby-link';

// Styles
import styles from './styles.module.scss';
import PostMeta from '../PostMeta';

const Article = ({article}) => {
  return (
    <Link to={article.path} className={styles.article}>
      <article className={styles.article__inner}>
        <Img
          outerWrapperClassName={classnames(styles['image-wrapper'])}
          className={styles.image}
          sizes={article.thumbnail.sizes}
          alt={article.name}
        />

        <div>
          <h3 className={styles.article__title}>{article.title}</h3>
          <p className={styles.article__description}>{article.excerpt}</p>
          <div>
            <PostMeta post={article} className={styles.article__meta} />
          </div>
        </div>
      </article>
    </Link>
  );
};

Article.propTypes = {
  article: T.shape({
    excerpt: T.string.isRequired,
    path: T.string.isRequired,
    title: T.string.isRequired,
    thumbnail: T.shape({
      sizes: T.object
    }).isRequired
  })
};

const ArticleList = ({className, descriptionKey, articles, id, titleKey}) => {
  return (
    <div id={id} className={className}>
      <FormattedMessage id={titleKey}>{text => <h2 className="major">{text}</h2>}</FormattedMessage>

      {descriptionKey && <FormattedMessage id={descriptionKey}>{text => <p>{text}</p>}</FormattedMessage>}

      <section className={styles['articles-wrapper']}>
        {articles.map((article, i) => <Article key={i} article={article} />)}
      </section>
    </div>
  );
};

ArticleList.propTypes = {
  className: T.string,
  descriptionKey: T.string,
  articles: T.arrayOf(T.object),
  id: T.string,
  titleKey: T.string.isRequired
};

export default ArticleList;
