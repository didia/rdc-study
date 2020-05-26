// Vendor
import React from 'react';
import T from 'prop-types';
import classnames from 'classnames';
import Img from 'gatsby-image';
import {FormattedMessage} from 'react-intl';

// Styles
import styles from './styles.module.scss';

import GenericPage from '../GenericPage';
import Card from '../../Card';

const imageClassPerIndex = (index) => (index % 2 === 0 ? 'image left' : 'image right');

const page = {
  description: 'Nous voulons que tout le monde ait facilement accès à une éducation de qualité.',
  title: 'Pourquoi RDC-Etudes?',
  path: '/a-propos',
};

const values = [
  {
    titleKey: 'pages.about-us.values.honesty.title',
    descriptionKey: 'pages.about-us.values.honesty.description',
  },
  {
    titleKey: 'pages.about-us.values.helpfulness.title',
    descriptionKey: 'pages.about-us.values.helpfulness.description',
  },
  {
    titleKey: 'pages.about-us.values.transparency.title',
    descriptionKey: 'pages.about-us.values.transparency.description',
  },
];

const AboutUsPage = ({team}) => {
  return (
    <GenericPage page={page}>
      <section className={styles.section}>
        <FormattedMessage id="pages.about-us.values.title">
          {(text) => <h2 className={styles['text-center']}>{text}</h2>}
        </FormattedMessage>

        <div className={styles['value-list']}>
          {values.map((value, i) => (
            <Card key={`value-${i}`} className={styles['value-list__item']}>
              <FormattedMessage id={value.titleKey}>
                {(text) => <h3 className={styles['value-title']}>{text}</h3>}
              </FormattedMessage>

              <FormattedMessage id={value.descriptionKey} tagName="p" />
            </Card>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <FormattedMessage id="pages.about-us.mentors.title">
          {(text) => <h2 className={styles['text-center']}>{text}</h2>}
        </FormattedMessage>

        <div className={styles['team-member-list']}>
          {team.map((member, index) => (
            <Card key={member.name} className={styles['team-member-list__item']}>
              <div className={classnames(styles['team-member-photo-outer'], imageClassPerIndex(index))}>
                <Img fluid={member.image.childImageSharp.fluid} alt={member.name} />
              </div>

              <div className={styles['team-member-info']}>
                <header className={styles['team-member-info__header']}>
                  <h4 className={styles['team-member-info-name']}>{member.name}</h4>
                  <p className={styles['team-member-info-title']}>{member.title}</p>
                </header>

                <section className={styles['team-member-info__details']}>
                  <p className={styles['team-member-info-about']}>{member.about}</p>
                </section>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </GenericPage>
  );
};

AboutUsPage.propTypes = {
  team: T.arrayOf(
    T.shape({
      about: T.string.isRequired,
      image: T.object.isRequired,
      name: T.string.isRequired,
      role: T.string.isRequired,
      title: T.string.isRequired,
    }).isRequired
  ).isRequired,
};

export default AboutUsPage;
