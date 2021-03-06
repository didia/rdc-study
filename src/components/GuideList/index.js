// Vendor
import React from 'react';
import T from 'prop-types';
import classnames from 'classnames';
import {FormattedMessage} from 'react-intl';
import Img from 'gatsby-image';
import {Link} from 'gatsby';

// Styles
import styles from './styles.module.scss';

const Guide = ({guide}) => {
  return (
    <Link to={guide.path} className={styles.article}>
      <article>
        <div className={classnames(styles['image-wrapper'], 'image')}>
          <Img className={styles.image} fluid={guide.thumbnail.fluid} alt={guide.title} />
        </div>
        <h3 className="major">{guide.title}</h3>
        <p>{guide.excerpt}</p>
      </article>
      <div className={styles['call-to-action-wrapper']}>
        <FormattedMessage id="guide-list.guide.learn-more-text">
          {(text) => <button className="button special call-to-action">{text}</button>}
        </FormattedMessage>
      </div>
    </Link>
  );
};

Guide.propTypes = {
  guide: T.shape({
    excerpt: T.string.isRequired,
    path: T.string.isRequired,
    title: T.string.isRequired,
    thumbnail: T.shape({
      fluid: T.object,
    }).isRequired,
  }),
};

const GuideList = ({className, descriptionKey, guides, id, titleKey}) => {
  return (
    <div id={id} className={className}>
      {titleKey && <FormattedMessage id={titleKey}>{(text) => <h2 className="major">{text}</h2>}</FormattedMessage>}

      {descriptionKey && <FormattedMessage id={descriptionKey}>{(text) => <p>{text}</p>}</FormattedMessage>}

      <section className={styles['guides-wrapper']}>
        {guides.map((guide, i) => (
          <Guide key={i} guide={guide} />
        ))}
      </section>
    </div>
  );
};

GuideList.propTypes = {
  className: T.string,
  descriptionKey: T.string,
  guides: T.arrayOf(T.object),
  id: T.string,
  titleKey: T.string,
};

export default GuideList;
