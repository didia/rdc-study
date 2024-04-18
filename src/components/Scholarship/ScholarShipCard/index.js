import React from "react";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap, faClock, faCalendar, faEdit, faDollarSign } from "@fortawesome/free-solid-svg-icons";
import { Card, Button } from "flowbite-react";

const ScholarShipCard = ({ scholarship }) => {
  const LEVEL_ORDERS = [
    "undergraduate",
    "graduate",
    "postgraduate",
    "research",
    "internship",
  ];

  const scholarshipItem = { ...scholarship.frontmatter };
  const levelsText = scholarshipItem.levels
  .sort(
    (level1, level2) =>
      LEVEL_ORDERS.indexOf(level1) - LEVEL_ORDERS.indexOf(level2)
              )
      .map((level) => `${level}`)
              .join(", ");
  const image = getImage(scholarshipItem.thumbnail);

  return (
    <>
      {/* <Card
        className="max-w-sm"
        imgAlt={scholarshipItem.title}
        renderImage={() => (
          <GatsbyImage
            image={image}
            alt={scholarshipItem.title}
            className="rounded-t-lg"
            style={{ height: "200px" }}
          />
        )}
      >
        <a href={`/${scholarshipItem.slug}`}>
          <h5 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white font-['roboto-bold']">
            {scholarshipItem.title}
          </h5>
        </a>

        <p className="font-normal text-gray-700 dark:text-gray-400 font-['roboto']">
          {scholarshipItem.excerpt}
        </p>

        <p className="text-yellow-500">
          <FontAwesomeIcon icon={faClock} />
          &nbsp;
          {scholarship.frontmatter.deadline}
        </p>

        <Button href={`/${scholarshipItem.slug}`}>
          Voir le détails
          <svg
            className="-mr-1 ml-2 h-4 w-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </Button>
      </Card> */}

        <div class="md:h-[400px] md:w-[33rem] mx-3 p-4 bg-white border border-gray-400 rounded-3xl shadow sm:p-4 dark:bg-gray-800 dark:border-gray-700">
          <div className="">
            <a href={`/${scholarshipItem.slug}`}>
              <h5 class="mb-2 text-sm md:text-base font-['roboto-bold'] uppercase">
                {scholarshipItem.title}
              </h5>
            </a>
            <p class="text-base font-['roboto'] md:mt-5">{scholarshipItem.excerpt}</p>

            <div className="py-4">
              <ul className="ml-5 text-sm font-['roboto'] uppercase md:text-lg">
                <li className="py-1">
                  <FontAwesomeIcon icon={faGraduationCap} className="h-6" />
                  &nbsp;&nbsp; {levelsText}
                </li>
                <li className="py-1 text-yellow-600">
                  <FontAwesomeIcon icon={faCalendar} className="h-6" />
                  &nbsp;&nbsp; {scholarship.frontmatter.deadline}
                </li>
              </ul>
            </div>
          </div>

          <div className="w-full h-1/7 uppercase md:bottom-0 md:absolute md:mb-4">
            <Button
              className="w-36 rounded-none bg-[#4bb4d4] font-semibold font-['roboto']"
              href={`/${scholarshipItem.slug}`}
            >
              Voir détails
            </Button>
          </div>
        </div>
    </>
  );
};

export default ScholarShipCard;
