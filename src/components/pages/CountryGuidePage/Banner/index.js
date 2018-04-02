// Vendor
import React from 'react';
import T from 'prop-types';
import {FormattedMessage} from 'react-intl';

// Styles
import styles from './styles.module.scss';

// Components
import FacebookShareButton from '../../../../components/FacebookShareButton';

const Banner = ({country}) => (
  <section>
    <header className={styles.banner}>
      <div className={styles.wrapper}>
        <h2 className={styles.title}>{country.title}</h2>
        <p className={styles.description}>{country.excerpt}</p>
        <div className={styles.social}>
          <FormattedMessage id="pages.guides-show.banner.facebook-share-button-label">
            {text => <FacebookShareButton label={text} path={country.path} />}
          </FormattedMessage>
        </div>
      </div>
    </header>
  </section>
);

Banner.propTypes = {
  country: T.shape({
    excerpt: T.string.isRequired,
    path: T.string.isRequired,
    title: T.string.isRequired
  })
};

export default Banner;
