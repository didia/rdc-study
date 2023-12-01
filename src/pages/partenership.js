import React from 'react';
import PartenerShip from '../components/Pages/PartenerShip';
import { graphql } from 'gatsby';

const PartenerShipPage = ({ data }) => {
  const newsCardItems = data.allMarkdownRemark.edges.map((edge) => edge.node);
  return <PartenerShip newsCardItems={newsCardItems} />;
};
 
export default PartenerShipPage;

export const pageQuery = graphql`
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
`;