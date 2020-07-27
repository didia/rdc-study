// Vendor
import React from 'react';
import T from 'prop-types';
import classnames from 'classnames';

// Styles
import styles from './styles.module.scss';

// Components
import SocialShareButtons from '../../../SocialShareButtons';

const Banner = ({className, page}) => (
  <header className={classnames(styles.banner, className)}>
    <div className={styles.wrapper}>
      <h2 className={styles.title}>{page.title}</h2>
      <p className={styles.description}>{page.description}</p>
      {page.socialShareEnabled && (
        <div className={styles.social}>
          <SocialShareButtons path={page.path} title={page.title} excerpt={page.description} />
        </div>
      )}
    </div>
  </header>
);

Banner.propTypes = {
  className: T.string,
  page: T.shape({
    description: T.string.isRequired,
    socialShareEnabled: T.boolean,
    title: T.string.isRequired,
    path: T.string.isRequired
  })
};

export default Banner;
