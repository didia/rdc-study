import React from "react";
import Article from "../components/Pages/Article";
import { graphql } from "gatsby";
import { useEffect } from "react";

export default function ArticlePage ({ data }){
    const { allMarkdownRemark} = data;
    const allArticles = allMarkdownRemark.edges.map((edge) => edge.node);

  return <Article otherArticles={allArticles} />;
};

export const articles = graphql`
query MyQuery {
  allMarkdownRemark(filter: {fileAbsolutePath: {regex: "/article/"}}) {
    edges {
      node {
        frontmatter {
          slug
          title
          thumbnail {
            childImageSharp {
              gatsbyImageData
            }
          }
          date
          excerpt
        }
        html
      }
    }
  }
}
`;
