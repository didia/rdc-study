import React from "react";
import { StaticImage } from "gatsby-plugin-image";
import AssistanceDropdown from "./AssistanceDropdown";
import * as styles from "../styles.module.scss";

const HeroSection = () => {
  return (
    <>
      <div className={"md:hidden " + styles.firstSection}>
        <StaticImage
          className={styles.firstSection__imgStudent}
          src="../../../../images/young-students-studying.jpg"
          alt="Equipe etudes"
        />
        <div className={styles.firstSection__inner}>
          <StaticImage
            className={styles.firstSection__overlay}
            src="../../../../images/Rectangle 47.png"
            alt="Overlay"
          />

          <div className={styles.contact_content}>
            <div className="text-start">
              <div className="text-2xl text-white font-bold mt-2 mb-4 font-['monserrat']">
                Pourquoi choisir RDC etudes ?
              </div>
              <div className="text-base text-white mb-7 font-['roboto']">
                Parce qu'en nous choisissant, vous ne partez pas seul. Nous ne
                faisons pas que vous aider à obtenir un visa d'études ; nous
                vous accompagnons à chaque étape, depuis votre décision de
                partir jusqu'à l'accomplissement de votre projet académique à
                l'étranger. Nous connaissons le chemin, car nous l'avons
                nous-mêmes parcouru.
              </div>
              <AssistanceDropdown isMobile={true} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-md:hidden flex">
        <div>
          <StaticImage
            alt="plane"
            height={300}
            src="../../../../images/pngtree-cartoon-paper-airplane-png-image_1195649-removebg-preview 2.png"
          />
        </div>

        <div className="mt-20">
          <StaticImage
            alt="plane"
            height={80}
            src="../../../../images/kisspng-canada-international-student-travel-visa-f-visa-books-5aa189efac2496.png"
          />
        </div>
      </div>
    </>
  );
};

export default HeroSection;
