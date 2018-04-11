// Vendor
import React from 'react';
import T from 'prop-types';
import {FormattedMessage} from 'react-intl';
import classnames from 'classnames';

// Styles
import styles from './styles.module.scss';

// Components
import FacebookShareButton from '../../../../components/FacebookShareButton';

const Banner = ({className, page}) => (
  <header className={classnames(styles.banner, className)}>
    <div className={styles.wrapper}>
      <h2 className={styles.title}>{page.title}</h2>
      <p className={styles.description}>{page.description}</p>
      {Boolean(page.facebookShareButtonLabelKey) && (
        <div className={styles.social}>
          <FormattedMessage id={page.facebookShareButtonLabelKey}>
            {text => <FacebookShareButton label={text} path={page.path} />}
          </FormattedMessage>
        </div>
      )}
    </div>
  </header>
);

Banner.propTypes = {
  className: T.string,
  page: T.shape({
    description: T.string.isRequired,
    facebookShareButtonLabelKey: T.string,
    title: T.string.isRequired,
    path: T.string.isRequireds
  })
};

export default Banner;
