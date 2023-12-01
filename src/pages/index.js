import * as React from "react"
import Home from "../components/Pages/Home";
import { graphql } from "gatsby";

const IndexPage = ({ data }) => {
  const newsCardItems = data.allMarkdownRemark.edges.map((edge) => edge.node);
  return <Home newsCardItems={newsCardItems} />;
};

export default IndexPage

export const pageQuery = graphql`
  query NewsCardQuery {
    sitePage(children: {}) {
      id
    }
    staticImage {
      id
    }
    allMarkdownRemark {
      edges {
        node {
          frontmatter {
            id
            date
            description
            image {
              childImageSharp {
                gatsbyImageData(
                  width: 200
                  placeholder: BLURRED
                  formats: [AUTO, WEBP, AVIF]
                )
              }
            }
            slug
            title
          }
        }
      }
    }
  }
`;
