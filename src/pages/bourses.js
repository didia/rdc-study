// Vendor
import React from 'react';
import T from 'prop-types';
import {graphql} from 'gatsby';
import isAfter from 'date-fns/isAfter';

import ScholarshipsPage from '../components/pages/ScholarshipsPage';

const Scholarships = ({data}) => {
  const currentTimestamp = Date.now();
  const scholarships = data.scholarships.edges
    .filter(({node}) => node.fields.timestamp - currentTimestamp > 0)
    .map(({node}) => ({
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
  query ScholarshipsPageQuery($currentTimestamp: Float) {
    scholarships: allMarkdownRemark(
      limit: 1000
      sort: {fields: [frontmatter___deadline], order: ASC}
      filter: {fields: {type: {eq: "scholarship"}, timestamp: {gt: $currentTimestamp}}}
    ) {
      edges {
        node {
          fields {
            path
            timestamp
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
