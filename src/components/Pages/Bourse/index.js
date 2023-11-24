import React from "react";
import Layout from "../../Layout";
import BourseCard from "../../BourseCard";
import SecondaryBtn from "../../Button/Secondary"
import * as styles from "./styles.module.scss";

import overlay4 from "../../../images/png-clipart-black-airway-aviation-aircraft-removebg-preview.png";
import img1 from "../../../images/Ellipse7.png";
import img2 from "../../../images/Ellipse6.png";
import img3 from "../../../images/Ellipse8.png";
import img4 from "../../../images/Ellipse_blue6.png";
import img5 from "../../../images/Young-Girl-Student-HD.png"
import img6 from "../../../images/800x600_FE_WEB_equivalence 2.png";

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
              <img src={img1} />
            </div>
            <div className={styles.ellipse__second}>
              <img src={img2} />
            </div>
          </div>

          <div>
            <img src={overlay4} style={{ height: "280px" }} />
          </div>

          <div className={styles.ellipse__third}>
            <img src={img4} />
          </div>
          <div className={styles.ellipse__fourth}>
            <img src={img3} />
          </div>

          <div className={styles.bourse__img_container}>
            <img src={img5} />
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
