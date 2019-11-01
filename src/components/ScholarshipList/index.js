// Vendor
import React from 'react';
import T from 'prop-types';
import {Link} from 'gatsby';
import Card, {CardMedia, CardActionButtons, CardActions} from '@material/react-card';
import {Body2, Headline6, Subtitle2} from '@material/react-typography';
import classnames from 'classnames';
import {FormattedMessage} from 'react-intl';

// Styles
import styles from './styles.module.scss';

// Components
import ScholarshipDeadline from '../ScholarshipDeadline';
import ScholarshipLevels from '../ScholarshipLevels';
import Newsletter from '../Newsletter';

// Constants
const NUMBER_OF_SCHOLARSHIPS_BEFORE_NEWSLETTER = 6;

const Scholarship = ({scholarship}) => {
  return (
    <Card className={styles.card}>
      <Link to={scholarship.path} className={classnames(styles.card__body, 'mdc-card__primary-action')} tabIndex="0">
        <CardMedia wide imageUrl={scholarship.thumbnail.fluid.src} />
        <div className={styles.card__header}>
          <Headline6 className={styles.card__title}>{scholarship.title}</Headline6>
          <ScholarshipLevels className={styles.card__subtitle} levels={scholarship.levels} tag={Subtitle2} />
          <ScholarshipDeadline className={styles.card__subtitle} date={scholarship.deadline} tag={Subtitle2} />
        </div>
        <Body2 className={styles.card__description}>{scholarship.excerpt}</Body2>
      </Link>
      <CardActions>
        <CardActionButtons>
          <Link
            to={scholarship.path}
            className={classnames(styles.card__button, 'mdc-button mdc-card__action mdc-card__action--button')}
          >
            Voir les détails
          </Link>
        </CardActionButtons>
      </CardActions>
    </Card>
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
      sizes: T.object
    }).isRequired
  })
};

const ScholarshipList = ({
  className,
  allScholarshipsLink,
  scholarships,
  showAllScholarshipsLink,
  showNewsletter,
  titleKey
}) => {
  const scholarships1 = scholarships.slice(0, NUMBER_OF_SCHOLARSHIPS_BEFORE_NEWSLETTER);
  const scholarships2 = scholarships.slice(NUMBER_OF_SCHOLARSHIPS_BEFORE_NEWSLETTER);
  return (
    <div className={className}>
      {titleKey && <FormattedMessage id={titleKey}>{text => <h2 className="major">{text}</h2>}</FormattedMessage>}

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
          {text => (
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
  titleKey: T.string
};

export default ScholarshipList;
