import React from "react";
import Layout from "../../Layout";
import ValueCard from "../../ValueCard";
import SecondaryBtn from "../../Button/Secondary";
import PrimaryBtn from "../../Button/Primary";
import { StaticImage } from "gatsby-plugin-image";
import * as styles from "./styles.module.scss";
import TeamCard from "../../TeamCard";

const AboutUs = ({ teammMembers }) => {

  return (
    <Layout pageTitle="Pourquoi RDC-&Eacute;tudes">
      <section className="md:hidden">
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
                  Nous voulons que tout le monde ait facilement accès à une
                  éducation de qualité
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

      <section className="hidden md:block">
        <div className="grid grid-cols-12 mb-8 mt-4 z-999">
          <div className="col-span-3">
            <StaticImage
              alt="plans"
              src="../../../images/World_Of_Empires.png"
            />
          </div>
          <div className="col-span-7 z-10 mt-20">
            <div className="text-start ml-20">
              <span className="text-5xl text-sky-600 font-extrabold">
                Pourquoi RDC-Etudes ?
              </span>{" "}
              <p className="py-5">
                <span className="text-2xl">
                  Nous voulons que tout le monde ait facilement accès à une
                  éducation de qualité
                </span>
                <br />
                <br />
                <PrimaryBtn
                  text={"Demander une assistance"}
                  fontSize={"text-lg"}
                />
              </p>
            </div>
          </div>
          <div className="col-span-1">
            <div className={styles.ellipse3}>
              <StaticImage
                className=""
                src="../../../images/Ellipse15.png"
                alt="Ellipse"
              />
            </div>
            <div className={styles.ellipse4}>
              <StaticImage alt="plane" src="../../../images/Ellipse16.png" />
            </div>
          </div>
        </div>
      </section>

      <section className="md:hidden">
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

      <section className="hidden md:block mt-40">
        <div className="flex items-center justify-center">
          <span className="text-center font-extrabold text-3xl text-sky-600">
            TROIS VALEURS QUI GUIDENT NOS ACTIONS
          </span>
        </div>

        <div className="grid grid-cols-3 mt-20">
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
        </div>
      </section>

      <section className="mb-10 md:mb-20">
        <div className="flex items-center justify-center mx-3">
          <span
            className={
              "text-center font-bold uppercase mb-6 mt-6 md:text-3xl " +
              styles.about__values_title
            }
          >
            Une équipe sérieuse et passionée à votre service
          </span>
        </div>
      </section>

      <div className="md:hidden">
        {teammMembers.map((member) => {
          return <TeamCard member={member.frontmatter} />;
        })}
      </div>
      
      <div className="hidden md:grid grid-cols-3">
        {teammMembers.map((member) => {
          return <TeamCard member={member.frontmatter} />;
        })}
      </div>
    </Layout>
  );
};

export default AboutUs;
