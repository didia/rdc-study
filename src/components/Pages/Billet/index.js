import React from "react";
import Layout from "../../Layout";
import * as styles from "./styles.module.scss";
import { StaticImage } from "gatsby-plugin-image";
import { AnimationOnScroll } from "react-animation-on-scroll";
import "animate.css";
import PrimaryBtn from "../../Button/Primary";

const Billet = () => {
  return (
    <Layout pageTitle={"Page d'aide"}>
      <section className="mb-7 md:hidden">
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-4">
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
          <div className="col-span-6 text-sky-600 text-2xl font-['roboto'] z-10 mt-10">
            Pour quelle destination souhaitez-vous acheter le billet ?
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
          className="w-full mt-7 text-center text-white text-xl px-12 py-16 font-['roboto-bold']"
          style={{ backgroundColor: "#862304" }}
        >
          Nous savons comment l'achat du billet peut être un casse-tête pour
          vous ! Trouvez le bon itinéraire qui correspond à vos besoins et vos
          moyens n'est toujours pas évident ! Procurez-vous un billet à un prix
          imbattable!
        </div>

        <div className="mt-16 mb-20 border rounded-lg px-10 py-7 mx-4 shadow-md">
          <div className="inline-block relative w-full py-3">
            <input
              type="text"
              placeholder="Entrer le pays de votre destination"
              className="mt-5 block h-16 appearance-none w-full bg-white border-2 border-black hover:border-gray-500 px-4 py-2 pr-8 rounded-lg shadow leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="inline-block relative w-full py-3">
            <input
              type="text"
              placeholder="Précisez le nom la ville"
              className="mt-5 block h-16 appearance-none w-full bg-white border-2 border-black hover:border-gray-500 px-4 py-2 pr-8 rounded-lg shadow leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <PrimaryBtn text={"Soumettre"} />
        </div>
      </section>

      <section className="hidden md:block">
        <div className="grid grid-cols-12 mt-60">
          <div className="col-span-5">
            <div className={styles.ellipse__first}>
              <AnimationOnScroll animateIn="animate__bounceInLeft">
                <StaticImage
                  alt="tourist"
                  height={350}
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
          <div className="col-span-5 text-sky-600 text-2xl font-['monserrat'] z-10 -mt-24 -ml-40">
            Nous savons comment l'achat du billet peut être un casse-tête pour
            vous ! Trouvez le bon itinéraire qui correspond à vos besoins et vos
            moyens n'est toujours pas évident ! Procurez-vous un billet à un
            prix imbattable !
          </div>
          <div className="col-span-2">
            <StaticImage
              alt="plane"
              src="../../../images/earth-with-plane-drawing-png.png"
            />
          </div>
        </div>

        <div className="bg-[#862304] w-full text-center text-white text-3xl font-['roboto'] px-44 py-24">
          Pour quelle destination souhaitez-vous acheter le billet ?
        </div>

        <div className="mb-32 mt-28 border rounded-lg px-5 mx-[25rem] py-7 shadow-md">
          <div className="inline-block relative w-full py-5">
            <input
              type="text"
              placeholder="Entrer le pays de votre destination"
              className="mt-5 block h-16 appearance-none w-full bg-white border-2 border-black hover:border-gray-500 px-4 py-2 pr-8 rounded-lg shadow leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="inline-block relative w-full py-5">
            <input
              type="text"
              placeholder="Précisez le nom la ville"
              className="mt-5 block h-16 appearance-none w-full bg-white border-2 border-black hover:border-gray-500 px-4 py-2 pr-8 rounded-lg shadow leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <PrimaryBtn text={"Soumettre"} />
        </div>
      </section>
    </Layout>
  );
};

export default Billet;
