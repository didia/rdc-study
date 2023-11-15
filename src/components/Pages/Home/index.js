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
            <div className="flex justify-center items-center">
              <div class="grid grid-rows-2 grid-flow-col">
                <div>
                  <span className={style.firstsection__title}>RDC Etudes</span>
                  <br />
                  <p className="text-slate-50">
                    Lorem ispum dolor Lorem ispum dolor Lorem ispum dolor Lorem
                    ispum dolor Lorem ispum dolor Lorem ispum dolor Lorem ispum
                    dolor Lorem ispum dolor Lorem ispum dolor
                  </p>
                  <div class="flex items-stretch">
                    <div class="py-4 px-4">
                      <button type="submit" className={style.contact_btn}>
                        <svg
                          aria-hidden="true"
                          id="loader"
                          role="status"
                          class="hidden inline mr-2 w-7 h-7 text-gray-200 animate-spin text-gray-400"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          ></path>
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="#046059"
                          ></path>
                        </svg>
                        Demande une assistance
                      </button>
                    </div>
                    <div class="py-4 px-4">&nbsp;</div>
                    <div class="py-4 px-4">&nbsp;</div>
                  </div>
                </div>

                <div style={{ marginTop: "-14%" }}>
                  <ul className={style.firstsection__form}></ul>
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
          <span
            style={{
              color: "#0490DF",
              fontWeight: "900",
              fontSize: "28px",
              lineHeight: "27px",
            }}
          >
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
