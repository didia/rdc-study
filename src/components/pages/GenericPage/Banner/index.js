// Vendor
import React from 'react';
import T from 'prop-types';
import {FormattedMessage} from 'react-intl';

// Styles
import styles from './styles.module.scss';

// Components
import FacebookShareButton from '../../../../components/FacebookShareButton';

const Banner = ({page}) => (
  <section>
    <header className={styles.banner}>
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
  </section>
);

Banner.propTypes = {
  page: T.shape({
    description: T.string.isRequired,
    facebookShareButtonLabelKey: T.string,
    title: T.string.isRequired,
    path: T.string.isRequireds
  })
};

export default Banner;
