import React from "react";
import Layout from "../../Layout";
import ValueCard from "../../ValueCard";
import SecondaryBtn from "../../Button/Secondary";
import { StaticImage } from "gatsby-plugin-image";
import * as styles from "./styles.module.scss";
import TeamCard from "../../TeamCard";

const AboutUs = ({ teammMembers }) => {

  return (
    <Layout pageTitle="Pourquoi RDC-&Eacute;tudes">
      <section>
        <div className="grid grid-cols-12 mb-8 mt-4 z-999">
          <div className="col-span-3">
            <StaticImage
              alt="plans"
              src="../../../images/World_Of_Empires.png"
              height={100}
            />
          </div>
          <div className="col-span-7 z-10">
            <div className="text-start ml-4">
              <span className={styles.about__title}>Pourquoi RDC-Etudes ?</span>{" "}
              <p>
                <span className={styles.about__description}>
                Nous voulons que tout le monde ait facilement accès à une éducation de qualité
                </span>
                <br />
                <br />
                <SecondaryBtn text={"Demander une assistance"} />
              </p>
            </div>
          </div>
          <div className="col-span-1">
            <div className={styles.ellipse3}>
              <StaticImage src="../../../images/Ellipse8.png" alt="Ellipse" />
            </div>
            <div className={styles.ellipse4}>
              <StaticImage
                alt="plane"
                height={180}
                src="../../../images/png-clipart-black-airway-aviation-aircraft-removebg-preview.png"
              />
            </div>
          </div>

          <div>
            <StaticImage
              alt="plan on earth"
              src="../../../images/earth-with-plane-drawing-png.png"
            />
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-center">
          <span
            className={
              "text-center font-extrabold " + styles.about__values_title
            }
          >
            TROIS VALEURS QUI GUIDENT NOS ACTIONS
          </span>
        </div>

        <ValueCard
          title={"L'HONETETE"}
          section1={
            "Nous vous dirons toujours la vérité par rapport à vos démarches. L’important pour nous c’est que vous ayez la vraie information. La réussite de vos démarches est et restera toujours notre première priorité."
          }
        />
        <ValueCard
          title={"LA SERVIABILITE"}
          section1={
            "Le plus important pour nous c’est vous rendre service. Voilà pourquoi nous offrons des guides gratuits. Nous savons que c’est en vous rendant le meilleur service possible, que vous parlerez de nous aux autres personnes et que nous aurons plus de clients."
          }
        />
        <ValueCard
          title={"LA TRANSPARENCE"}
          section1={
            "Nous serons toujours transparents avec vous. À la différence des autres, chez nous vous savez exactement à quoi sert votre argent. Vous avez le choix de faire le paiement vous-même. Si nous payons pour vous, nous vous donnerons toujours les preuves de paiement."
          }
        />
      </section>

      <section className="mb-10">
        <div className="flex items-center justify-center mx-3">
          <span
            className={
              "text-center font-bold uppercase mb-6 mt-6 " +
              styles.about__values_title
            }
          >
            Une équipe sérieuse et passionée à votre service
          </span>
        </div>
      </section>

      {
        teammMembers.map(member => {
          return <TeamCard member={member.frontmatter} />
            })
      }
      
    </Layout>
  );
};

export default AboutUs;
