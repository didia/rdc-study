'use client';

// Vendor
import React from 'react';
import Image from 'next/image';
import {FormattedMessage} from 'react-intl';
import Link from 'next/link';

// Styles
import styles from './styles.module.scss';

const Banner = () => {
  return (
    <section className={styles.banner}>
      <div className={styles.wrapper}>
        <div className={styles.logo}>
          <div className={styles.logo__icon}>
            <Image src="/logo.png" width={60} height={60} alt="RDC Etudes Logo" priority />
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
              <Link href="/accompagnement" className="button special call-to-action">
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
