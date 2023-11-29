import React from "react";
import Layout from "../../Layout";
import BourseCard from "../../BourseCard";
import SecondaryBtn from "../../Button/Secondary"
import * as styles from "./styles.module.scss";
import { StaticImage } from "gatsby-plugin-image";
import img6 from "../../../images/800x600_FE_WEB_equivalence 2.jpg";

const Bourse = () => {
  return (
    <Layout pageTitle={"Bourse d'études"}>
      <section className="mb-7">
        <div class="flex justify-start w-full z-5 absolute">
          <div className="text-start mx-10 z-10">
            <span className={styles.bourse__title}>Bourses d'études</span>{" "}
            <p>
              <span className={styles.bourse__description}>
                Lorem ispum dolor fortuna simpre cresis, out decresis vita Lorem
                ispum dolor fortuna simpre cresis, out decresis vita Lorem ispum
              </span>
              <br />
              <br />

              <SecondaryBtn text={"Demander une assistance"} />
            </p>
          </div>
        </div>
        <div class="w-full h-full mt-10">
          <div style={{ marginTop: "20px" }}>
            <div className={styles.ellipse__first}>
              <StaticImage
                height={150}
                alt="Ellipse 7"
                src="../../../images/Ellipse7.png"
              />
            </div>
            <div className={styles.ellipse__second}>
              <StaticImage
                alt="Ellipse 6"
                height={160}
                src="../../../images/Ellipse6.png"
              />
            </div>
          </div>

          <div>
            <StaticImage
              alt="plane"
              height={280}
              src="../../../images/png-clipart-black-airway-aviation-aircraft-removebg-preview.png"
            />
          </div>

          <div className={styles.ellipse__third}>
            <StaticImage
              alt="Ellipse blue 6"
              height={180}
              src="../../../images/Ellipse_blue6.png"
            />
          </div>
          <div className={styles.ellipse__fourth}>
            <StaticImage alt="Ellipse" src="../../../images/Ellipse8.png" />
          </div>

          <div className={styles.bourse__img_container}>
            <StaticImage
              alt="Ellipse"
              height={130}
              src="../../../images/Young-Girl-Student-HD.png"
            />
          </div>
        </div>
      </section>

      <section>
        <div className="grid grid-cols-2 mx-4 mb-10 gap-4">
          <BourseCard img={img6} />
          <BourseCard img={img6} />
          <BourseCard img={img6} />
          <BourseCard img={img6} />
        </div>
      </section>
    </Layout>
  );
};

export default Bourse;
