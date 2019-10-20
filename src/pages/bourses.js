// Vendor
import React from 'react';
import T from 'prop-types';
import {graphql} from 'gatsby';

import ScholarshipsPage from '../components/pages/ScholarshipsPage';

const Scholarships = ({data}) => {
  const scholarships = data.scholarships.edges.map(({node}) => ({
    deadline: node.frontmatter.deadline,
    excerpt: node.frontmatter.excerpt,
    levels: node.frontmatter.levels,
    path: node.fields.path,
    targetCountries: node.frontmatter.targetCountries,
    thumbnail: node.frontmatter.thumbnail.childImageSharp,
    title: node.frontmatter.title
  }));

  return <ScholarshipsPage scholarships={scholarships} />;
};

Scholarships.propTypes = {
  data: T.shape({
    scholarships: T.object.isRequired
  })
};

export default Scholarships;

export const pageQuery = graphql`
  query ScholarshipsPageQuery {
    scholarships: allMarkdownRemark(
      limit: 1000
      sort: {fields: [frontmatter___deadline], order: ASC}
      filter: {fields: {type: {eq: "scholarship"}}}
    ) {
      edges {
        node {
          fields {
            path
          }
          frontmatter {
            deadline
            excerpt
            levels
            targetCountries
            title
            thumbnail {
              childImageSharp {
                fluid(maxHeight: 500, cropFocus: CENTER) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
      }
    }
  }
`;
