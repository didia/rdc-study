import React from "react";
import Layout from "../../Layout";
import * as styles from "./styles.module.scss";
import { StaticImage } from "gatsby-plugin-image";
import { AnimationOnScroll } from "react-animation-on-scroll";
import "animate.css";

const Help = () => {
  return (
    <Layout pageTitle={"Page d'aide"}>
      <section className="mb-7 md:hidden">
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-5">
            <div className={styles.ellipse__first}>
              <StaticImage
                alt="tourist"
                height={150}
                src="../../../images/Free-Photo-Tourist-runningfast.png"
              />
            </div>
            <div className={styles.ellipse__second}>
              <StaticImage
                height={160}
                alt="plane"
                src="../../../images/png-clipart-black-airway-aviation-aircraft-removebg-preview.png"
              />
            </div>
          </div>
          <div className="col-span-5 text-sky-600 text-2xl font-extrabold z-10 mt-10">
            Avez-vous besoin d'une consultation ?
            <p>
              <StaticImage
                height={50}
                alt="world"
                className="float-right"
                src="../../../images/Download_A_tourist_element_on_white_background_for_free-removebg-preview.png"
              />
            </p>
          </div>
          <div className="col-span-2">
            <StaticImage
              alt="plane"
              src="../../../images/earth-with-plane-drawing-png.png"
            />
          </div>
        </div>

        <div
          className="h-56 w-full mt-7 text-center text-white text-base px-12 py-3 font-['roboto-bold']"
          style={{ backgroundColor: "#862304" }}
        >
          Nous n'offrons malheureusement pas des bourses! Nous accompagnons ceux
          qui souhaitent poursuivre leurs études supérieures à l'étranger par
          leurs propres moyens. Vous trouverez toutes les offres des bourses
          dont nous avons connaissance sur notre site web rdcetudes.com/bourses
          <p className="mt-2">
            <button className={styles.help__btn}>En savoir plus</button>
          </p>
        </div>

        <div className="py-10 mx-7 text-center">
          L'accaompagnement RDC ETUDES consiste à vous orienter dans votre
          projet d'études du choix de l'université jusqu'à l'obtention de votre
          visa.
        </div>

        <div className="border rounded-lg px-10 py-7 mx-4 shadow-md">
          <p className="uppercase text-center">
            Dans quel pays voulez-vous étudier ?{" "}
          </p>

          <div className="inline-block relative w-full py-5">
            <input
              type="text"
              placeholder="Mentionnez le pays"
              className="mt-5 block appearance-none w-full bg-white border-2 border-black hover:border-gray-500 px-4 py-2 pr-8 rounded-lg shadow leading-tight focus:outline-none focus:shadow-outline"
            />

            <input
              type="text"
              placeholder="Précisez la ville"
              className="mt-5 block appearance-none w-full bg-white border-2 border-black hover:border-gray-500 px-4 py-2 pr-8 rounded-lg shadow leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <p className="uppercase text-center">
            Avez-vous déjà obtenu votre admission ?{" "}
          </p>

          <input
            type="text"
            placeholder="Oui ou Non"
            className="mt-5 block appearance-none w-full bg-white border-2 border-black hover:border-gray-500 px-4 py-2 pr-8 rounded-lg shadow leading-tight focus:outline-none focus:shadow-outline"
          />

          <p className="text-sky-600 font-extrabold text-lg my-5">Suivant </p>
        </div>
      </section>

      <section className="hidden md:block">
        <div className="grid grid-cols-12 mt-60">
          <div className="col-span-5">
            <div className={styles.ellipse__first}>
              <AnimationOnScroll animateIn="animate__bounceInLeft">
                <StaticImage
                  alt="tourist"
                  height={450}
                  src="../../../images/Free-Photo-Tourist-runningfast.png"
                />
              </AnimationOnScroll>
            </div>
            <div className={styles.ellipse__second}>
              <StaticImage
                height={450}
                alt="plane"
                src="../../../images/png-clipart-black-airway-aviation-aircraft-removebg-preview.png"
              />
            </div>
          </div>
          <div className="col-span-5 text-sky-600 text-3xl font-['monserrat'] z-10 -mt-24 -ml-40">
            RDC ETUDES vous offre des services de consultation qui vous permet
            de discuter avec un mentor sur l'état de votre projet d'études. Vous
            êtes bloqué(e)? Vous ne savez par où commencer ? Nos mentors seront
            ravis de vous aider a y voir un peu plus clair!
          </div>
          <div className="col-span-2">
            <StaticImage
              alt="plane"
              src="../../../images/earth-with-plane-drawing-png.png"
            />
          </div>
        </div>

        <div className="bg-[#862304] h-72 w-full text-center text-white text-4xl font-['roboto'] px-44 py-12">
          Pour quel pays souhaitez-vous être consulté(e) ?
          <p className="mt-2">
            <br />
            <div className=" bg-yellow-600 text-white py-4 mx-7 ml-auto mr-auto w-[20rem] text-2xl font-['roboto']">
              Prix de consultation :{" "}
              <span className="text-white font-bold"> 30 $ </span>
            </div>
          </p>
        </div>

        <div className="border rounded-lg px-10 mt-10 mx-[30rem] py-7 shadow-md">
          <div className="inline-block relative w-full py-5">
            <select
              placeholder="Mentionnez le pays"
              className="mt-5 block h-16 appearance-none w-full bg-white border-2 border-black hover:border-gray-500 px-4 py-2 pr-8 rounded-lg shadow leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="Allemagne" key="">
                Allemagne
              </option>
              <option value="Belgique" key="">
                Belgique
              </option>
              <option value="Brésil" key="">
                Brésil
              </option>
              <option value="Canada" key="">
                Canada
              </option>
              <option value="Chypre du Nord" key="">
                Chypre du Nord
              </option>
              <option value="France" key="">
                France
              </option>
              <option value="Roumanie" key="">
                Roumanie
              </option>
              <option value="Turquie" key="">
                Turquie
              </option>
              <option value="USA" key="">
                USA
              </option>
            </select>
          </div>

          <p className="uppercase text-center text-xl">
            Pour quel service souhaitez-vous être consulté(e) ?
          </p>

          <div className="inline-block relative w-full py-5">
            <select
              placeholder="Selectionner le service"
              className="mt-5 block h-16 appearance-none w-full bg-white border-2 border-black hover:border-gray-500 px-4 py-2 pr-8 rounded-lg shadow leading-tight focus:outline-none focus:shadow-outline"
            >
              <optgroup label="Allemagne">
                <option value="Cours de langue" key="">
                  Cours de langue
                </option>
                <option value="Proposition des universites" key="">
                  Proposition des universites
                </option>
                <option value="Admission" key="">
                  Admission
                </option>
                <option value="Visa" key="">
                  Visa
                </option>
                <option value="Logement" key="">
                  Logement
                </option>
                <option value="Achat billet" key="">
                  Achat billet
                </option>
              </optgroup>

              <optgroup label="Belgique">
                <option value="Equivalence des diplômes" key="">
                  Equivalence des diplômes
                </option>
                <option value="Admissions" key="">
                  Admissions
                </option>
                <option value="Lettre de motivation" key="">
                  Lettre de motivation
                </option>
                <option value="Remplissage des formulaires" key="">
                  Remplissage des formulaires
                </option>
                <option value="Visa" key="">
                  Visa
                </option>
                <option value="Constitution des documents" key="">
                  Constitution des documents
                </option>
                <option value="Prise de rendez-vous à l'ambassade" key="">
                  Prise de rendez-vous à l'ambassade
                </option>
                <option value="Interview à l’ambassade" key="">
                  Interview à l’ambassade
                </option>
                <option value="Logement" key="">
                  Logement
                </option>
                <option value="Achat Billet" key="">
                  Achat Billet
                </option>
              </optgroup>

              <optgroup label="Brésil">
                <option value="Cours de langue" key="">
                  Cours de langue
                </option>
                <option value="Proposition des universites" key="">
                  Proposition des universites
                </option>
                <option value="Admission" key="">
                  Admission
                </option>
                <option value="Visa" key="">
                  Visa
                </option>
                <option value="Logement" key="">
                  Logement
                </option>
                <option value="Achat Billet" key="">
                  Achat Billet
                </option>
              </optgroup>

              <optgroup label="Canada">
                <option value="Proposition des universites" key="">
                  Proposition des universites
                </option>
                <option value="Admission" key="">
                  Admission
                </option>
                <option value="CAQ" key="">
                  CAQ
                </option>
                <option value="Permis d'études et visa" key="">
                  Permis d'études et visa
                </option>
                <option value="Remplissage des formulaires" key="">
                  Remplissage des formulaires
                </option>
                <option value="Lettre de motivation" key="">
                  Lettre de motivation
                </option>
                <option value="Lettre explicative" key="">
                  Lettre explicative
                </option>
                <option value="Lettre d’engagement" key="">
                  Lettre d’engagement
                </option>
                <option value="Refus admission" key="">
                  Refus admission
                </option>
                <option value="Refus visa" key="">
                  Refus visa
                </option>
                <option value="Achat de billet" key="">
                  Achat de billet
                </option>
                <option value="Logement" key="">
                  Logement
                </option>
              </optgroup>

              <optgroup label="Chypre du Nord">
                <option value="Traduction des documents" key="">
                  Traduction des documents
                </option>
                <option value="Proposition des universités" key="">
                  Proposition des universités
                </option>
                <option value="Admission" key="">
                  Admission
                </option>
                <option value="Paiement Acompte" key="">
                  Paiement Acompte
                </option>
                <option value="Achat de billet" key="">
                  Achat de billet
                </option>
                <option value="Logement" key="">
                  Logement
                </option>
              </optgroup>

              <optgroup label="France">
                <option value="Campus France" key="">
                  Campus France
                </option>
                <option value="Proposition des universités" key="">
                  Proposition des universités
                </option>
                <option value="Admission" key="">
                  Admission
                </option>
                <option value="Projet d'études" key="">
                  Projet d'études
                </option>
                <option value="CVEC" key="">
                  CVEC
                </option>
                <option value="Visa" key="">
                  Visa
                </option>
              </optgroup>

              <optgroup label="Roumanie">
                <option value="Campus France" key="">
                  Traduction des documents
                </option>
                <option value="Proposition des universités" key="">
                  Propositions des universites
                </option>
                <option value="Admission" key="">
                  Admission
                </option>
                <option value="Projet d'études" key="">
                  Paiement Acompte
                </option>
                <option value="Examens medicaux" key="">
                  Examens medicaux
                </option>
                <option value="Visa" key="">
                  Visa
                </option>
                <option value="Logement" key="">
                  Logement
                </option>
              </optgroup>

              <optgroup label="Turquie">
                <option value="Traduction des documents" key="">
                  Traduction des documents
                </option>
                <option value="Proposition des universités" key="">
                  Propositions des universites
                </option>
                <option value="Admission" key="">
                  Admission
                </option>
                <option value="Projet d'études" key="">
                  Paiement Acompte
                </option>
                <option value="Examens medicaux" key="">
                  Examens medicaux
                </option>
                <option value="Visa" key="">
                  Visa
                </option>
                <option value="Logement" key="">
                  Logement
                </option>
              </optgroup>

              <optgroup label="USA">
                <option value="Traduction des documents" key="">
                  Traduction des documents
                </option>
                <option value="Proposition des universités" key="">
                  Propositions des universites
                </option>
                <option value="Admission" key="">
                  Admission
                </option>
                <option value="Remplissage des formulaires" key="">
                  Remplissage des formulaires
                </option>
                <option value="Interview ambassade" key="">
                  Interview ambassade
                </option>
                <option value="Visa" key="">
                  Visa
                </option>
                <option value="Achat billet" key="">
                  Achat billet
                </option>
                <option value="Logement" key="">
                  Logement
                </option>
              </optgroup>
            </select>
          </div>

          <p className="uppercase text-center text-lg">
            Avez-vous déjà obtenu votre admission ?{" "}
          </p>

          <p className="text-sky-600 font-extrabold text-xl my-5">Suivant </p>
        </div>
      </section>
    </Layout>
  );
};

export default Help;
