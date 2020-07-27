// Vendor
import React from 'react';
import T from 'prop-types';
import classnames from 'classnames';
import {FormattedMessage} from 'react-intl';
import Img from 'gatsby-image';
import {Link} from 'gatsby';

// Styles
import styles from './styles.module.scss';
import PostMeta from '../PostMeta';

const Article = ({article}) => {
  return (
    <Link to={article.path} className={styles.article}>
      <article className={styles.article__inner}>
        <div className={classnames(styles['image-wrapper'])}>
          <Img className={styles.image} fluid={article.thumbnail.fluid} alt={article.title} />
        </div>

        <div className={styles.content}>
          <h3 className={styles.article__title}>{article.title}</h3>
          <div className={styles['article__meta-wrapper']}>
            <PostMeta post={article} className={styles.article__meta} />
          </div>
          <p className={styles.article__description}>{article.excerpt}</p>
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
      fluid: T.object.isRequired,
      sizes: T.object
    }).isRequired
  })
};

const ArticleList = ({className, descriptionKey, articles, hasMoreArticles, id, titleKey}) => {
  return (
    <div id={id} className={className}>
      {titleKey && <FormattedMessage id={titleKey}>{(text) => <h2 className="major">{text}</h2>}</FormattedMessage>}

      {descriptionKey && <FormattedMessage id={descriptionKey}>{(text) => <p>{text}</p>}</FormattedMessage>}

      <ul className={styles['articles-wrapper']}>
        {articles.map((article, i) => (
          <li key={i}>
            <Article key={i} article={article} />
          </li>
        ))}
      </ul>

      {hasMoreArticles && (
        <FormattedMessage id="shared.see-more-text">
          {(text) => (
            <div className={styles['see-more-button-wrapper']}>
              <Link to="/articles" className={classnames('button', styles['see-more-button'])}>
                {text}
              </Link>
            </div>
          )}
        </FormattedMessage>
      )}
    </div>
  );
};

ArticleList.propTypes = {
  articles: T.arrayOf(
    T.shape({
      thumbnal: T.shape({
        fluid: T.object
      })
    })
  ),
  className: T.string,
  descriptionKey: T.string,
  hasMoreArticles: T.bool,
  id: T.string,
  titleKey: T.string
};

export default ArticleList;
