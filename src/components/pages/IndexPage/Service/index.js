// Vendor
import React from 'react';
import T from 'prop-types';
import classnames from 'classnames';
import {FormattedMessage} from 'react-intl';
import Link from 'gatsby-link';
import Img from 'gatsby-image';

// Styles
import styles from './styles.module.scss';

// Utils
import analyticsPushEvent from '../../../../utils/push-analytics-event';

const Service = ({service, className, imageWrapperClassName}) => {
  return (
    <div className={className}>
      {service.image && (
        <a className={classnames(imageWrapperClassName, 'image')}>
          <Img className={styles.image} sizes={service.image.sizes} />
        </a>
      )}

      <div className={styles.content}>
        <FormattedMessage id={service.titleKey}>{text => <h2 className="major">{text}</h2>}</FormattedMessage>

        <FormattedMessage id={service.descriptionTextKey}>{text => <p>{text}</p>}</FormattedMessage>

        <FormattedMessage id={service.detailsLink.labelKey}>
          {text =>
            service.detailsLink.isAnchor ? (
              <a
                onClick={() => analyticsPushEvent(service.trackingData)}
                href={service.detailsLink.link}
                className="special"
              >
                {text}
              </a>
            ) : (
              <Link
                onClick={() => analyticsPushEvent(service.trackingData)}
                to={service.detailsLink.link}
                className="special"
              >
                {text}
              </Link>
            )
          }
        </FormattedMessage>
      </div>
    </div>
  );
};

Service.propTypes = {
  imageWrapperClassName: T.string,
  className: T.string,
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
    }).isRequired,
    trackingData: T.shape({
      category: T.string.isRequired,
      action: T.string.isRequired,
      label: T.string.isRequired
    }).isRequired
  })
};

export default Service;
