import React from "react";
import Layout from "../../Layout";
import SecondaryBtn from "../../Button/Secondary"
import PrimaryBtn from "../../Button/Primary";
import * as styles from "./styles.module.scss";
import { StaticImage } from "gatsby-plugin-image";
import ScholarShipCard from "../../Scholarship/ScholarShipCard";
import _ from "lodash";
import { AnimationOnScroll } from "react-animation-on-scroll";
import 'animate.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap, faDollarSign, faEdit, faCalendarDay } from "@fortawesome/free-solid-svg-icons";
import { Button } from "flowbite-react";

const Bourse = ({ scholarships }) => {
  const LEVEL_ORDERS = [
    "undergraduate",
    "graduate",
    "postgraduate",
    "research",
    "internship",
  ];
  const limitedScholarShips = _.filter(
    scholarships,
    (guideCountry, index) => index <= 3
  );

  return (
    <Layout pageTitle={"Bourse d'études"}>
      <section className="md:hidden">
        <div className="flex justify-start w-full z-5 absolute">
          <div className="text-start mx-10 z-10">
            <span
              className={
                styles.bourse__title + " font-['monserrat-bold'] uppercase"
              }
            >
              Bourses d'études
            </span>{" "}
            <p className="mt-4">
              <span className="text-base font-['roboto']">
                Chez RDC Etudes nous n'offrons malheuresement pas des bourses,
                nous pouvons cependant vous assister à postuler pour la bourse
                de votre choix sans pour autant garantir l'obtention de
                celle-ci.
              </span>
              <br />
              <br />

              <SecondaryBtn
                fontSize={"text-base"}
                text={"Demander une assistance"}
              />
            </p>
          </div>
        </div>

        <div className="w-full h-full mt-10">
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
            <AnimationOnScroll animateIn="animate__bounceInRight" animateOnce>
              <StaticImage
                alt="Ellipse"
                height={130}
                src="../../../images/Young-Girl-Student-HD.png"
              />
            </AnimationOnScroll>
          </div>
        </div>

        <div className="text-sky-600 text-2xl font-['roboto-bold'] mx-10 mt-7 mb-5 text-center">
          Pour quelle bourse souhaitez-vous être assisté (e) ?
        </div>
      </section>

      <section className="hidden md:block">
        <div className="hidden md:flex">
          <div className="flex w-full h-full mt-10">
            <div className="-mt-28">
              <div className={styles.ellipse__second}>
                <StaticImage
                  alt="Ellipse 6"
                  height={350}
                  className="-z-40"
                  src="../../../images/Ellipse12.png"
                />
                <StaticImage
                  alt="plane"
                  className="-z-40 -ml-[28rem] absolute"
                  height={380}
                  src="../../../images/Ellipse10.png"
                />
                <StaticImage
                  alt="Ellipse 6"
                  height={600}
                  className="-z-50 -ml-[26rem] mt-4"
                  src="../../../images/png-clipart-black-airway-aviation-aircraft-removebg-preview4.png"
                />
              </div>
            </div>
          </div>

          <div className="flex -ml-[23rem] mt-[5rem]">
            <div>
              <p className="text-6xl font-black text-sky-600">
                Bourses d'études
              </p>
              <p className="py-4 text-xl mr-[35rem] font-['roboto']">
                Chez RDC Etudes nous n'offrons malheuresement pas des bourses,
                nous pouvons cependant vous assister à postuler pour la bourse
                de votre choix sans pour autant garantir l'obtention de
                celle-ci. Vous trouverez toutes les offres des bourses dont nous
                avons connaissance sur notre{" "}
                <a href="/bourse" className="text-yellow-600">
                  site web
                </a>
              </p>
              <PrimaryBtn
                href={"/help"}
                text={"Demander une assistance"}
                fontSize={"text-2xl"}
              />
            </div>
          </div>

          <div className="mt-40 flex">
            <div className="flex">
              <StaticImage
                alt="plane"
                className="absolute right-0 top-0 -z-50"
                height={700}
                src="../../../images/Ellipse13.png"
              />
            </div>
            <div className="absolute right-10 -mt-24">
              <AnimationOnScroll animateIn="animate__bounceInRight" animateOnce>
                <StaticImage
                  alt="plane"
                  height={500}
                  src="../../../images/Young-Girl-Student-HD-Free-PNG-Image 1.png"
                />
              </AnimationOnScroll>
            </div>
          </div>
        </div>
        <div className="mt-10">
          <AnimationOnScroll animateIn="animate__bounceInLeft" animateOnce>
            <StaticImage
              alt="Ellipse 6"
              height={300}
              src="../../../images/Travel-Icon-Transparent-Background.png"
            />
          </AnimationOnScroll>
        </div>
      </section>

      <section className="md:hidden px-4">
        
      </section>
      <AnimationOnScroll animateIn="animate__fadeInUp" animateOnce>
        <section className="px-4 mb-10 md:hidden">
          {scholarships.map((scholarship) => {
            return (
              <div className="">
                {" "}
                <ScholarShipCard scholarship={scholarship} />
              </div>
            );
          })}
        </section>
      </AnimationOnScroll>

      <div className="hidden md:block mb-20 ml-20">
        <div class="p-2 w-[700px] bg-white border flex border-gray-400 rounded-3xl shadow sm:p-4 dark:bg-gray-800 dark:border-gray-700">
          <div className="">
            <h5 class="mb-2 text-2xl font-bold font-['roboto-bold'] uppercase">
              Titre de la bourse
            </h5>
            <p class="text-base font-['roboto-bold']">
              Stay up to date and move work forward with Flowbite on iOS &
              Android. Download the app today.
            </p>
            <p className="text-yellow-600 text-base">
              West Point, United States
            </p>

            <div className="py-4">
              <ul className="ml-5 text-base">
                <li>
                  <FontAwesomeIcon icon={faGraduationCap} />
                  &nbsp;&nbsp; Bachelor's{" "}
                </li>
                <li>
                  <FontAwesomeIcon icon={faDollarSign} />
                  &nbsp;&nbsp;&nbsp; Full Funding{" "}
                </li>
                <li>
                  <FontAwesomeIcon icon={faEdit} />
                  &nbsp;&nbsp; All Subjects
                </li>
                <li>
                  <FontAwesomeIcon icon={faCalendarDay} />
                  &nbsp;&nbsp; Deadline: January 31, 2024{" "}
                </li>
              </ul>
            </div>
          </div>

          <div className="ml-16">
            <p className=" text-red-800 font-bold font-['roboto'] uppercase">
              Aucune date limite
            </p>

            <div className=" mt-40 uppercase">
              <Button href={`/`}>Voir détails</Button>
            </div>
          </div>
        </div>
      </div>

      <section className="bg-gray-200 py-5 hidden md:block">
        <AnimationOnScroll animateIn="animate__fadeInUp">
          <div className="grid grid-cols-4 mx-8 py-10 gap-3">
            {limitedScholarShips.map((scholarship) => {
              return (
                <div className="">
                  {" "}
                  <ScholarShipCard scholarship={scholarship} />
                </div>
              );
            })}
          </div>
        </AnimationOnScroll>

        <a href="#" className="text-sky-600 text-2xl font-bold px-10">
          Voir plus
        </a>
      </section>
    </Layout>
  );
};

export default Bourse;
