import React from "react";
import { graphql } from "gatsby";
import BourseDetails from "../components/Pages/BourseDetails";

export default function ArticleTemplate({ data }) {
  const { markdownRemark } = data;
  const { frontmatter, html } = markdownRemark;

  return <BourseDetails bourse={frontmatter} content={html} />;
}

export const articleQuery = graphql`
  query articleQuery($slug: String!) {
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
  }
`;
