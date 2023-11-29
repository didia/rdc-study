import * as React from "react";
import Layout from "../../../components/Layout";
import * as style from "./styles.module.scss";

import news_img2 from "../../../images/jeune-femme-entree-ecole-lit-livre.jpg";
import news_img3 from "../../../images/beau-routard-homme.jpg";
import news_img4 from "../../../images/etudiante-africaine-posee.jpg";

import StudyCountry from "../../../components/StudyCountry";
import Scholarship from "../../../components/Scholarship";
import ContactForm from "../../../components/ContactForm";
import NewsCard from "../../NewsCard";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuoteLeft } from "@fortawesome/free-solid-svg-icons";
import { StaticImage } from "gatsby-plugin-image";
import SecondaryBtn from "../../Button/Secondary";
import PrimaryBtn from "../../Button/Primary";

const Home = () => {
  return (
    <Layout pageTitle="Page d'acceuil">
      <div className={"md:hidden " + style.firstSection}>
        <StaticImage
          class={style.firstSection__imgStudent}
          src="../../../images/equipe-etudes.png"
          alt="Equipe etudes"
        />
        <div className={style.firstSection__inner}>
          <StaticImage
            className={style.firstSection__overlay}
            src="../../../images/Rectangle 47.png"
            alt="Overlay"
          />

          <div className={style.contact_content}>
            <div className="flex text-start">
              <div className="grid grid-rows-3 py-4">
                <div>
                  <h1
                    className={
                      "text-4xl text-white font-black " +
                      style.firstSection__title
                    }
                  >
                    RDC &Eacute;tudes
                  </h1>
                </div>
                <div
                  className={
                    "text-sm text-white mb-3 -mt-6 " + style.firstSection__desc
                  }
                >
                  Lorem ispum dolor Lorem ispum dolor Lorem ispum dolor Lorem
                  ispum dolor Lorem ispum dolor Lorem ispum dolor Lorem ispum
                  dolor Lorem ispum dolor Lorem ispum dolor
                </div>
                <div>
                  <SecondaryBtn text={"Demander une assistance"} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-md:hidden flex">
        <div>
          <StaticImage
            alt="plane"
            height={300}
            src="../../../images/pngtree-cartoon-paper-airplane-png-image_1195649-removebg-preview 2.png"
          />
        </div>

        <div className="mt-20">
          <StaticImage
            alt="plane"
            height={80}
            src="../../../images/kisspng-canada-international-student-travel-visa-f-visa-books-5aa189efac2496.png"
          />
        </div>
      </div>

      <div className="max-md:hidden flex -mt-32 mx-28">
        <div className="z-10">
          <div className="text-start">
            <p className="text-5xl text-sky-600 font-black">
              Pourquoi RDC-Etudes ?
            </p>
            <p className="text-2xl my-4">
              Lorem ipsum dolor sit amet consectetur. Facilisis ipsum velit urna
              velit mauris in eget nisl. Porttitor ipsum eu auctor arcu. Urna
              scelerisque aliquam augue aliquam non ultrices mauris et.
            </p>
            <PrimaryBtn text={"Demander une assistance"} />
          </div>
        </div>
        <div className="-mt-28">
          <StaticImage
            height={1600}
            width={1800}
            alt="Agence"
            src="../../../images/Agence-M-Com-Marseille-AppartStudy-Marne-Montpellier-Residence.png"
          />
        </div>
      </div>

      <div className="max-md:hidden bloc -mt-96">
        <StaticImage
          alt="plane"
          class=""
          height={400}
          src="../../../images/png-clipart-black-airway-aviation-aircraft-removebg-preview.png"
        />
        <StaticImage
          alt="plane"
          height={150}
          src="../../../images/Travel-PNG-File-Download-Free 1.png"
        />
      </div>

      <StudyCountry />
      <Scholarship />

      <section className="mb-5">
        <div className="text-left px-8 mb-5">
          <span className="text-sky-600 text-xl font-black uppercase">
            Les dernières nouvelles
          </span>{" "}
          <div class="h-4 w-full border-b-2 border-sky-600"></div>
        </div>

        <NewsCard
          image={news_img2}
          title={"Titre de l'article"}
          desc={
            "Lorem ispum dolor fortuna simpre cresis, out decresis vita detastabilis Lorem ispum dolor fortuna simpre cresis, out decresis"
          }
        />
        <NewsCard
          image={news_img3}
          title={"Titre de l'article"}
          desc={
            "Lorem ispum dolor fortuna simpre cresis, out decresis vita detastabilis Lorem ispum dolor fortuna simpre cresis, out decresis"
          }
        />
        <NewsCard
          image={news_img4}
          title={"Titre de l'article"}
          desc={
            "Lorem ispum dolor fortuna simpre cresis, out decresis vita detastabilis Lorem ispum dolor fortuna simpre cresis, out decresis"
          }
        />
      </section>

      <section className="mb-5">
        <div className="text-center">
          <span className="text-sky-600 text-2xl font-black">
            Nos partenaires
          </span>{" "}
        </div>

        <div class="container relative z-40 mx-auto px-5 ">
          <div class="flex flex-wrap justify-center mx-auto lg:w-full md:w-5/6 xl:shadow-small-blue">
            <a href="#" class="block w-1/3 py-10 text-center lg:w-1/4">
              <div>
                <StaticImage
                  src="../../../images/logo_243.png"
                  class="block mx-auto"
                  alt="Logo"
                />
                <p class="pt-4 text-sm font-medium capitalize font-body text-green-900 lg:text-lg md:text-base md:pt-6">
                  243 technologies
                </p>
              </div>
            </a>

            <a href="#" class="block w-1/3 py-10 text-center lg:w-1/4">
              <div>
                <StaticImage
                  src="../../../images/logo.png"
                  class="block mx-auto"
                  alt="logo"
                />

                <p class="pt-4 text-sm font-medium capitalize font-body text-green-900 lg:text-lg md:text-base md:pt-6">
                  RDC Etudes
                </p>
              </div>
            </a>

            <a href="#" class="block w-1/3 py-10 text-center lg:w-1/4">
              <div>
                <StaticImage
                  src="../../../images/logo_243.png"
                  class="block mx-auto"
                  alt="logo"
                />

                <p class="pt-4 text-sm font-medium capitalize font-body text-green-900 lg:text-lg md:text-base md:pt-6">
                  243 technologies
                </p>
              </div>
            </a>
          </div>
        </div>
      </section>

      <section className="mb-5">
        <div className="text-center">
          <span className="text-sky-600 text-2xl font-black">Témoignages</span>{" "}
        </div>

        <div class="mx-6 mt-5 rounded-2xl px-5 py-7 bg-sky-600">
          <div className="z-10">
            <FontAwesomeIcon
              icon={faQuoteLeft}
              color="white"
              className="text-6xl opacity-25"
            />
          </div>
          <div className="z-20 -mt-7">
            <p className="text-center text-sm text-white">
              Lorem ispum dolor fortuna simpre cresis, out decresis vita
              detastabilis Lorem ispum dolor fortuna simpre cresis, out decresis
            </p>
            <p className="text-start text-white mt-4">Candidat X</p>
          </div>
        </div>
      </section>

      <ContactForm marginBottom={"mb-40"} />
    </Layout>
  );
};

export default Home;
