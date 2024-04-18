import React from "react";
import Layout from "../../Layout";
import BourseCard from "../../BourseCard";
import { StaticImage } from "gatsby-plugin-image";
import HtmlContent from "../../HtmlContent"
import { GatsbyImage, getImage } from "gatsby-plugin-image";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faGlobe, faGraduationCap } from "@fortawesome/free-solid-svg-icons";

const BourseDetails = ({ bourse, content }) => {
   const image = getImage(bourse.thumbnail);
 
  return (
    <Layout pageTitle={"Détails sur la bourse d'études"}>
      <section>
        <div className="grid grid-cols-1 mx-6 py-3">
          <div>
            <GatsbyImage image={image} alt={bourse.title} />
          </div>
        </div>
        <div className="mx-6">
          <p className="text-[#4bb4d4] text-xl font-bold text-start">
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

        <div className="mx-6">
          <HtmlContent content={content} />
        </div>
      </section>
    </Layout>
  );
};

export default BourseDetails;
