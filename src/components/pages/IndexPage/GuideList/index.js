'use client';

// Vendor
import React from 'react';
import T from 'prop-types';
import {FormattedMessage} from 'react-intl';
import Image from 'next/image';
import Link from 'next/link';

// Styles
import styles from './styles.module.scss';

// From styles.image: width 150px (100px at small, 130px hover)
const IMAGE_WIDTH = 150;
const IMAGE_HEIGHT = 150;

const GuideList = ({className, guides, id}) => (
  <div id={id} className={className}>
    <FormattedMessage id="pages.index.country-list.title">
      {(text) => <h2 className={styles.title}>{text}</h2>}
    </FormattedMessage>

    <div className={styles.grid}>
      {guides.map((guide) => (
        <Link
          key={`${guide.path}?utm_source=rdcetudes&utm_content=home-page`}
          href={guide.path}
          className={styles['grid-item']}
          aria-label={guide.name}
        >
          <article className={styles['grid-item-wrapper']}>
            <div className="image">
              <Image
                className={styles.image}
                src={guide.thumbnail}
                alt={guide.title}
                width={IMAGE_WIDTH}
                height={IMAGE_HEIGHT}
                style={{objectFit: 'cover', width: '100%', height: 'auto'}}
              />
            </div>
            <h3 className={styles['grid-item-title']}>{guide.name}</h3>
          </article>
        </Link>
      ))}
    </div>
  </div>
);

GuideList.propTypes = {
  id: T.string,
  className: T.string,
  guides: T.arrayOf(
    T.shape({
      name: T.string.isRequired,
      path: T.string.isRequired
    })
  )
};

export default GuideList;
