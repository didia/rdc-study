import React from "react";
import Layout from "../../Layout";
import * as styles from "./styles.module.scss";
import { StaticImage } from "gatsby-plugin-image";
import { AnimationOnScroll } from "react-animation-on-scroll";
import "animate.css";
import PrimaryBtn from "../../Button/Primary";
import img1 from "../../../images/translate_document.jpg";

const TranslateDocs = () => {
  return (
    <Layout pageTitle={"Page d'aide"}>
      <section className="mb-14 md:hidden">
        <div className="grid grid-cols-12 gap-2 mb-14">
          <div className="col-span-4">
            <div className={styles.ellipse__first}>
              <StaticImage
                alt="tourist"
                height={150}
                src="../../../images/translate_document.jpg"
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
          <div className="ml-12 col-span-6 text-sky-600 text-2xl font-extrabold z-10 mt-10">
            Avez-vous des documents à traduire ?
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
          className="mt-24 h-56 w-full text-center text-white text-base px-12 py-3 font-['roboto-bold']"
          style={{ backgroundColor: "#862304" }}
        >
          Faites traduire vos documents académiques, professionnels et
          administratifs par un traducteur assermenté de RDC ÉTUDES.
          <div className="mt-5 bg-yellow-600 text-white py-4 mx-7 ml-auto mr-auto w-[20rem] text-2xl font-['roboto']">
            <span className="text-white font-bold"> 15 $ / Page </span>
          </div>
        </div>

        <div className="mt-16 border rounded-lg px-10 py-7 mx-4 shadow-md">
          <div className="inline-block relative w-full">
            <input
              type="text"
              placeholder="Combien de documents souhaitez-vous traduire?"
              className="mt-5 block h-16 appearance-none w-full bg-white border-2 border-black hover:border-gray-500 px-4 py-2 pr-8 rounded-lg shadow leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="inline-block relative w-full py-5">
            <input
              type="text"
              placeholder="Combien de documents souhaitez-vous traduire?"
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
                  height={450}
                  src="../../../images/translate_document.jpg"
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
            Faites traduire vos documents académiques, professionnels et
            administratifs par un traducteur assermenté de RDC ÉTUDES.
          </div>
          <div className="col-span-2">
            <StaticImage
              alt="plane"
              src="../../../images/earth-with-plane-drawing-png.png"
            />
          </div>
        </div>

        <div className="bg-[#862304] h-72 w-full text-center text-white text-4xl font-['roboto'] px-44 py-12">
          Traduisez l'intégralité de vos documents chez RdcEtudes
          <p className="mt-2">
            <br />
            <div className=" bg-yellow-600 text-white py-4 mx-7 ml-auto mr-auto w-[20rem] text-2xl font-['roboto']">
              <span className="text-white font-bold"> 15 $ / Page </span>
            </div>
          </p>
        </div>

        <div className="mb-32 mt-28 border rounded-lg px-10 mx-[30rem] py-7 shadow-md">
          <div className="inline-block relative w-full py-5">
            <input
              type="text"
              placeholder="Combien de documents souhaitez-vous traduire?"
              className="mt-5 block h-16 appearance-none w-full bg-white border-2 border-black hover:border-gray-500 px-4 py-2 pr-8 rounded-lg shadow leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="inline-block relative w-full py-5">
            <input
              type="text"
              placeholder="Combien de documents souhaitez-vous traduire?"
              className="mt-5 block h-16 appearance-none w-full bg-white border-2 border-black hover:border-gray-500 px-4 py-2 pr-8 rounded-lg shadow leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <PrimaryBtn text={"Soumettre"} />
        </div>
      </section>
    </Layout>
  );
};

export default TranslateDocs;
