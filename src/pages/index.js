import * as React from "react";
import Home from "../components/Pages/Home";
import { graphql, useStaticQuery } from "gatsby";

const IndexPage = () => {
  const { allMarkdownRemark } = useStaticQuery(
    graphql`
      query MyQuery {
        allMarkdownRemark(
          filter: { fileAbsolutePath: { regex: "/country.md/" } }
        ) {
          edges {
            node {
              frontmatter {
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
                thumbnail {
                  childImageSharp {
                    gatsbyImageData(
                      placeholder: BLURRED
                      formats: [AUTO, WEBP, AVIF]
                    )
                  }
                }
                related
                name
              }
            }
          }
        }
      }
    `
  );

  const guideCountries = allMarkdownRemark.edges.map((edge) => edge.node);
  return <Home guideCountries={guideCountries} />;
};

export default IndexPage;
