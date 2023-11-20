import React from "react";
import { faUserGraduate } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as styles from "./styles.module.scss";

const BourseCard = ({ img, setDescription=true, textSize }) => {
  return (
    <>
      <div class="max-w-sm rounded-md overflow-hidden shadow-lg bg-gray-200">
        <img class="w-full" src={img} alt="Sunset in the mountains" />
        <div class="mx-2 py-2">
          <div class={"font-bold mb-2 text-sky-600 text-xl"}>
            Bourse d'études
          </div>
          {setDescription && (
            <p class="text-gray-700 text-sm">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            </p>
          )}
        </div>

        <p
          class={
            "px-2 text-black font-medium " + styles.bourse_card__sub_description
          }
        >
          <FontAwesomeIcon icon={faUserGraduate} /> Tous les niveaux académiques
        </p>
        {setDescription && (
          <div class="px-2 pt-2">
            <span class="inline-block rounded-full py-1 text-sm font-semibold text-sky-600 mb-2">
              Détails
            </span>
          </div>
        )}
      </div>
    </>
  );
};

export default BourseCard;
