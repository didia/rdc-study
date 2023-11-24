import React from "react";
import Layout from "../../Layout";
import ValueCard from "../../ValueCard";
import SecondaryBtn from "../../Button/Secondary";

import img1 from "../../../images/World_Of_Empires.png";
import img_yellowEllipse from "../../../images/Ellipse8.png";
import img_airline from "../../../images/png-clipart-black-airway-aviation-aircraft-removebg-preview.png";
import img_planearth from "../../../images/earth-with-plane-drawing-png.png";
import img_team1 from "../../../images/team1.png";
import img_team2 from "../../../images/team2.png";
import img_team3 from "../../../images/team3.png";

import * as styles from "./styles.module.scss";

const AboutUs = () => {
  return (
    <Layout pageTitle="Pourquoi RDC-&Eacute;tudes">
      <section>
        <div className="grid grid-cols-12 mb-8 mt-4 z-999">
          <div className="col-span-3">
            <img src={img1} alt="plans" />
          </div>
          <div className="col-span-7 z-10">
            <div className="text-start ml-4">
              <span className={styles.about__title}>Pourquoi RDC-Etudes ?</span>{" "}
              <p>
                <span className={styles.about__description}>
                  Lorem ispum dolor fortuna simpre cresis, out decresis vita
                  Lorem
                </span>
                <br />
                <br />
                <SecondaryBtn text={"Demander une assistance"} />
              </p>
            </div>
          </div>
          <div className="col-span-1">
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
            className={"text-center font-extrabold " + styles.about__values_title}
          >
            TROIS VALEURS QUI GUIDENT NOS ACTIONS
          </span>
        </div>

        <ValueCard
          title={"L'HONETETE"}
          section1={
            "Some quick example text to build on the card title and make up the bulk of the card's content."
          }
        />
        <ValueCard
          title={"LA SERVIABILITE"}
          section1={
            "Some quick example text to build on the card title and make up the bulk of the card's content."
          }
        />
        <ValueCard
          title={"LA TRANSPARENCE"}
          section1={
            "Some quick example text to build on the card title and make up the bulk of the card's content."
          }
        />
      </section>

      <section>
        <div className="flex items-center justify-center">
          <span
            className={
              "text-center font-bold uppercase mb-6 mt-6 " +
              styles.about__values_title
            }
          >
            Une équipe sérieuse et passionée à votre service
          </span>
        </div>

        <div className="grid grid-cols-3 mx-10">
          <div className="col-span-3">
            <img
              alt="gallery"
              class="block h-full w-full rounded-lg object-cover object-center"
              src={img_team1}
            />
          </div>

          <div className="col-span-3 pt-5">
            <img
              alt="gallery"
              class="block h-full w-full rounded-lg object-cover object-center"
              src={img_team2}
            />
          </div>

          <div className="col-span-3 pt-5 pb-5">
            <img
              alt="gallery"
              class="block h-full w-full rounded-lg object-cover object-center"
              src={img_team3}
            />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutUs;
