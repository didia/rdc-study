import React from "react";
import Layout from "../../Layout";
import HtmlContent from "../../HtmlContent"
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { Carousel } from "flowbite-react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faGlobe, faGraduationCap } from "@fortawesome/free-solid-svg-icons";
import ScholarShipCard from "../../Scholarship/ScholarShipCard";

const ScholarShipDetails = ({ bourse, content, otherScholarShips }) => {
  const image = getImage(bourse.thumbnail);

  return (
    <Layout pageTitle={"Détails sur la bourse d'études"}>
      <section>
        <div className="grid grid-cols-1 mx-4 py-3">
          <div>
            <GatsbyImage image={image} alt={bourse.title} />
          </div>
        </div>
        <div className="mx-4">
          <p className="text-sky-600 text-xl font-bold text-start">
            {bourse.title}
          </p>
          <p className="py-3 text-sm">{bourse.excerpt}</p>
          <div className="grid grid-cols-3">
            <div className="text-sm">
              {" "}
              <FontAwesomeIcon icon={faGlobe} /> Canada
            </div>
            <div className="inline text-sm">
              {" "}
              <FontAwesomeIcon icon={faClock} />
              <span className="px-2">Doctorat, Recherche</span>
            </div>
            <div className="text-sm">
              {" "}
              <FontAwesomeIcon icon={faGraduationCap} />
              <span className="px-2 text-red-600">Expire en Décembre</span>
            </div>
          </div>
        </div>

        <div className="mx-4">
          <HtmlContent content={content} />
        </div>
      </section>

      <section className="mx-4 mb-10">
        <div className="text-sky-600 text-lg font-black absolute mt-10 uppercase">
          Autres Bourses
        </div>
        <div className="h-20 border-b-2 border-sky-600"></div>
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
