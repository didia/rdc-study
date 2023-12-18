import React from "react";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap, faClock } from "@fortawesome/free-solid-svg-icons";
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
    <Card
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
        <h5 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
          {scholarshipItem.title}
        </h5>
      </a>

      <p className="font-normal text-gray-700 dark:text-gray-400">
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
    </Card>
  );
};

export default ScholarShipCard;
