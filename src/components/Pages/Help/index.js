import React from "react";
import Layout from "../../Layout";
import * as styles from "./styles.module.scss";
import overlay4 from "../../../images/png-clipart-black-airway-aviation-aircraft-removebg-preview.png";
import img_earth from "../../../images/Download_A_tourist_element_on_white_background_for_free-removebg-preview.png";

import img_boy_running from "../../../images/Free-Photo-Tourist-runningfast.png";
import img_earthplane from "../../../images/earth-with-plane-drawing-png.png";

const Help = () => {
  return (
    <Layout pageTitle={"Page d'aide"}>
      <section className="mb-7">
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-5">
            <div className={styles.ellipse__first}>
              <img src={img_boy_running} />
            </div>
            <div className={styles.ellipse__second}>
              <img src={overlay4} />
            </div>
          </div>
          <div className="col-span-5 text-sky-600 text-2xl font-extrabold z-10 mt-10">
            Dites-nous en quoi pouvons-nous vous aider ?
            <p>
              <img src={img_earth} style={{ height: "50px", float: "right" }} />
            </p>
          </div>
          <div className="col-span-2">
            <img src={img_earthplane} />
          </div>
        </div>

        <div
          className="h-60 w-full mt-7 text-center text-white text-sm px-12 py-3"
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

          <div class="inline-block relative w-full py-5">
            <select class="block appearance-none w-full bg-white border-2 border-black hover:border-gray-500 px-4 py-2 pr-8 rounded-lg shadow leading-tight focus:outline-none focus:shadow-outline">
              <option disabled selected hidden className="text-gray-300">
                Choisissez un pays
              </option>
              <option>Canada</option>
              <option>USA</option>
              <option></option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                class="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>

          <p className="uppercase text-center">
            Avez-vous déjà obtenu votre admission ?{" "}
          </p>

          <input
            type="text"
            placeholder="Oui ou Non"
            class="mt-5 block appearance-none w-full bg-white border-2 border-black hover:border-gray-500 px-4 py-2 pr-8 rounded-lg shadow leading-tight focus:outline-none focus:shadow-outline"
          />

          <p className="text-sky-600 font-extrabold text-lg my-5">Suivant </p>
        </div>
      </section>
    </Layout>
  );
};

export default Help;
