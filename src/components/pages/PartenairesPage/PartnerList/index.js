import React from 'react';
import T from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Img from 'gatsby-image';
import { Link } from 'gatsby';

// Styles
import styles from './styles.module.scss';

const PartnerList = ({ className, partners, id }) => {
  return (
    <div id={id} className={styles['items-wrapper']}>
      <div className={styles['grid']} >
        {partners.map((partner) => (
          <Link
            key={`${partner.labelKey}`}
            to={partner.to}
            className={styles['grid-item']}
            aria-label={partner.name}
          >
            <article className={styles['grid-item-wrapper']}>
              <div className={styles['image-wrapper']}>
                <Img className={styles.image} fluid={partner.thumbnail.childImageSharp.fluid} alt={partner.name} />
              </div>
              <p>{partner.name}</p>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}

PartnerList.propTypes = {
  id: T.string,
  className: T.string,
  partners: T.arrayOf(
    T.shape({
      thumbnail: T.object.isRequired,
      labelKey: T.string.isRequired,
      to: T.string.isRequired,
      name: T.string.isRequired
    })
  )
};

export default PartnerList;