import React from "react";
import { faUserGraduate } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as styles from "./styles.module.scss";
import { StaticImage } from "gatsby-plugin-image";

const BourseCard = ({ setDescription=true, textSize }) => {
  const titleClass = setDescription
    ? "font-bold mb-2 text-sky-600 text-xl"
    : "font-bold mb-2 text-sky-600 text-lg";

  return (
    <>
      <div className="max-w-sm rounded-md overflow-hidden shadow-lg bg-gray-200">
        <StaticImage
          src="../../images/800x600_FE_WEB_equivalence 2.jpg"
          alt="Sunset in the mountains"
          className="w-full"
        />
        <div className="mx-2 py-2">
          <div className={titleClass}>Bourse d'études</div>
          {setDescription && (
            <p className="text-gray-700 text-sm">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            </p>
          )}
        </div>

        <p
          className={
            "px-2 text-black font-medium " + styles.bourse_card__sub_description
          }
        >
          <FontAwesomeIcon icon={faUserGraduate} /> Tous les niveaux académiques
        </p>
        {setDescription && (
          <div className="px-2 pt-2">
            <span className="inline-block rounded-full py-1 text-sm font-semibold text-sky-600 mb-2">
              Détails
            </span>
          </div>
        )}
      </div>
    </>
  );
};

export default BourseCard;
