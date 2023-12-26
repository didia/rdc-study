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
      (guideCountry, index) => index <= 3
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
        <div className="text-center mx-10 mb-3 md:hidden">
          <span className="text-sky-600 text-2xl font-black">
            Bourses d'études
          </span>{" "}
          <p>
            Découvrez nos meilleurs programmes de bourse qui vous assure un
            voyage réussi
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
                          <p className="px-3 py-1 text-sm text-sky-600 font-extrabold uppercase">
                            {scholarship.frontmatter.title}
                          </p>
                        </a>
                        <p className="text-yellow-500">
                          <FontAwesomeIcon icon={faClock} />
                          &nbsp;
                          {scholarship.frontmatter.deadline}
                        </p>

                        <p className="text-lg text-left ml-3 py-2">
                          <FontAwesomeIcon icon={faGraduationCap} /> &nbsp;{" "}
                          {levelsText}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </Carousel>
            </div>

            <div className="hidden md:grid md:grid-cols-4 -mt-[32rem] z-30 relative">
              {limitedScholarShips.map((scholarship) => {
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
                  <div className="">
                    <Card
                      className="max-w-sm mx-4 bg-slate-200 h-[27rem]"
                      imgAlt="Meaningful alt text for an image that is not purely decorative"
                      renderImage={() => (
                        <GatsbyImage
                          image={image}
                          class="h-60 w-full"
                          alt={scholarship.frontmatter.title}
                        />
                      )}
                    >
                      <div>
                        <a href={`/${scholarship.frontmatter.slug}`}>
                          <h5 className="text-xl font-bold tracking-tight text-sky-600 dark:text-white">
                            {scholarship.frontmatter.title}
                          </h5>
                        </a>

                        <p className="text-yellow-500 my-2">
                          <FontAwesomeIcon icon={faClock} />
                          &nbsp;
                          {scholarship.frontmatter.deadline}
                        </p>

                        <p className="text-lg text-left">
                          <FontAwesomeIcon icon={faGraduationCap} /> &nbsp;{" "}
                          {levelsText}
                        </p>

                        <a href={`/${scholarship.frontmatter.slug}`}>
                          <p className="text-sky-600 font-semibold text-lg py-4">
                            Détails
                          </p>
                        </a>
                      </div>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
 
export default Scholarship;