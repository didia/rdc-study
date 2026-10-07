import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import styles from './styles.module.scss';

/** Image card used for guides, articles and other content lists. */
const ContentCard = ({href, image, kicker, title, text, meta, linkLabel}) => (
  <article className={styles.card}>
    <Link href={href} className={styles.image} tabIndex={-1} aria-hidden="true">
      {image && (
        <Image
          src={image}
          alt=""
          width={400}
          height={225}
          sizes="(max-width: 640px) 100vw, (max-width: 980px) 50vw, 400px"
          style={{objectFit: 'cover', width: '100%', height: '100%'}}
        />
      )}
    </Link>
    <div className={styles.body}>
      {kicker && <small>{kicker}</small>}
      <h3>
        <Link href={href}>{title}</Link>
      </h3>
      {text && <p>{text}</p>}
      {meta && <div className={styles.meta}>{meta}</div>}
      {linkLabel && (
        <Link href={href} className={styles.more}>
          {linkLabel}
        </Link>
      )}
    </div>
  </article>
);

export default ContentCard;
