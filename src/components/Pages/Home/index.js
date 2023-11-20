import * as React from "react";
import Layout from "../../../components/Layout";
import * as style from "./styles.module.scss";

import overlay1 from "../../../images/Rectangle 47.png";
import img1 from "../../../images/equipe-etudes.png";
import img2 from "../../../images/jeune-femme-entree-ecole-lit-livre.png";
import img3 from "../../../images/beau-routard-homme.png";
import img4 from "../../../images/etudiante-africaine-posee.png";
import img5 from "../../../images/logo_243.png";
import logo from "../../../images/logo.png";

import StudyCountry from "../../../components/StudyCountry";
import Scholarship from "../../../components/Scholarship";
import ContactForm from "../../../components/ContactForm";

const Home = () => {
  return (
    <Layout pageTitle="Page d'acceuil">
      <div className={style.parent} id="contact_section">
        <img src={img1} />
        <div className={style.inner}>
          <img src={overlay1} />

          <div className={style.contact_content}>
            <div className="flex text-start">
              <div className="grid grid-rows-3 py-4">
                <div>
                  <h1
                    className={
                      "text-3xl text-white font-black " + style.header__title
                    }
                  >
                    RDC &Eacute;tudes
                  </h1>
                </div>
                <div
                  className={
                    "text-sm text-white mb-3 -mt-6 " + style.header__desc
                  }
                >
                  Lorem ispum dolor Lorem ispum dolor Lorem ispum dolor Lorem
                  ispum dolor Lorem ispum dolor Lorem ispum dolor Lorem ispum
                  dolor Lorem ispum dolor Lorem ispum dolor
                </div>
                <div>
                  <button type="submit" className={style.header__btn}>
                    Demander une assistance
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <StudyCountry />
      <Scholarship />

      <section className="mb-10">
        <div className="text-left px-8 mb-5">
          <span className="text-sky-600 text-xl font-black uppercase">
            Les dernières nouvelles
          </span>{" "}
          <div class="h-4 w-full border-b-2 border-sky-600"></div>
        </div>

        <div class="grid grid-cols-12 gap-4">
          <div className="col-span-5 px-4">
            <img src={img2} className="object-contain" />
          </div>
          <div className="col-span-7">
            <span
              style={{
                color: "#0490DF",
                fontWeight: "900",
                fontSize: "18px",
              }}
            >
              Titre de l'article
            </span>{" "}
            <p style={{ fontSize: "17px", lineHeight: "17px" }}>
              Lorem ispum dolor fortuna simpre cresis, out decresis vita
              detastabilis Lorem ispum dolor fortuna simpre cresis, out decresis
            </p>
          </div>
        </div>

        <div class="grid grid-cols-12 gap-4 py-4">
          <div className="col-span-5 px-4">
            <img src={img3} className="object-contain" />
          </div>
          <div className="col-span-7">
            <span
              style={{
                color: "#0490DF",
                fontWeight: "900",
                fontSize: "18px",
              }}
            >
              Titre de l'article
            </span>{" "}
            <p style={{ fontSize: "17px", lineHeight: "17px" }}>
              Lorem ispum dolor fortuna simpre cresis, out decresis vita
              detastabilis Lorem ispum dolor fortuna simpre cresis, out decresis
            </p>
          </div>
        </div>

        <div class="grid grid-cols-12 gap-4 py-4">
          <div className="col-span-5 px-4">
            <img src={img4} className="object-contain" />
          </div>
          <div className="col-span-7">
            <span
              style={{
                color: "#0490DF",
                fontWeight: "900",
                fontSize: "18px",
              }}
            >
              Titre de l'article
            </span>{" "}
            <p style={{ fontSize: "17px", lineHeight: "17px" }}>
              Lorem ispum dolor fortuna simpre cresis, out decresis vita
              detastabilis Lorem ispum dolor fortuna simpre cresis, out decresis
            </p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <div className="text-center">
          <span
            style={{
              color: "#0490DF",
              fontWeight: "900",
              fontSize: "28px",
              lineHeight: "27px",
            }}
          >
            Nos partenaires
          </span>{" "}
        </div>

        <div class="container relative z-40 mx-auto ">
          <div class="flex flex-wrap justify-center mx-auto lg:w-full md:w-5/6 xl:shadow-small-blue">
            <a href="#" class="block w-1/3 py-10 text-center lg:w-1/4">
              <div>
                <img src={img5} class="block mx-auto" />

                <p class="pt-4 text-sm font-medium capitalize font-body text-green-900 lg:text-lg md:text-base md:pt-6">
                  243 technologies
                </p>
              </div>
            </a>

            <a href="#" class="block w-1/3 py-10 text-center lg:w-1/4">
              <div>
                <img src={logo} class="block mx-auto" />

                <p class="pt-4 text-sm font-medium capitalize font-body text-green-900 lg:text-lg md:text-base md:pt-6">
                  RDC Etudes
                </p>
              </div>
            </a>

            <a href="#" class="block w-1/3 py-10 text-center lg:w-1/4">
              <div>
                <img src={img5} class="block mx-auto" />

                <p class="pt-4 text-sm font-medium capitalize font-body text-green-900 lg:text-lg md:text-base md:pt-6">
                  243 technologies
                </p>
              </div>
            </a>
          </div>
        </div>
      </section>

      <ContactForm marginBottom={"mb-40"} />
    </Layout>
  );
};

export default Home;
