// Vendor
import React from 'react';
import T from 'prop-types';
import {FormattedMessage} from 'react-intl';
import Img from 'gatsby-image';
import {Link} from 'gatsby';

// Styles
import styles from './styles.module.scss';

const GuideList = ({className, guides, id}) => (
  <div id={id} className={className}>
    <FormattedMessage id="pages.index.country-list.title">
      {(text) => <h2 className={styles.title}>{text}</h2>}
    </FormattedMessage>

    <div className={styles.grid}>
      {guides.map((guide) => (
        <Link
          key={`${guide.path}?utm_source=rdcetudes&utm_content=home-page`}
          to={guide.path}
          className={styles['grid-item']}
          aria-label={guide.name}
        >
          <article className={styles['grid-item-wrapper']}>
            <div className="image">
              <Img className={styles.image} fluid={guide.thumbnail.fluid} alt={guide.title} />
            </div>
            <h3 className={styles['grid-item-title']}>{guide.name}</h3>
          </article>
        </Link>
      ))}
    </div>
  </div>
);

GuideList.propTypes = {
  id: T.string,
  className: T.string,
  guides: T.arrayOf(
    T.shape({
      name: T.string.isRequired,
      path: T.string.isRequired
    })
  )
};

export default GuideList;
