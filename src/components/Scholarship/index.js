import React from 'react';
import * as style from "./styles.module.scss";
import { Carousel } from 'flowbite-react';
import { StaticImage, GatsbyImage, getImage } from 'gatsby-plugin-image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faGraduationCap } from '@fortawesome/free-solid-svg-icons';

const Scholarship = ({ scholarships }) => {
  const substring = (val) => {
    return val.substring(0, 80) + "...";
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
        <div className="text-center mx-10 mb-3">
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
            <div className={style.scholarship__content}>
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
          </div>
        </div>
      </section>
    </>
  );
};
 
export default Scholarship;