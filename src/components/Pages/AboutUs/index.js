import React from "react";
import Layout from "../../Layout";
import ValueCard from "../../ValueCard";

import img1 from "../../../images/World_Of_Empires.png";
import img_yellowEllipse from "../../../images/Ellipse8.png";
import img_airline from "../../../images/png-clipart-black-airway-aviation-aircraft-removebg-preview.png";
import img_planearth from "../../../images/earth-with-plane-drawing-png.png";
import * as styles from "./styles.module.scss";

const AboutUs = () => {
  return (
    <Layout pageTitle="Pourquoi RDC-&Eacute;tudes">
      <section>
        <div className="grid grid-cols-12 mb-8 mt-4 z-999">
          <div className="col-span-3">
            <img src={img1} alt="plans" />
          </div>
          <div className="col-span-6 z-10">
            <div className="text-start mx-4">
              <span className={styles.about__title}>Pourquoi RDC-Etudes ?</span>{" "}
              <p>
                <span className={styles.about__description}>
                  Lorem ispum dolor fortuna simpre cresis, out decresis vita
                  Lorem
                </span>
                <br />
                <br />
                <button
                  class={
                    "bg-yellow-500 hover:bg-sky-600 hover:text-white font-bold py-2 px-4 rounded-md " +
                    styles.about__btn
                  }
                >
                  Demander une assistance
                </button>
              </p>
            </div>
          </div>
          <div className="col-span-2">
            <div className={styles.ellipse3}>
              <img src={img_yellowEllipse} style={{ height: "200px" }} />
            </div>
            <div className={styles.ellipse4}>
              <img src={img_airline} style={{ height: "200px" }} />
            </div>
          </div>

          <div>
            <img src={img_planearth} alt="plan on earth" />
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-center">
          <span
            className={"text-center font-bold " + styles.about__values_title}
          >
            TROIS VALEURS QUI GUIDENT NOS ACTIONS
          </span>
        </div>

        <ValueCard title={"L'HONETETE"} />
        <ValueCard title={"LA SERVIABILITE"} />
        <ValueCard title={"LA TRANSPARENCE"} />
      </section>
    </Layout>
  );
};

export default AboutUs;
