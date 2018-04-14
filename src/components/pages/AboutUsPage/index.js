// Vendor
import React from 'react';
import T from 'prop-types';
import classnames from 'classnames';
import Img from 'gatsby-image';

// Styles
import styles from './styles.module.scss';

import GenericPage from '../GenericPage';

const imageClassPerIndex = index => (index % 2 === 0 ? 'image left' : 'image right');

const AboutUsPage = ({team}) => {
  const page = {
    description: 'Nous voulons que tout congolais ait facilement accès aux meilleures universités du monde.',
    title: 'Pourquoi RDC-Etudes?',
    path: '/a-propos'
  };

  return (
    <GenericPage page={page}>
      <section>
        <h3 className="major"> Une petite histoire</h3>
        <p>
          En 2012, Aristote arrive au Canada pour y effectuer ses études après avoir passé une année en Inde. Toutefois
          avant de réussir ses projets d‘études, il a non seulement été victime de charlatans qui lui ont escroqué pas
          moins de 1500$ pour les démarches mais aussi s‘est vu réfusé sa première demande de visa.
        </p>
        <p>
          Fort de ces expériences, tous ses frères n‘ont pas eu à endurer la même chose pour leurs démarches et sont
          tous venus au Canada poursuivre leurs études dès leurs premières demandes. Ces derniers ont à leur tour aidé
          beaucoup de leurs amis dans leurs propres démarches en leur fournissant une meilleure information et en les
          évitant ainsi de tomber à leur tour dans les panneaux des ces charlatans.
        </p>
        <p>
          Cependant, en parlant avec beaucoup d‘autres nouveaux arrivés au Canada, il se rendit compte qu‘il y‘avait
          encore beaucoup d‘autres congolais qui se faisaient réfuser leur demande de visa ou encore escroquer par des
          charlatans à cause du manque d‘information.
        </p>
        <p>
          C‘est ainsi qu‘en mars 2018, avec ses frères et amis, ils décident donc de créer
          <strong> rdcetudes.com</strong> où ils partagent gratuitement tous les détails pour pouvoir mener à bien un
          projet d‘études à l‘étranger.
        </p>
      </section>

      <section>
        <h3 className="major">Nos objectifs</h3>
        <p>
          En créant <strong>rdcetudes.com</strong>, l‘équipe s‘est fixé <strong>trois</strong> grands objectifs:
          <ol>
            <li>
              Vous permettre de réaliser vos projets d‘études gratuitement grâce aux guides gratuits que nous mettons à
              votre disposition.
            </li>
            <li>
              Vous aider à vérifier que les personnes ou entreprises qui vous assistent dans vos démarches ne sont pas
              des charlatans.
            </li>
            <li>
              Vous assister dans vos démarches d‘études ou vous orienter vers des personnes à même de vous assister
              sérieusement.
            </li>
          </ol>
        </p>
      </section>

      <section>
        <h3 className="major">Notre équipe</h3>

        <ul className="team-member-list">
          {team.map((member, index) => (
            <li key={member.name} className={styles['team-member-list__item']}>
              <Img
                outerWrapperClassName={classnames(styles['team-member-photo-outer'], imageClassPerIndex(index))}
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
