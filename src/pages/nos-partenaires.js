// Vendor
import React from 'react';
import { graphql } from 'gatsby'

import PartenairesPage from '../components/pages/PartenairesPage';

const Page = ({ data }) => {

  const partners = data.partners.edges.map(({ node }) => ({
    ...node.frontmatter,
    ...node.fields,
  }));

  return (
    <PartenairesPage partners={partners} />

  );

}

export default Page;

export const query = graphql`
  query {
    partners: allMarkdownRemark(
      limit: 10
      
      filter: {fields: {type: {eq: "partner"}, draft: {eq: false}}}
      sort: {fields: [frontmatter___name], order: ASC}
      ) {
      edges {
        node {
          fields {
            path
          }
          frontmatter {
            labelKey
            name
            to
            thumbnail {
              childImageSharp {
                fluid(maxWidth: 150, cropFocus: CENTER) {
                  ...GatsbyImageSharpFluid
                }
              }
            } 
          }
        }
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;