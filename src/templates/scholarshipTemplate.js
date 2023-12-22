import React from "react";
import { graphql } from "gatsby";
import ScholarShipDetails from "../components/Pages/ScholarShipDetails";

export default function ScholarshipTemplate({ data }) {
  const { markdownRemark, scholarships } = data;
  const { frontmatter, html } = markdownRemark;
  const allScholarships = scholarships.edges.map((edge) => edge.node);

  return (
    <ScholarShipDetails
      bourse={frontmatter}
      content={html}
      otherScholarShips={allScholarships}
    />
  );
}

export const scholarshipQuery = graphql`
  query scholarshipQuery($slug: String!) {
    markdownRemark(frontmatter: { slug: { eq: $slug } }) {
      html
      frontmatter {
        slug
        title
        excerpt
        thumbnail {
          childImageSharp {
            gatsbyImageData(placeholder: BLURRED, formats: [AUTO, WEBP, AVIF])
          }
        }
        deadline
        startDate
        levels
        targetCountries
      }
    }

    scholarships: allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/scholarships/" } }
    ) {
      edges {
        node {
          frontmatter {
            slug
            title
            excerpt
            thumbnail {
              childImageSharp {
                gatsbyImageData(
                  placeholder: BLURRED
                  formats: [AUTO, WEBP, AVIF]
                )
              }
            }
            deadline
            startDate
            levels
            targetCountries
          }
        }
      }
    }
  }
`;
