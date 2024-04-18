import React from 'react';
import * as style from "./styles.module.scss";
import { Carousel, Card } from 'flowbite-react';
import { StaticImage, GatsbyImage, getImage } from 'gatsby-plugin-image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faGraduationCap, faCheckCircle, faQuestionCircle, faClose, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import _ from "lodash";
import { Banner } from 'flowbite-react';

const Scholarship = ({ scholarships }) => {
    const limitedScholarShips = _.filter(
      scholarships,
      (guideCountry, index) => index < 3
    );

  const substring = (val) => {
    return val.substring(0, 100) + "...";
  };
const LEVEL_ORDERS = [
  "undergraduate",
  "graduate",
  "postgraduate",
  "research",
  "internship",
];

  return (
    <>
      <section className="mb-5">
        <div className="text-center mx-3 mb-3 md:hidden">
          <span className="text-[#4bb4d4] text-2xl font-semibold font-['monserrat']">
            Bourses d'études
          </span>{" "}
          <p className="font-['roboto'] mt-3">
            Chez RDC ÉTUDES nous n’offrons malheureusement pas des bourses nous
            pouvons cependant vous assister à postuler pour la bourse de votre
            choix sans pour autant garantir l’obtention de celle-ci. Vous
            trouverez toutes les offres des bourses dont nous avons connaissance
            dans la section Bourses d'études.
          </p>
          <div className="mb-10">
            <Banner class="mb-5">
              <div className="flex mt-10 justify-between border-b-2 border-gray-300 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700">
                <div className="mx-auto flex items-center">
                  <p className="flex items-center text-base font-['roboto'] font-normal text-red-700 dark:text-gray-400">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="mr-4 h-8 w-8"
                    />
                    <span className="[&_p]:inline">
                      J’ai compris, j’aimerais quand même être assisté(e) pour
                      la bourse
                    </span>
                  </p>
                </div>
              </div>
            </Banner>
            <Banner>
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

        <div className={style.scholarship}>
          <StaticImage
            className={style.scholarship__overlay}
            alt="plane"
            placeholder="blurred"
            src="../../images/depositphotos_42487119-stock-photo-good-looking-african-graduate.png"
          />
          <div className={style.scholarship_inner}>
            <StaticImage
              className={style.scholarship_inner__overlay}
              alt="overlay"
              placeholder="blurred"
              src="../../images/Rectangle10.png"
            />
            <div className={"md:hidden " + style.scholarship__content}>
              <Carousel slide={true} indicators={false}>
                {scholarships.map((scholarship) => {
                  const levelsText = scholarship.frontmatter.levels
                    .sort(
                      (level1, level2) =>
                        LEVEL_ORDERS.indexOf(level1) -
                        LEVEL_ORDERS.indexOf(level2)
                    )
                    .map((level) => `${level}`)
                    .join(", ");

                  const image = getImage(scholarship.frontmatter.thumbnail);
                  return (
                    <div className="block max-w-[15rem] rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
                      <div className="relative overflow-hidden bg-cover bg-no-repeat">
                        <a href={`/${scholarship.frontmatter.slug}`}>
                          <GatsbyImage
                            image={image}
                            alt={scholarship.frontmatter.title}
                            className="rounded-t-lg"
                            placeholder="blurred"
                            style={{ height: "200px" }}
                          />
                        </a>
                      </div>
                      <div className="">
                        <a href={`/${scholarship.frontmatter.slug}`}>
                          <p className="px-3 py-1 text-base text-[#4bb4d4] font-['roboto']">
                            {scholarship.frontmatter.title}
                          </p>
                        </a>
                        <p className="text-yellow-500 text-sm font-['roboto']">
                          <FontAwesomeIcon icon={faClock} />
                          &nbsp;
                          {scholarship.frontmatter.deadline}
                        </p>

                        <p className="text-base text-left ml-6 py-2 font-['roboto']">
                          <FontAwesomeIcon icon={faGraduationCap} /> &nbsp;{" "}
                          {levelsText}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </Carousel>
            </div>

            <Carousel
              className="hidden md:grid -mt-[40rem] z-30"
              slide={true}
              indicators={false}
            >
              {scholarships.map((scholarship, index) => {
                const levelsText = scholarship.frontmatter.levels
                  .sort(
                    (level1, level2) =>
                      LEVEL_ORDERS.indexOf(level1) -
                      LEVEL_ORDERS.indexOf(level2)
                  )
                  .map((level) => `${level}`)
                  .join(", ");

                const image = getImage(scholarship.frontmatter.thumbnail);
                const fisrtItem = scholarships[index];
                const secondItem = scholarships[index + 1];
                const thirdItem = scholarships[index + 2];
                return (
                  <div className="grid grid-cols-3 place-items-center">
                    {fisrtItem && (
                      <Card
                        className="max-w-sm mx-4 h-[420px]"
                        imgAlt="Meaningful alt text for an image that is not purely decorative"
                        renderImage={() => (
                          <GatsbyImage
                            image={getImage(fisrtItem.frontmatter.thumbnail)}
                            class="h-60 w-full"
                            alt={fisrtItem.frontmatter.title}
                          />
                        )}
                      >
                        <div>
                          <a
                            href={`/${fisrtItem.frontmatter.slug}`}
                            className="max-[1484px]:text-lg"
                          >
                            <h5 className="text-lg font-['roboto'] tracking-tight text-[#4bb4d4] dark:text-white">
                              {fisrtItem.frontmatter.title}
                            </h5>
                          </a>

                          <p className="text-yellow-500 my-2 mt-5 font-['roboto']">
                            <FontAwesomeIcon icon={faClock} />
                            &nbsp;
                            {fisrtItem.frontmatter.deadline}
                          </p>

                          <p className="text-lg text-left font-['roboto']">
                            <FontAwesomeIcon icon={faGraduationCap} /> &nbsp;{" "}
                            {levelsText}
                          </p>

                          <a href={`/${fisrtItem.frontmatter.slug}`}>
                            <p className="text-[#4bb4d4] font-semibold text-lg py-4 font-['roboto']">
                              Détails <FontAwesomeIcon icon={faArrowRight}/>
                            </p>
                          </a>
                        </div>
                      </Card>
                    )}


{secondItem && (
                      <Card
                        className="max-w-sm mx-4 h-[420px]"
                        imgAlt="Meaningful alt text for an image that is not purely decorative"
                        renderImage={() => (
                          <GatsbyImage
                            image={getImage(secondItem.frontmatter.thumbnail)}
                            class="h-60 w-full"
                            alt={secondItem.frontmatter.title}
                          />
                        )}
                      >
                        <div>
                          <a
                            href={`/${secondItem.frontmatter.slug}`}
                            className="max-[1484px]:text-lg"
                          >
                            <h5 className="text-lg font-['roboto'] tracking-tight text-[#4bb4d4] dark:text-white">
                              {secondItem.frontmatter.title}
                            </h5>
                          </a>

                          <p className="text-yellow-500 my-2 mt-5 font-['roboto']">
                            <FontAwesomeIcon icon={faClock} />
                            &nbsp;
                            {secondItem.frontmatter.deadline}
                          </p>

                          <p className="text-lg text-left font-['roboto']">
                            <FontAwesomeIcon icon={faGraduationCap} /> &nbsp;{" "}
                            {levelsText}
                          </p>

                          <a href={`/${secondItem.frontmatter.slug}`}>
                            <p className="text-[#4bb4d4] font-semibold text-lg py-4 font-['roboto']">
                              Détails <FontAwesomeIcon icon={faArrowRight}/>
                            </p>
                          </a>
                        </div>
                      </Card>
                    )}


                    {thirdItem && (
                      <Card
                        className="max-w-sm mx-4 h-[420px]"
                        imgAlt="Meaningful alt text for an image that is not purely decorative"
                        renderImage={() => (
                          <GatsbyImage
                            image={getImage(thirdItem.frontmatter.thumbnail)}
                            class="h-60 w-full"
                            alt={thirdItem.frontmatter.title}
                          />
                        )}
                      >
                       <div>
                          <a
                            href={`/${thirdItem.frontmatter.slug}`}
                            className="max-[1484px]:text-lg"
                          >
                            <h5 className="text-lg font-['roboto'] tracking-tight text-[#4bb4d4] dark:text-white">
                              {thirdItem.frontmatter.title}
                            </h5>
                          </a>

                          <p className="text-yellow-500 my-2 mt-5 font-['roboto']">
                            <FontAwesomeIcon icon={faClock} />
                            &nbsp;
                            {thirdItem.frontmatter.deadline}
                          </p>

                          <p className="text-lg text-left font-['roboto']">
                            <FontAwesomeIcon icon={faGraduationCap} /> &nbsp;{" "}
                            {levelsText}
                          </p>

                          <a href={`/${thirdItem.frontmatter.slug}`}>
                            <p className="text-[#4bb4d4] font-semibold text-lg py-4 font-['roboto']">
                              Détails <FontAwesomeIcon icon={faArrowRight}/>
                            </p>
                          </a>
                        </div>
                      </Card>
                    )}
                  </div>
                );
              })}
            </Carousel>
          </div>
        </div>
      </section>
    </>
  );
};
 
export default Scholarship;