// Vendor
import React from 'react';
import T from 'prop-types';
import {Link} from 'gatsby';
import Img from 'gatsby-image';
import Card, {CardMedia, CardPrimaryContent, CardActionButtons, CardActions} from '@material/react-card';
import Button from '@material/react-button';
import {Body2, Headline6, Subtitle2} from '@material/react-typography';
import {FormattedDate} from 'react-intl';
import classnames from 'classnames';

// Styles
import styles from './styles.module.scss';

const Scholarship = ({scholarship}) => {
  const deadline = new Date(scholarship.deadline);
  const year = deadline.getFullYear() === new Date().getFullYear() ? undefined : 'numeric';

  return (
    <Card className={styles.card}>
      <Link to={scholarship.path} className={classnames(styles.card__body, 'mdc-card__primary-action')} tabIndex="0">
        <CardMedia wide imageUrl={scholarship.thumbnail.fluid.src} />
        <div className={styles.card__header}>
          <Headline6 className={styles.card__title}>{scholarship.title}</Headline6>
          <FormattedDate value={scholarship.deadline} month="long" day="2-digit" year={year}>
            {time => <Subtitle2 className={styles.card__subtitle}>Expire le {time}</Subtitle2>}
          </FormattedDate>
        </div>
        <Body2 className={styles.card__description}>{scholarship.excerpt}</Body2>
      </Link>
      <CardActions>
        <CardActionButtons>
          <Link to={scholarship.path} className="mdc-button mdc-card__action mdc-card__action--button">
            Voir les détails
          </Link>
        </CardActionButtons>
      </CardActions>
    </Card>
    // <Link to={scholarship.path}>
    //   <article>
    //     <h4>{scholarship.title}</h4>
    //     <div>
    //
    //     </div>
    //   </article>
    // </Link>
  );
};

Scholarship.propTypes = {
  scholarship: T.shape({
    deadline: T.string.isRequired,
    excerpt: T.string.isRequired,
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
