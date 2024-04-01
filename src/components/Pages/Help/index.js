import React, { useEffect } from "react";
import Layout from "../../Layout";
import * as styles from "./styles.module.scss";
import { StaticImage } from "gatsby-plugin-image";
import { AnimationOnScroll } from "react-animation-on-scroll";
import "animate.css";
import PrimaryBtn from "../../Button/Primary";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReply } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const Help = () => {
  const countryServices = [
    {
      country: 'Allemagne',
      services: [
        'Cours de langue', 
        'Proposition des universites', 
        'Admission',
        'Visa',
        'Logement',
        'Achat Billet'
      ]
    },
    {
      country: 'Belgique',
      services: [
        'Equivalence des diplômes', 
        'Admission', 
        'Lettre de motivation',
        'Remplissage des formulaires',
        'Visa',
        'Constitution des documents',
        'Prise de rendez-vous à l\'ambassade',
        'Interview à l\'ambassade',
        'Logement',
        'Achat Billet'
      ]
    },
    {
      country: 'Brésil',
      services: [
        'Cours de langue', 
        'Proposition des universites', 
        'Admission',
        'Visa',
        'Logement',
        'Achat Billet'
      ]
    },
    {
      country: 'Canada',
      services: [
        'Proposition des universites', 
        'Admission',
        'CAQ',
        'Permis d\'études et visa',
        'Remplissage des formulaires',
        'Lettre de motivation',
        'Lettre explicative',
        'Lettre d’engagement',
        'Refus admission',
        'Logement',
        'Achat Billet'
      ]
    },
    {
      country: 'Chypre du Nord',
      services: [
        'Traduction des documents', 
        'Proposition des universités',
        'Admission',
        'Paiement Acompte',
        'Logement',
        'Achat Billet'
      ]
    },
    {
      country: 'France',
      services: [
        'Campus France', 
        'Proposition des universités',
        'Admission',
        'Projet d\'études',
        'CVEC',
        'Visa'
      ]
    },
    {
      country: 'Roumanie',
      services: [
        'Traduction des documents', 
        'Propositions des universites',
        'Admission',
        'Paiement Acompte',
        'Examens medicaux',
        'Visa',
        'Logement'
      ]
    },
    {
      country: 'Turquie',
      services: [
        'Traduction des documents', 
        'Propositions des universites',
        'Admission',
        'Paiement Acompte',
        'Examens medicaux',
        'Visa',
        'Logement'
      ]
    },
    {
      country: 'USA',
      services: [
        'Traduction des documents', 
        'Propositions des universites',
        'Admission',
        'Remplissage des formulaires',
        'Interview ambassade',
        'Visa',
        'Achat billet',
        'Logement'
      ]
    }
  ]
  const [country, setCountry] = useState('');
  const [services, setServices] = useState(countryServices[0].services);

  return (
    <Layout pageTitle={"Page d'aide"}>
      <section className="mb-7 md:hidden">
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-5">
            <div className={styles.ellipse__first}>
              <StaticImage
                alt="tourist"
                height={150}
                src="../../../images/Free-Photo-Tourist-runningfast.png"
              />
            </div>
            <div className={styles.ellipse__second}>
              <StaticImage
                height={160}
                alt="plane"
                src="../../../images/png-clipart-black-airway-aviation-aircraft-removebg-preview.png"
              />
            </div>
          </div>
          <div className="col-span-5 text-sky-600 text-lg font-extrabold z-10 mt-10">
            Pour quel pays souhaitez-vous être consulté ?
            <p>
              <StaticImage
                height={50}
                alt="world"
                className="float-right"
                src="../../../images/Download_A_tourist_element_on_white_background_for_free-removebg-preview.png"
              />
            </p>
          </div>
          <div className="col-span-2">
            <StaticImage
              alt="plane"
              src="../../../images/earth-with-plane-drawing-png.png"
            />
          </div>
        </div>

        <div
          className="w-full mt-20 py-16 text-center text-white text-base px-12 font-['roboto-bold']"
          style={{ backgroundColor: "#862304" }}
        >
          RDC ETUDES vous offre des services de consultation qui vous permet de
          discuter avec un mentor sur l'état de votre projet d'études. Vous êtes
          bloqué(e)? Vous ne savez par où commencer ? Nos mentors seront ravis
          de vous aider a y voir un peu plus clair !
          <div className=" bg-yellow-600 text-white mt-4 py-4 text-lg font-['roboto']">
            Prix de consultation :{" "}
            <span className="text-white font-bold"> 30 $ </span>
          </div>
        </div>

        <div className=" mt-16 mb-20 border rounded-lg px-5 py-7 mx-2 shadow-md">
          <div className="inline-block relative w-full py-5">
            <select
              placeholder="Mentionnez le pays"
              className="mt-5 block text-base h-12 appearance-none w-full bg-white border-2 border-black hover:border-gray-500 py-2 pr-8 rounded-lg shadow focus:outline-none focus:shadow-outline"
            >
              {countryServices.map((countryService) => {
                return (
                  <option
                    onClick={(e) => {
                      setCountry(e.target.value);
                      setServices(countryService.services);
                    }}
                    value={countryService.country}
                    key=""
                  >
                    {countryService.country}
                  </option>
                );
              })}
            </select>
          </div>

          <p className="uppercase text-center text-sm">
            Pour quel service souhaitez-vous être consulté(e) ?
          </p>

          <div className="inline-block relative w-full py-5">
            <select
              placeholder="Selectionner le service"
              className="mt-5 block h-12 appearance-none w-full bg-white border-2 border-black hover:border-gray-500 px-4 py-2 pr-8 rounded-lg shadow leading-tight focus:outline-none focus:shadow-outline"
            >
              {services.map((item, i) => {
                return (
                  <option value={item} key={i}>
                    {item}
                  </option>
                );
              })}
            </select>
          </div>

          <PrimaryBtn text={"Soumettre"} />
        </div>
      </section>

      <section className="hidden md:block">
        <div className="grid grid-cols-12 mt-72">
          <div className="col-span-5">
            <div className={styles.ellipse__first}>
              <AnimationOnScroll animateIn="animate__bounceInLeft">
                <StaticImage
                  alt="tourist"
                  height={450}
                  src="../../../images/Free-Photo-Tourist-runningfast.png"
                />
              </AnimationOnScroll>
            </div>
            <div className={styles.ellipse__second}>
              <StaticImage
                height={450}
                alt="plane"
                src="../../../images/png-clipart-black-airway-aviation-aircraft-removebg-preview.png"
              />
            </div>
          </div>
          <div className="col-span-5 text-sky-600 text-2xl font-['monserrat'] z-10 -mt-24 -ml-40">
            RDC ETUDES vous offre des services de consultation qui vous permet
            de discuter avec un mentor sur l'état de votre projet d'études. Vous
            êtes bloqué(e)? Vous ne savez par où commencer ? Nos mentors seront
            ravis de vous aider a y voir un peu plus clair!
          </div>
          <div className="col-span-2">
            <StaticImage
              alt="plane"
              src="../../../images/earth-with-plane-drawing-png.png"
            />
          </div>
        </div>

        <div className="bg-[#862304] h-72 w-full text-center text-white text-3xl font-['roboto'] px-44 py-12">
          Pour quel pays souhaitez-vous être consulté(e) ?
          <p className="mt-2">
            <br />
            <div className=" bg-yellow-600 text-white py-4 mx-7 ml-auto mr-auto w-[20rem] text-2xl font-['roboto']">
              Prix de consultation :{" "}
              <span className="text-white font-bold"> 30 $ </span>
            </div>
          </p>
        </div>

        <div className="mb-32 mt-28 border rounded-lg px-5 mx-[27rem] py-7 shadow-md">
          <div className="inline-block relative w-full py-5">
            <select
              placeholder="Mentionnez le pays"
              className="mt-5 block h-16 appearance-none w-full bg-white border-2 border-black hover:border-gray-500 px-4 py-2 pr-8 rounded-lg shadow leading-tight focus:outline-none focus:shadow-outline"
            >
              {countryServices.map((countryService) => {
                return (
                  <option
                    onClick={(e) => {
                      setCountry(e.target.value);
                      setServices(countryService.services);
                    }}
                    value={countryService.country}
                    key=""
                  >
                    {countryService.country}
                  </option>
                );
              })}
            </select>
          </div>

          <p className="uppercase text-center text-xl">
            Pour quel service souhaitez-vous être consulté(e) ?
          </p>

          <div className="inline-block relative w-full py-5">
            <select
              placeholder="Selectionner le service"
              className="mt-5 block h-16 appearance-none w-full bg-white border-2 border-black hover:border-gray-500 px-4 py-2 pr-8 rounded-lg shadow leading-tight focus:outline-none focus:shadow-outline"
            >
              {services.map((item, i) => {
                return (
                  <option value={item} key={i}>
                    {item}
                  </option>
                );
              })}
            </select>
          </div>

          <PrimaryBtn text={"Soumettre"} />
        </div>
      </section>
    </Layout>
  );
};

export default Help;
