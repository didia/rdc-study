import * as React from "react";
import Layout from "../../../components/Layout";
import * as style from "./styles.module.scss";

import StudyCountry from "../../../components/StudyCountry";
import Scholarship from "../../../components/Scholarship";
import ContactForm from "../../../components/ContactForm";
import NewsCard from "../../NewsCard";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faQuoteLeft, faGraduationCap, faHandshake, faQuestion } from "@fortawesome/free-solid-svg-icons";
import { StaticImage } from "gatsby-plugin-image";
import SecondaryBtn from "../../Button/Secondary";
import PrimaryBtn from "../../Button/Primary";
import { AnimationOnScroll } from "react-animation-on-scroll";
import 'animate.css';

const Home = ({ guideCountries, articles, scholarships }) => {
  return (
    <Layout pageTitle="Page d'acceuil">
      <div className={"md:hidden " + style.firstSection}>
        <StaticImage
          className={style.firstSection__imgStudent}
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
            <div className="text-start">
              <div className="text-3xl text-white font-black uppercase mt-2 mb-4 font-['monserrat-bold']">
                Rdc etudes
              </div>
              <div className="text-lg text-white mb-2 font-['roboto-bold']">
                RDC ETUDES est une entreprise axée sur l'éducation qui a pour
                mission de faciliter l'accès à une éducation de qualité pour les
                étudiants africains francophones, que ce soit sur le continent
                ou à l'étranger
              </div>
              <div>
                <SecondaryBtn
                  fontSize={"text-sm"}
                  text={"Je veux une assistance"}
                />
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
            <p className="text-5xl text-sky-600 font-black font-['monserrat-bold']">
              Pourquoi RDC-Etudes ?
            </p>
            <p className="text-2xl my-4 font-['roboto']">
              RDC ETUDES est une entreprise axée sur l'éducation qui a pour
              mission de faciliter l'accès à une éducation de qualité pour les
              étudiants africains francophones, que ce soit sur le continent ou
              à l'étranger
            </p>
            <PrimaryBtn text={"Demander une assistance"} />

            <StaticImage
              alt="plane"
              className="-ml-32 -mt-20 -z-30"
              height={400}
              src="../../../images/png-clipart-black-airway-aviation-aircraft-removebg-preview.png"
            />
            <StaticImage
              alt="plane"
              height={200}
              src="../../../images/Travel-PNG-File-Download-Free 1.png"
            />
          </div>
        </div>

        <div className="-mt-28">
          <StaticImage
            height={1600}
            width={1800}
            placeholder="blurred"
            alt="Agence"
            src="../../../images/Agence-M-Com-Marseille-AppartStudy-Marne-Montpellier-Residence.png"
          />
        </div>
      </div>

      <AnimationOnScroll animateIn="animate__fadeInUp" animateOnce>
        <section className="md:hidden mb-2" id="mobileStudycountry">
          <div className="grid grid-cols-4 gap-2">
            <div className="">&nbsp;</div>
            <div className="">&nbsp;</div>
            <div className="">&nbsp;</div>
            <div className="">
              <StaticImage
                height={60}
                alt="plane"
                placeholder="blurred"
                src="../../../images/earth-with-plane-drawing-png.png"
              />
            </div>
          </div>

          <div className="grid grid-cols-8">
            <div className="col-span-3">
              <StaticImage
                alt="travelers"
                placeholder="blurred"
                src="../../../images/4564198_2400445 1.png"
              />
            </div>

            <div className="col-span-5">
              <span className="text-sky-600 text-2xl font-black font-['monserrat-bold']">
                Où souhaitez-vous étudier ?
              </span>{" "}
              <p className="font-['roboto'] mx-1 text-lg">
                Nous vous accompagnons à réaliser votre projet d'études dans les
                meilleurs universités du monde. L'accompgnement RDC Etudes
                consiste à vous orienter dans votre projet d'études tout en les
                orientant sur le plan académique et professionel.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="">
              <StaticImage
                height={80}
                placeholder="blurred"
                alt="plane"
                src="../../../images/pngtree-cartoon-paper-airplane-png-image_1195649-removebg-preview.png"
              />
            </div>
            <div className="">&nbsp;</div>
            <div className="">&nbsp;</div>
            <div className="">
              <StaticImage
                height={80}
                alt="tourist"
                placeholder="blurred"
                src="../../../images/Download_A_tourist_element_on_white_background_for_free-removebg-preview.png"
              />
            </div>
          </div>
        </section>
      </AnimationOnScroll>

      <AnimationOnScroll animateIn="animate__fadeInUp" animateOnce>
        <section className="hidden md:block" id="studycountry">
          <div className="grid grid-cols-4 gap-2">
            <div className="">&nbsp;</div>
            <div className="">&nbsp;</div>
            <div className="">&nbsp;</div>
            <div className="">
              <StaticImage
                height={60}
                alt="plane"
                placeholder="blurred"
                src="../../../images/earth-with-plane-drawing-png.png"
              />
            </div>
          </div>

          <div className="grid grid-cols-12">
            <div className="col-span-1"></div>
            <div className="col-span-5">
              <StaticImage
                alt="travelers"
                placeholder="blurred"
                src="../../../images/student.png"
                className="h-[26rem] w-[26rem]"
              />
            </div>

            <div className="col-span-6 py-16 mr-10">
              <span className="text-sky-600 font-black text-5xl">
                Où souhaitez-vous étudier ?
              </span>{" "}
              <p className="text-2xl py-6 font-['roboto']">
                Nous vous accompagnons à réaliser votre projet d'études dans les
                meilleurs universités du monde. L'accompgnement RDC Etudes
                consiste à vous orienter dans votre projet d'études tout en les
                orientant sur le plan académique et professionel.
              </p>
              <StaticImage
                className="h-32 w-32 float-right"
                alt="tourist"
                placeholder="blurred"
                src="../../../images/Download_A_tourist_element_on_white_background_for_free-removebg-preview.png"
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="">
              <StaticImage
                height={80}
                className="h-32 w-32 z-20 -mt-48"
                placeholder="blurred"
                alt="plane"
                src="../../../images/pngtree-cartoon-paper-airplane-png-image_1195649-removebg-preview.png"
              />
            </div>
            <div className="">&nbsp;</div>
            <div className="">&nbsp;</div>
            <div className=""></div>
          </div>
        </section>
      </AnimationOnScroll>
      <p className="text-2xl md:text-4xl font-black mx-10 text-sky-600 text-center py-4">
        Nous vous emmenons partout au monde
      </p>

      <p className="md:mx-28 mx-10 text-center md:text-2xl text-xl font-['roboto'] mb-10">
        Nous réalisons cette mission chaque jour en guidant et soutenant les
        étudiants dans la réalisation de leurs projets d'études tout en les
        orientant sur le plan académique et professionnel.
      </p>
      <StudyCountry guideCountries={guideCountries} />

      <div className="hidden md:grid md:grid-cols-12 mb-20">
        <div className="col-span-5 flex w-full h-full mt-10">
          <div className="-mt-28">
            <div className={style.ellipse__second}>
              <StaticImage
                alt="Ellipse 6"
                height={400}
                src="../../../images/Ellipse2.png"
              />
            </div>
          </div>

          <div className="-ml-[17rem] -mt-10 z-30">
            <StaticImage
              alt="plane"
              height={380}
              src="../../../images/png-clipart-black-airway-aviation-aircraft-removebg-preview.png"
            />
          </div>

          <div className="-ml-28">
            <AnimationOnScroll animateIn="animate__bounceInLeft" animateOnce>
              <StaticImage
                alt="plane"
                height={400}
                src="../../../images/lady_with_suitcase.png"
              />
            </AnimationOnScroll>
          </div>
        </div>

        <div className="col-span-7 flex">
          <div>
            <p className="text-5xl font-black text-sky-600 font-['monserrat-bold']">
              Bourses d'études
            </p>
            <p className="py-4 text-2xl mr-[15rem] font-['roboto']">
              Chez RDC ÉTUDES nous n’offrons malheureusement pas des bourses
              nous pouvons cependant vous assister à postuler pour la bourse de
              votre choix sans pour autant garantir l’obtention de celle-ci.
              Vous trouverez toutes les offres des bourses dont nous avons
              connaissance sur notre site web rdcetudes.com/bourses.
            </p>
          </div>
          <div className=" mt-40">
            <StaticImage
              alt="plane"
              className="absolute right-0"
              height={300}
              src="../../../images/Ellipse1.png"
            />

            <div className="absolute right-10">
              <AnimationOnScroll animateIn="animate__bounceInRight" animateOnce>
                <StaticImage
                  alt="plane"
                  className=""
                  height={280}
                  src="../../../images/Young-Girl-Student-HD-Free-PNG-Image 1.png"
                />
              </AnimationOnScroll>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mx-3 mb-7 md:hidden">
        <div class="inline-flex rounded-md shadow-sm " role="group">
          <a
            href="/bourse"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-transparent border border-gray-900 rounded-s-lg hover:bg-sky-600 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700"
          >
            <FontAwesomeIcon
              icon={faGraduationCap}
              className="text-yellow-600 h-5"
            />
            Je veux une bourse
          </a>
          <a
            href="/help"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-transparent border-t border-b border-gray-900 hover:bg-sky-600 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700"
          >
            <FontAwesomeIcon
              icon={faHandshake}
              className="text-yellow-600 h-5"
            />
            Je veux une consultation
          </a>
          <a
            href="/help"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-transparent border border-gray-900 rounded-e-lg hover:bg-sky-600 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700"
          >
            <FontAwesomeIcon
              icon={faQuestion}
              className="text-yellow-600 h-5"
            />
            Je veux une assistance
          </a>
        </div>
      </div>
      <Scholarship scholarships={scholarships} />

      <p className="text-center mb-10 md:hidden">
        <SecondaryBtn
          link={"/bourse"}
          fontSize={"text-sm"}
          text={"Pour quelle bourse souhaitez-vous être assisté ?"}
        >
          <i className="px-2">
            <FontAwesomeIcon icon={faArrowRight} />
          </i>
        </SecondaryBtn>
      </p>

      <AnimationOnScroll animateIn="animate__fadeInUp" animateOnce>
        <section className="mb-5 md:mx-32 md:mt-20">
          <div className="text-left px-8 mb-5">
            <span className="text-sky-600 text-xl font-black uppercase md:text-2xl font-['monserrat-bold']">
              Les dernières nouvelles
            </span>{" "}
            <div className="h-4 w-full border-b-2 border-sky-600"></div>
          </div>

          {articles.map((article) => {
            return (
              <NewsCard
                key={article.frontmatter.title}
                ItemData={article.frontmatter}
              />
            );
          })}
        </section>
      </AnimationOnScroll>

      <section className="mb-5 mt-12 md:mt-16">
        <div className="text-center md:mb-10">
          <span className="text-sky-600 text-2xl font-black md:text-4xl font-['monserrat-bold']">
            Nos partenaires
          </span>{" "}
        </div>

        <AnimationOnScroll animateIn="animate__fadeInRight" animateOnce>
          <div className="container relative z-40 mx-auto ">
            <div className="grid grid-cols-3 md:grid-cols-4 py-6 text-center md:mx-10">
              <div>
                <a href="/article/faire-une-formation-professionnelle-institut-a-l-institut-africain-de-haute-formation">
                  <StaticImage
                    src="../../../images/iahf.png"
                    className="block mx-auto"
                    placeholder="blurred"
                    alt="logo"
                    height={90}
                    objectFit="contain"
                  />

                  <p className=" text-xs font-medium capitalize font-body text-green-900 lg:text-lg md:text-base md:pt-6 font-['roboto-bold']">
                    INSTITUT AFRICAIN DE HAUTE FORMATION (TUNISIE)
                  </p>
                </a>
              </div>

              <div className="mt-4">
                <a href="/article/faites-une-formation-professionnelle-de-qualite-chez-excelia">
                  <StaticImage
                    src="../../../images/excelia.png"
                    className="block mx-auto"
                    placeholder="blurred"
                    alt="Logo"
                    height={90}
                    objectFit="contain"
                  />
                  <p className="pt-10 text-xs font-medium capitalize font-body text-green-900 lg:text-lg md:text-base md:pt-6 font-['roboto-bold']">
                    EXCELIA GROUP (FRANCE)
                  </p>
                </a>
              </div>

              <div>
                <a href="/article/choisissez-medipol-university-pour-une-education-de-qualite-en-turquie">
                  <StaticImage
                    src="../../../images/medipol.jpg"
                    className="block mx-auto"
                    placeholder="blurred"
                    alt="logo"
                    height={90}
                    objectFit="contain"
                  />

                  <p className="text-xs font-medium capitalize font-body text-green-900 lg:text-lg md:text-base md:pt-6 font-['roboto-bold']">
                    UNIVERSITE MEDIPOL D'ISTANBUL (TURQUIE)
                  </p>
                </a>
              </div>

              <div className="hidden md:flex">
                <a href="/article/choisissez-medipol-university-pour-une-education-de-qualite-en-turquie">
                  <StaticImage
                    src="../../../images/universite_de_lefke.webp"
                    className="block mx-auto"
                    placeholder="blurred"
                    alt="logo"
                    height={90}
                    objectFit="contain"
                  />

                  <p className="text-xs font-medium capitalize font-body text-green-900 lg:text-lg md:text-base md:pt-6">
                    UNIVERSITE EUROPEENNE DE LEFKE EN CHYPRE DU NORD
                  </p>
                </a>
              </div>
            </div>
          </div>
        </AnimationOnScroll>
      </section>

      <section className="mb-5 mt-12 md:mt-16">
        <div className="text-center md:py-10">
          <span className="text-sky-600 text-2xl font-black md:text-4xl font-['monserrat-bold']">
            Témoignages
          </span>{" "}
        </div>

        <div className="hidden md:grid md:grid-cols-3 gap-4 mx-10">
          <div className="rounded-2xl h-[300px] px-5 py-7 bg-sky-600">
            <div className="z-10">
              <FontAwesomeIcon
                icon={faQuoteLeft}
                color="white"
                className="text-6xl opacity-25"
              />
            </div>
            <div className="z-20 -mt-7">
              <p className="text-center text-sm md:text-xl text-white font-['roboto']">
                Lorem ispum dolor fortuna simpre cresis, out decresis vita
                detastabilis Lorem ispum dolor fortuna simpre cresis, out
                decresis
              </p>
              <p className="text-start text-white mt-20 md:text-lg font-['roboto-bold']">
                Candidat X
              </p>
            </div>
          </div>

          <div className="rounded-2xl h-[300px] px-5 py-7 bg-sky-600">
            <div className="z-10">
              <FontAwesomeIcon
                icon={faQuoteLeft}
                color="white"
                className="text-6xl opacity-25"
              />
            </div>
            <div className="z-20 -mt-7">
              <p className="text-center text-sm text-white md:text-xl font-['roboto']">
                Lorem ispum dolor fortuna simpre cresis, out decresis vita
                detastabilis Lorem ispum dolor fortuna simpre cresis, out
                decresis
              </p>
              <p className="text-start text-white mt-20 md:text-lg">
                Candidat X
              </p>
            </div>
          </div>
          <div className="rounded-2xl h-[300px] px-5 py-7 bg-sky-600">
            <div className="z-10">
              <FontAwesomeIcon
                icon={faQuoteLeft}
                color="white"
                className="text-6xl opacity-25"
              />
            </div>
            <div className="z-20 -mt-7">
              <p className="text-center text-sm text-white md:text-xl font-['roboto']">
                Lorem ispum dolor fortuna simpre cresis, out decresis vita
                detastabilis Lorem ispum dolor fortuna simpre cresis, out
                decresis
              </p>
              <p className="text-start text-white mt-20 md:text-lg">
                Candidat X
              </p>
            </div>
          </div>
        </div>

        <div className="md:hidden mx-6 mt-5 rounded-2xl px-5 py-7 bg-sky-600">
          <div className="z-10">
            <FontAwesomeIcon
              icon={faQuoteLeft}
              color="white"
              className="text-6xl opacity-25"
            />
          </div>
          <div className="z-20 -mt-7">
            <p className="text-center text-sm text-white font-['roboto-bold']">
              Lorem ispum dolor fortuna simpre cresis, out decresis vita
              detastabilis Lorem ispum dolor fortuna simpre cresis, out decresis
            </p>
            <p className="text-start text-white mt-4 font-['roboto-bold']">
              Candidat X
            </p>
          </div>
        </div>
      </section>

      <ContactForm marginBottom={"mb-40"} />
    </Layout>
  );
};

export default Home;
