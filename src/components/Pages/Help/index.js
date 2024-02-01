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
            Dites-nous en quoi pouvons-nous vous aider ?
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
          className="h-64 w-full mt-7 text-center text-white text-base px-12 py-3 font-['roboto-bold']"
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

      <section className="mb-7 hidden md:block">
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
          <div className="col-span-5 text-sky-600 text-5xl font-extrabold z-10 -mt-20 -ml-40">
            Dites-nous en quoi pouvons-nous vous aider ?
          </div>
          <div className="col-span-2">
            <StaticImage
              alt="plane"
              src="../../../images/earth-with-plane-drawing-png.png"
            />
          </div>
        </div>

        <div className="bg-[#862304] h-80 w-full mt-7 text-center text-white text-2xl font-['roboto'] px-44 py-20">
          Nous n'offrons malheureusement pas des bourses! Nous accompagnons ceux
          qui souhaitent poursuivre leurs études supérieures à l'étranger par
          leurs propres moyens.
          <br />
          Vous trouverez toutes les offres des bourses dont nous avons
          connaissance sur notre site web rdcetudes.com/bourses
          <p className="mt-2">
            <button className={styles.help__btn}>En savoir plus</button>
          </p>
        </div>

        <div className="py-10 mx-60 text-center text-2xl font-['roboto']">
          Nous savons comment l'achat du billet peut être un casse-tête pour
          vous ! Trouvez le bon itinéraire qui correspond à vos besoins et vos
          moyens n'est toujours pas évident ! Procurez-vous un billet à un prix
          imbattable !
        </div>

        <div className="border rounded-lg px-10 mx-72 py-7 shadow-md">
          <p className="uppercase text-center text-xl">
            Dans quel pays voulez-vous étudier ?{" "}
          </p>

          <div className="inline-block relative w-full py-5">
            <input
              type="text"
              placeholder="Mentionnez le pays"
              className="mt-5 block h-16 appearance-none w-full bg-white border-2 border-black hover:border-gray-500 px-4 py-2 pr-8 rounded-lg shadow leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <p className="uppercase text-center text-xl">
            Dans quelle ville de ... ?{" "}
          </p>

          <div className="inline-block relative w-full py-5">
            <input
              type="text"
              placeholder="Précisez la ville"
              className="mt-5 block h-16 appearance-none w-full bg-white border-2 border-black hover:border-gray-500 px-4 py-2 pr-8 rounded-lg shadow leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <p className="uppercase text-center text-lg">
            Avez-vous déjà obtenu votre admission ?{" "}
          </p>

          <input
            type="text"
            placeholder="Oui ou Non"
            className="mt-5 block h-16 appearance-none w-full bg-white border-2 border-black hover:border-gray-500 px-4 py-2 pr-8 rounded-lg shadow leading-tight focus:outline-none focus:shadow-outline"
          />

          <p className="text-sky-600 font-extrabold text-xl my-5">Suivant </p>
        </div>
      </section>
    </Layout>
  );
};

export default Help;
