// Vendor
import React, {useEffect, useState} from 'react';
import T from 'prop-types';
import {Link} from 'gatsby';
import classnames from 'classnames';
import {FormattedMessage} from 'react-intl';
import { GatsbyImage } from "gatsby-plugin-image";

// Styles
import styles from './styles.module.scss';

// Components
import ScholarshipDeadline from '../ScholarshipDeadline';
import ScholarshipLevels from '../ScholarshipLevels';
import Newsletter from '../Newsletter';
import Button from '../Button';

// Constants
const NUMBER_OF_SCHOLARSHIPS_BEFORE_NEWSLETTER = 6;
const MOBILE_MAX_INNER_WIDTH = 640;

const median = (values) => {
  values.sort(function (a, b) {
    return a - b;
  });

  const half = Math.floor(values.length / 2);

  if (values.length % 2) return values[half];

  return (values[half - 1] + values[half]) / 2.0;
};

const normalizeThumbnailAspectRatio = (scholarships) => {
  if (!scholarships.length) return scholarships;

  const minAspectRatio = median(scholarships.map((scholarship) => scholarship.thumbnail.fluid.aspectRatio));

  return scholarships.map((scholarship) => ({
    ...scholarship,
    thumbnail: {
      ...scholarship.thumbnail,
      fluid: {
        ...scholarship.thumbnail.fluid,
        aspectRatio: minAspectRatio,
      },
    },
  }));
};

const isSmallScreen = () => {
  if (typeof window === 'undefined') {
    return true;
  }
  return window.innerWidth <= MOBILE_MAX_INNER_WIDTH;
};

const Scholarship = ({scholarship}) => {
  return (
    <article className={styles.card}>
      <Link to={scholarship.path} className={styles.card__body} tabIndex="0">
        <div className={styles['image-wrapper']}>
          <GatsbyImage
            image={scholarship.childImageSharp.gatsbyImageData}
            className={styles.image}
            alt={scholarship.title} />
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
              <Button tag={Link} to={scholarship.path}>
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
    thumbnail: T.shape({
      fluid: T.object.isRequired,
      sizes: T.object,
    }).isRequired,
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
  const [isMobile, setIsMobile] = useState(true);
  const [normalizedScholarships, setNormalizedScholarships] = useState(scholarships);

  useEffect(() => {
    setIsMobile(isSmallScreen());
  });

  useEffect(() => {
    if (!isMobile) {
      setNormalizedScholarships(normalizeThumbnailAspectRatio(scholarships));
    } else {
      setNormalizedScholarships(scholarships);
    }
  }, [isMobile, scholarships]);

  const scholarships1 = normalizedScholarships.slice(0, NUMBER_OF_SCHOLARSHIPS_BEFORE_NEWSLETTER);
  const scholarships2 = normalizedScholarships.slice(NUMBER_OF_SCHOLARSHIPS_BEFORE_NEWSLETTER);
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
                to={allScholarshipsLink || '/toutes-les-bourses'}
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
