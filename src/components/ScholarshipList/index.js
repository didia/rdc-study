// Vendor
import React from 'react';
import T from 'prop-types';
import {Link} from 'gatsby';
import Card, {CardMedia, CardActionButtons, CardActions} from '@material/react-card';
import {Body2, Headline6, Subtitle2} from '@material/react-typography';
import classnames from 'classnames';

// Styles
import styles from './styles.module.scss';

// Components
import ScholarshipDeadline from '../ScholarshipDeadline';
import ScholarshipLevel from '../ScholarshipLevel';

const Scholarship = ({scholarship}) => {
  return (
    <Card className={styles.card}>
      <Link to={scholarship.path} className={classnames(styles.card__body, 'mdc-card__primary-action')} tabIndex="0">
        <CardMedia wide imageUrl={scholarship.thumbnail.fluid.src} />
        <div className={styles.card__header}>
          <Headline6 className={styles.card__title}>{scholarship.title}</Headline6>
          <ScholarshipLevel className={styles.card__subtitle} levels={scholarship.levels} tag={Subtitle2} />
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

const ScholarshipList = ({scholarships}) => (
  <ul className={styles.list}>
    {scholarships.map((scholarship, i) => (
      <li key={i} className={styles.list__item}>
        <Scholarship scholarship={scholarship} />
      </li>
    ))}
  </ul>
);

ScholarshipList.propTypes = {
  scholarships: T.arrayOf(T.shape({}))
};

export default ScholarshipList;
