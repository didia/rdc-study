import React from "react";
import { graphql } from "gatsby";
import CountryGuide from "../components/Pages/Guide/Country";

export default function GuideTemplate({ data }) {
  const { markdownRemark } = data;
  const { frontmatter, html } = markdownRemark;

  return (
      <CountryGuide attributes={ frontmatter } html={html} />
  );
}

export const guideQuery = graphql`
  query ($slug: String!) {
    markdownRemark(frontmatter: { slug: { eq: $slug } }) {
      html
      frontmatter {
        date(formatString: "DD-MM-YYYY")
        slug
        title
        excerpt
        flag {
          childImageSharp {
            gatsbyImageData(
              width: 200
              placeholder: BLURRED
              formats: [AUTO, WEBP, AVIF]
            )
          }
        }
        related
        name
        thumbnail {
          childImageSharp {
            gatsbyImageData(
              width: 200
              placeholder: BLURRED
              formats: [AUTO, WEBP, AVIF]
            )
          }
        }
      }
    }
  }
`;
