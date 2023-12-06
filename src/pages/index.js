import * as React from "react"
import Home from "../components/Pages/Home";
import { graphql } from "gatsby";

const IndexPage = () => {
  //const newsCardItems = data.allMarkdownRemark.edges.map((edge) => edge.node);
  return <Home />;
};

export default IndexPage

/* export const pageQuery = graphql`
  query NewsCardQuery {
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
`; */
