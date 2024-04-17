import React from "react";
import { graphql } from "gatsby";
import ArticleDetails from "../components/Pages/ArticleDetails";

export default function ArticleTemplate({ data }) {
  const { markdownRemark, articles } = data;
  const { frontmatter, html } = markdownRemark;
  const allArticles = articles.edges.map((edge) => edge.node);

  return (
    <ArticleDetails 
                    article={frontmatter} 
                    content={html} 
                    otherArticles={allArticles}
    />
  );
}

export const articleQuery = graphql`
  query articleQuery($slug: String!) {
    markdownRemark(frontmatter: { slug: { eq: $slug } }) {
      html
      frontmatter {
        slug
        title
        excerpt
        tags
        date
        thumbnail {
          childImageSharp {
            gatsbyImageData(placeholder: BLURRED, formats: [AUTO, WEBP, AVIF])
          }
        }
      }
    }

    articles: allMarkdownRemark(
      limit: 5
      filter: { fileAbsolutePath: { regex: "/article/" } }
    ) {
      edges {
        node {
          html
          frontmatter {
            slug
            title
            excerpt
            tags
            date
            thumbnail {
              childImageSharp {
                gatsbyImageData(
                  placeholder: BLURRED
                  formats: [AUTO, WEBP, AVIF]
                )
              }
            }
          }
        }
      }
    }
  }
`;
