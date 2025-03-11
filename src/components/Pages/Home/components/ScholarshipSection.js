import React from "react";
import { Banner } from "flowbite-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";
import { StaticImage } from "gatsby-plugin-image";
import { AnimationOnScroll } from "react-animation-on-scroll";

const ScholarshipSection = () => {
  return (
    <div className="hidden md:grid md:grid-cols-12 mb-20">
      <div className="col-span-5 flex w-full h-full mt-10">
        <div className="-mt-28">
          <div>
            <StaticImage
              alt="Ellipse 6"
              height={400}
              src="../../../../images/Ellipse2.png"
            />
          </div>
        </div>

        <div className="-ml-[17rem] -mt-10 z-30">
          <StaticImage
            alt="plane"
            height={380}
            src="../../../../images/png-clipart-black-airway-aviation-aircraft-removebg-preview.png"
          />
        </div>

        <div className="-ml-28">
          <AnimationOnScroll animateIn="animate__bounceInLeft" animateOnce>
            <StaticImage
              alt="plane"
              height={400}
              src="../../../../images/lady_with_suitcase.png"
            />
          </AnimationOnScroll>
        </div>
      </div>

      <div className="col-span-7 flex">
        <div>
          <p className="text-4xl font-medium text-[#4bb4d4] font-['monserrat']">
            Bourses d'études
          </p>
          <p className="py-4 text-xl mr-[15rem] font-['roboto']">
            Chez RDC ÉTUDES nous n'offrons malheureusement pas des bourses nous
            pouvons cependant vous assister à postuler pour la bourse de votre
            choix sans pour autant garantir l'obtention de celle-ci. Vous
            trouverez toutes les offres des bourses dont nous avons connaissance
            dans la section Bourses d'études
          </p>

          <div>
            <Banner className="mb-5 w-[37rem]">
              <div className="flex mt-10 justify-between border-b-2 border-gray-300 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700">
                <div className="mx-auto flex items-center">
                  <p className="flex items-center text-base font-['roboto'] font-normal text-red-700 dark:text-gray-400">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="mr-4 h-8 w-8"
                    />
                    <span className="[&_p]:inline">
                      J'ai compris, j'aimerais quand même être assisté(e) pour
                      la bourse
                    </span>
                  </p>
                </div>
              </div>
            </Banner>
            <Banner className="w-[37rem]">
              <div className="flex justify-between border-b-2 border-gray-300 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700">
                <div className="mx-auto flex items-center">
                  <p className="flex items-center text-base font-['roboto'] font-normal text-cyan-600 dark:text-gray-400">
                    <FontAwesomeIcon
                      icon={faQuestionCircle}
                      className="mr-4 h-8 w-8"
                    />
                    <span className="[&_p]:inline">
                      Pour quelle bourse souhaitez-vous être assisté(e) ?
                    </span>
                  </p>
                </div>
              </div>
            </Banner>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipSection;
