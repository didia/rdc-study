import React from "react";
import Layout from "../../Layout";
import HtmlContent from "../../HtmlContent"
import { GatsbyImage, getImage } from "gatsby-plugin-image";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faClock, faGlobe, faGraduationCap } from "@fortawesome/free-solid-svg-icons";
import ScholarShipCard from "../../Scholarship/ScholarShipCard";
import { AnimationOnScroll } from "react-animation-on-scroll";
import "animate.css";
import { Button, Carousel } from "flowbite-react";

const ScholarShipDetails = ({ bourse, content, otherScholarShips }) => {
  const image = getImage(bourse.thumbnail);
  const LEVEL_ORDERS = [
    "undergraduate",
    "graduate",
    "postgraduate",
    "research",
    "internship",
  ];

  return (
    <Layout pageTitle={"Détails sur la bourse d'études"}>
      <section className="md:hidden">
        <div className="grid grid-cols-1 mx-4 py-3">
          <div>
            <GatsbyImage image={image} alt={bourse.title} />
          </div>
        </div>
        <div className="mx-4">
          <p className="text-sky-600 text-xl font-['roboto-bold'] text-start">
            {bourse.title}
          </p>
          <p className="py-3 text-sm font-['roboto']">{bourse.excerpt}</p>
          <div className="grid grid-cols-3">
            <div className="text-sm font-['roboto']">
              {" "}
              <FontAwesomeIcon icon={faGlobe} /> Canada
            </div>
            <div className="inline text-sm font-['roboto']">
              {" "}
              <FontAwesomeIcon icon={faClock} />
              <span className="px-2">Doctorat, Recherche</span>
            </div>
            <div className="text-sm font-['roboto']">
              {" "}
              <FontAwesomeIcon icon={faGraduationCap} />
              <span className="px-2 text-red-600">Expire en Décembre</span>
            </div>
          </div>
        </div>

        <div className="mx-4">
          <HtmlContent content={content} htmlclassName={"font-['roboto']"} />
        </div>
      </section>

      <section className="hidden md:block">
        <div className="grid grid-cols-1">
          <GatsbyImage image={image} className="w-full" alt={bourse.title} />
        </div>
        <div className="mx-4 py-3">
          <p className="text-sky-600 font-['font-roboto'] text-2xl font-bold text-start">
            {bourse.title}
          </p>
          <p className="py-3 text-xl font-['roboto']">{bourse.excerpt}</p>
          <div className="flex justify-around">
            <div className="text-xl font-['roboto']">
              {" "}
              <FontAwesomeIcon icon={faGlobe} /> Canada
            </div>
            <div className="inline text-xl font-['roboto']">
              {" "}
              <FontAwesomeIcon icon={faClock} />
              <span className="px-2">Doctorat, Recherche</span>
            </div>
            <div className="text-xl font-['roboto']">
              {" "}
              <FontAwesomeIcon icon={faGraduationCap} />
              <span className="px-2 text-red-600">Expire en Décembre</span>
            </div>
          </div>
        </div>

        <div className="py-8 mx-4">
          <HtmlContent content={content} htmlclassName={"text-xl font-['roboto']"} />
        </div>
      </section>

      <section className="mx-4 mb-10 md:hidden">
        <div className="text-sky-600 text-lg font-['roboto-bold'] font-black absolute mt-10 uppercase">
          Autres Bourses
        </div>
        <div className="h-20 border-b border-sky-600"></div>
        <div className="">
          {otherScholarShips.map((otherScholarShip) => {
            return (
              <div className="py-3">
                <ScholarShipCard scholarship={otherScholarShip} />
              </div>
            );
          })}
        </div>
      </section>

    </Layout>
  );
};

export default ScholarShipDetails;
