import * as React from "react";
import Home from "../components/Pages/Home";
import { graphql, useStaticQuery } from "gatsby";

const IndexPage = () => {
  const { guides, articles, scholarships } = useStaticQuery(
    graphql`
      query MainQuery {
        guides: allMarkdownRemark(
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
        articles: allMarkdownRemark(
          limit: 3
          filter: { fileAbsolutePath: { regex: "/article/" } }
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
                      width: 300
                      placeholder: BLURRED
                      formats: [AUTO, WEBP, AVIF]
                    )
                  }
                }
                thumbnailCredits
                date
              }
            }
          }
        }
      }
    `
  );

  const guideCountries = guides.edges.map((edge) => edge.node);
  const allArticles = articles.edges.map((edge) => edge.node);
  const allScholarships = scholarships.edges.map((edge) => edge.node);
  return (
    <Home
      guideCountries={guideCountries}
      articles={allArticles}
      scholarships={allScholarships}
    />
  );
};

export default IndexPage;
