// Vendor
import React from 'react';
import T from 'prop-types';
import classnames from 'classnames';
import Img from 'gatsby-image';

// Styles
import styles from './styles.module.scss';

import GenericPage from '../GenericPage';

const AboutUsPage = ({team}) => {
  const page = {
    description: 'Nous voulons rendre facilement et gratuitement accessible les études à l‘étranger à tout congolais!',
    title: 'Pourquoi RDC-Etudes?',
    path: '/a-propos'
  };

  return (
    <GenericPage page={page}>
      <section>
        <h3 className="major"> Une petite histoire</h3>
        <p>
          Joel, un nouvel étudiant arrive au Canada après avoir entrepris ses démarches à Kinshasa. Dans une réunion
          d‘étudiants congolais, il rencontre Aristote et lui fait part des montants exhoribitants qu‘il a dû déboursé
          pour faire ses démarches.
        </p>
      </section>

      <section>
        <h3 className="major">Notre objectif</h3>
        <p>Nous voulons réussir</p>
      </section>

      <section>
        <h3 className="major">Notre équipe</h3>

        <ul className="team-member-list">
          {team.map(member => (
            <li key={member.name} className={styles['team-member-list__item']}>
              <Img
                outerWrapperClassName={classnames(styles['team-member-photo-outer'], 'image left')}
                sizes={member.image.childImageSharp.sizes}
                alt={member.name}
              />

              <div className={styles['team-member-info']}>
                <header className={styles['team-member-info__header']}>
                  <h4 className={styles['team-member-info-name']}>{member.name}</h4>
                  <p className={styles['team-member-info-title']}>{member.title}</p>
                </header>

                <section className={styles['team-member-info__details']}>
                  <p className={styles['team-member-info-about']}>{member.about}</p>
                  <p className={styles['team-member-info-role']}>{member.role} </p>
                </section>
              </div>
            </li>
          ))}
        </ul>
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
      title: T.string.isRequired
    }).isRequired
  ).isRequired
};

export default AboutUsPage;
