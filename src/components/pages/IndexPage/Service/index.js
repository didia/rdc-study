// Vendor
import React from 'react';
import T from 'prop-types';
import classnames from 'classnames';
import {FormattedMessage} from 'react-intl';
import Link from 'gatsby-link';
import Img from 'gatsby-image';

// Styles
import styles from './styles.module.scss';

const Service = ({service, modifier}) => {
  const modifierClass = modifier ? `service--${modifier}` : null;

  return (
    <section className={classnames(styles.service, styles[modifierClass])}>
      <div className={styles.wrapper}>
        {service.image && (
          <a href="#" className={classnames(styles['image-wrapper'], 'image')}>
            <Img className={styles.image} sizes={service.image.sizes} />
          </a>
        )}

        <div className={styles.content}>
          <FormattedMessage id={service.titleKey}>{text => <h2 className="major">{text}</h2>}</FormattedMessage>

          <FormattedMessage id={service.descriptionTextKey}>{text => <p>{text}</p>}</FormattedMessage>

          <FormattedMessage id={service.detailsLink.labelKey}>
            {text =>
              service.detailsLink.isAnchor ? (
                <a href={service.detailsLink.link} className="special">
                  {text}
                </a>
              ) : (
                <Link to={service.detailsLink.link} className="special">
                  {text}
                </Link>
              )
            }
          </FormattedMessage>
        </div>
      </div>
    </section>
  );
};

Service.propTypes = {
  modifier: T.string,
  service: T.shape({
    descriptionTextKey: T.string.isRequired,
    image: T.shape({
      sizes: T.object
    }).isRequired,
    titleKey: T.string.isRequired,
    detailsLink: T.shape({
      isAnchor: T.bool.isRequired,
      labelKey: T.string.isRequired,
      link: T.string.isRequired
    }).isRequired
  })
};

export default Service;
