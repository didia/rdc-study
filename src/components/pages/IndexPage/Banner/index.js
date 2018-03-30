// Vendor
import React from 'react';
import {FormattedMessage} from 'react-intl';
import classnames from 'classnames';

// Styles
import styles from './styles.module.scss';

const Banner = () => (
  <section className={styles.banner}>
    <div className={styles.wrapper}>
      <div className={styles.logo}>
        <span className={classnames(styles.logo__icon, 'icon', 'fa-diamond')} />
      </div>

      <FormattedMessage id="pages.index.banner.title">
        {text => <h2 className={styles.title}>{text}</h2>}
      </FormattedMessage>

      <FormattedMessage id="pages.index.banner.description">
        {text => <p className={styles.description}>{text}</p>}
      </FormattedMessage>
    </div>
  </section>
);

export default Banner;
