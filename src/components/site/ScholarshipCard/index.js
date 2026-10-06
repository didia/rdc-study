'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {useIntl} from 'react-intl';

import styles from './styles.module.scss';
import ScholarshipDeadline from '../../ScholarshipDeadline';
import ScholarshipLevels from '../../ScholarshipLevels';

const ScholarshipCard = ({scholarship}) => {
  const intl = useIntl();
  const countries = (scholarship.targetCountries || [])
    .map((code) => intl.messages[`shared.countries.${code}`] && intl.formatMessage({id: `shared.countries.${code}`}))
    .filter(Boolean)
    .join(', ');

  return (
    <article className={styles.card}>
      <Link href={scholarship.path} className={styles.image} tabIndex={-1} aria-hidden="true">
        <Image
          src={scholarship.thumbnail}
          alt=""
          width={400}
          height={225}
          sizes="(max-width: 640px) 100vw, (max-width: 980px) 50vw, 400px"
          style={{objectFit: 'cover', width: '100%', height: '100%'}}
        />
      </Link>
      <div className={styles.body}>
        {countries && <small>{countries}</small>}
        <h3>
          <Link href={scholarship.path}>{scholarship.title}</Link>
        </h3>
        <ScholarshipLevels className={styles.levels} levels={scholarship.levels} />
        <ScholarshipDeadline className={styles.deadline} date={scholarship.deadline} />
        <Link href={scholarship.path} className={styles.more}>
          {intl.formatMessage({id: 'scholarship-list.see-details'})}
        </Link>
      </div>
    </article>
  );
};

export default ScholarshipCard;
