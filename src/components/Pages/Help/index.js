import React from "react";
import Layout from "../../Layout";
import * as styles from "./styles.module.scss";
import overlay4 from "../../../images/png-clipart-black-airway-aviation-aircraft-removebg-preview.png";
import img_earth from "../../../images/Download_A_tourist_element_on_white_background_for_free-removebg-preview.png";

import img_boy_running from "../../../images/Free-Photo-Tourist-runningfast.png";
import img_earthplane from "../../../images/earth-with-plane-drawing-png.png";

const Help = () => {
  return (
    <Layout pageTitle={"Bourse d'études"}>
      <section className="mb-80">
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-5">
            <div className={styles.ellipse1}>
              <img src={img_boy_running} style={{ height: "220px" }} />
            </div>
            <div className={styles.ellipse2}>
              <img src={overlay4} style={{ height: "230px" }} />
            </div>
          </div>
          <div className="col-span-5 text-sky-600 text-3xl font-extrabold z-10 mt-10">
            Dites-nous en quoi pouvons-vous aider ?
            <p>
              <img src={img_earth} style={{ height: "50px", float: "right" }} />
            </p>
          </div>
          <div className="col-span-2">
            <img src={img_earthplane} />
          </div>
        </div>

        <div
          className="h-60 w-full mt-20 text-center text-white text-sm px-12 py-10"
          style={{ backgroundColor: "#862304" }}
        >
          Nous n'offrons malheureusement pas des bourses! Nous accompagnons ceux
          qui souhaitent poursuivre leurs études supérieures à l'étranger par
          leurs propres moyens. Vous trouverez toutes les offres des bourses
          dont nous avons connaissance sur notre site web rdcetudes.com/bourses

          <p>
            <button className={ styles.help__btn }>En savoir plus</button>
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default Help;
