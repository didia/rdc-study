import React from 'react';
import * as style from "./styles.module.scss";
import { Carousel, Card } from 'flowbite-react';
import { StaticImage, GatsbyImage, getImage } from 'gatsby-plugin-image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import _ from "lodash";

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
          <span className="text-sky-600 text-2xl font-black font-['monserrat-bold']">
            Bourses d'études
          </span>{" "}
          <p className="font-['roboto']">
            Chez RDC ÉTUDES nous n’offrons malheureusement pas des bourses nous
            pouvons cependant vous assister à postuler pour la bourse de votre
            choix sans pour autant garantir l’obtention de celle-ci. Vous
            trouverez toutes les offres des bourses dont nous avons connaissance
            sur notre{" "}
            <a href="/bourse" className="text-yellow-600">
              site web
            </a>
            .
          </p>
        </div>

        <div className={style.scholarship}>
          <StaticImage
            className={style.scholarship__overlay}
            alt="plane"
            src="../../images/depositphotos_42487119-stock-photo-good-looking-african-graduate.png"
          />
          <div className={style.scholarship_inner}>
            <StaticImage
              className={style.scholarship_inner__overlay}
              alt="overlay"
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
                            style={{ height: "200px" }}
                          />
                        </a>
                      </div>
                      <div className="">
                        <a href={`/${scholarship.frontmatter.slug}`}>
                          <p className="px-3 py-1 text-sm text-sky-600 font-extrabold uppercase font-['monserrat-bold']">
                            {scholarship.frontmatter.title}
                          </p>
                        </a>
                        <p className="text-yellow-500 font-['roboto']">
                          <FontAwesomeIcon icon={faClock} />
                          &nbsp;
                          {scholarship.frontmatter.deadline}
                        </p>

                        <p className="text-lg text-left ml-3 py-2 font-['roboto']">
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
              className="hidden md:grid -mt-[40rem] z-30 relative"
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
                  <div className="flex mx-64">
                    {fisrtItem && (
                      <Card
                        className="max-w-sm mx-4 bg-slate-200 h-[29rem]"
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
                          <a href={`/${fisrtItem.frontmatter.slug}`}>
                            <h5 className="text-xl font-bold tracking-tight text-sky-600 dark:text-white">
                              {fisrtItem.frontmatter.title}
                            </h5>
                          </a>

                          <p className="text-yellow-500 my-2">
                            <FontAwesomeIcon icon={faClock} />
                            &nbsp;
                            {fisrtItem.frontmatter.deadline}
                          </p>

                          <p className="text-lg text-left">
                            <FontAwesomeIcon icon={faGraduationCap} /> &nbsp;{" "}
                            {levelsText}
                          </p>

                          <a href={`/${fisrtItem.frontmatter.slug}`}>
                            <p className="text-sky-600 font-semibold text-lg py-4">
                              Détails
                            </p>
                          </a>
                        </div>
                      </Card>
                    )}

                    {secondItem && (
                      <Card
                        className="max-w-sm mx-4 bg-slate-200 h-[29rem]"
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
                          <a href={`/${secondItem.frontmatter.slug}`}>
                            <h5 className="text-xl font-bold tracking-tight text-sky-600 dark:text-white">
                              {secondItem.frontmatter.title}
                            </h5>
                          </a>

                          <p className="text-yellow-500 my-2">
                            <FontAwesomeIcon icon={faClock} />
                            &nbsp;
                            {secondItem.frontmatter.deadline}
                          </p>

                          <p className="text-lg text-left">
                            <FontAwesomeIcon icon={faGraduationCap} /> &nbsp;{" "}
                            {levelsText}
                          </p>

                          <a href={`/${secondItem.frontmatter.slug}`}>
                            <p className="text-sky-600 font-semibold text-lg py-4">
                              Détails
                            </p>
                          </a>
                        </div>
                      </Card>
                    )}

                    {thirdItem && (
                      <Card
                        className="max-w-sm mx-4 bg-slate-200 h-[29rem]"
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
                          <a href={`/${thirdItem.frontmatter.slug}`}>
                            <h5 className="text-xl font-bold tracking-tight text-sky-600 dark:text-white">
                              {thirdItem.frontmatter.title}
                            </h5>
                          </a>

                          <p className="text-yellow-500 my-2">
                            <FontAwesomeIcon icon={faClock} />
                            &nbsp;
                            {thirdItem.frontmatter.deadline}
                          </p>

                          <p className="text-lg text-left">
                            <FontAwesomeIcon icon={faGraduationCap} /> &nbsp;{" "}
                            {levelsText}
                          </p>

                          <a href={`/${thirdItem.frontmatter.slug}`}>
                            <p className="text-sky-600 font-semibold text-lg py-4">
                              Détails
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