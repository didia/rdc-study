import React from "react";
import Layout from "../../Layout";
import BourseCard from "../../BourseCard";
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
      <section className="mb-16">
        <div class="flex justify-start w-full z-10 absolute">
          <div className="text-start mx-20">
            <span className={styles.bourse__title}>Bourse d'études</span>{" "}
            <p>
              <span className={styles.bourse__description}>
                Lorem ispum dolor fortuna simpre cresis, out decresis vita Lorem
                ispum dolor fortuna simpre cresis, out decresis vita Lorem ispum
                dolor fortuna simpre cresis, out decresis vita
              </span>
              <br />
              <br />
              <button
                class={
                  "bg-yellow-500 hover:bg-sky-600 hover:text-white font-bold py-2 px-4 rounded-md " +
                  styles.bourse__btn
                }
              >
                Demander une assistance
              </button>
            </p>
          </div>
        </div>
        <div class="w-full h-full mt-10">
          <div style={{ marginTop: "20px" }}>
            <div className={styles.ellipse1}>
              <img src={img1} style={{ height: "220px" }} />
            </div>
            <div className={styles.ellipse2}>
              <img src={img2} style={{ height: "230px" }} />
            </div>
          </div>

          <div>
            <img src={overlay4} style={{ height: "280px" }} />
          </div>

          <div className={styles.ellipse3}>
            <img src={img4} style={{ height: "280px" }} />
          </div>
          <div className={styles.ellipse4}>
            <img src={img3} style={{ height: "280px" }} />
          </div>

          <div className={styles.student_img}>
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
