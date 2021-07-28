// Vendor
import React, {FunctionComponent} from 'react';
import {FormattedMessage} from 'react-intl';
import {Link} from 'gatsby';
import {StaticImage} from 'gatsby-plugin-image';

// Styles
import styles from './styles.module.scss';

const Banner: FunctionComponent = () => {
  return (
    <section className={styles.banner}>
      <div className={styles.wrapper}>
        <div className={styles.logo}>
          <div className={styles.logo__icon}>
            <StaticImage
              src="../static/logo.png"
              placeholder="blurred"
              layout="fixed"
              width={60}
              height={56}
              alt="RDC Etudes Logo"
            />
          </div>
        </div>

        <FormattedMessage id="pages.index.banner.title">
          {(text) => <h2 className={styles.title}>{text}</h2>}
        </FormattedMessage>

        <FormattedMessage id="pages.index.banner.description">
          {(text) => <p className={styles.description}>{text}</p>}
        </FormattedMessage>

        <div className={styles['call-to-action-wrapper']}>
          <FormattedMessage id="pages.index.banner.call-to-action-button-text">
            {(text) => (
              <Link to="/accompagnement" className="button special call-to-action">
                {text}
              </Link>
            )}
          </FormattedMessage>
        </div>
      </div>
    </section>
  );
};

export default Banner;
