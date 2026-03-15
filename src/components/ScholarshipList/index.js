'use client';

// Vendor
import React from 'react';
import T from 'prop-types';
import Link from 'next/link';
import classnames from 'classnames';
import {FormattedMessage} from 'react-intl';

// Styles
import styles from './styles.module.scss';

// Components
import ScholarshipDeadline from '../ScholarshipDeadline';
import ScholarshipLevels from '../ScholarshipLevels';
import Newsletter from '../Newsletter';
import Button from '../Button';

// Constants
const NUMBER_OF_SCHOLARSHIPS_BEFORE_NEWSLETTER = 6;

const Scholarship = ({scholarship}) => {
  return (
    <article className={styles.card}>
      <Link href={scholarship.path} className={styles.card__body} tabIndex="0">
        <div className={styles['image-wrapper']}>
          <img className={styles.image} src={scholarship.thumbnail} alt={scholarship.title} />
        </div>
        <div className={styles.card__header}>
          <h6 className={styles.card__title}>{scholarship.title}</h6>
          <ScholarshipLevels className={styles.card__subtitle} levels={scholarship.levels} tag="h6" />
          <ScholarshipDeadline className={styles.card__subtitle} date={scholarship.deadline} tag="h6" />
        </div>
        <p className={styles.card__description}>{scholarship.excerpt}</p>
      </Link>
      <div className={styles.card__actions}>
        <div className={styles['card__actions-buttons']}>
          <FormattedMessage id="scholarship-list.see-details">
            {(text) => (
              <Button tag={Link} href={scholarship.path}>
                {text}
              </Button>
            )}
          </FormattedMessage>
        </div>
      </div>
    </article>
  );
};

Scholarship.propTypes = {
  scholarship: T.shape({
    deadline: T.string,
    excerpt: T.string.isRequired,
    levels: T.arrayOf(T.string.isRequired),
    path: T.string.isRequired,
    title: T.string.isRequired,
    thumbnail: T.string.isRequired,
  }),
};

const ScholarshipList = ({
  className,
  allScholarshipsLink,
  scholarships,
  showAllScholarshipsLink,
  showNewsletter,
  titleKey,
}) => {
  const scholarships1 = scholarships.slice(0, NUMBER_OF_SCHOLARSHIPS_BEFORE_NEWSLETTER);
  const scholarships2 = scholarships.slice(NUMBER_OF_SCHOLARSHIPS_BEFORE_NEWSLETTER);
  return (
    <div className={className}>
      {titleKey && <FormattedMessage id={titleKey}>{(text) => <h2 className="major">{text}</h2>}</FormattedMessage>}

      <ul className={styles.list}>
        {scholarships1.map((scholarship, i) => (
          <li key={i} className={styles.list__item}>
            <Scholarship scholarship={scholarship} />
          </li>
        ))}
      </ul>

      {showNewsletter && <Newsletter className={styles.newsletter} />}

      <ul className={classnames(styles.list, styles['list--second'])}>
        {scholarships2.map((scholarship, i) => (
          <li key={i} className={styles.list__item}>
            <Scholarship scholarship={scholarship} />
          </li>
        ))}
      </ul>

      {showAllScholarshipsLink && (
        <FormattedMessage id="scholarship-list.see-all">
          {(text) => (
            <div className={styles['see-more-button-wrapper']}>
              <Link
                href={allScholarshipsLink || '/toutes-les-bourses'}
                className={classnames('button', styles['see-more-button'])}
              >
                {text}
              </Link>
            </div>
          )}
        </FormattedMessage>
      )}
    </div>
  );
};

ScholarshipList.propTypes = {
  allScholarshipsLink: T.string,
  className: T.string,
  scholarships: T.arrayOf(T.shape({})),
  showAllScholarshipsLink: T.bool,
  showNewsletter: T.bool,
  titleKey: T.string,
};

export default ScholarshipList;
