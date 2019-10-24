// Vendor
import React, {Component} from 'react';
import T from 'prop-types';
import {graphql} from 'gatsby';

import ScholarshipsPage from '../components/pages/ScholarshipsPage';

const page = {
  description: "Voici les offres de bourses en cours trouvées pour vous avec ❤️ par l'équipe RDC Etudes.",
  title: "Trouver une bourse d'études",
  path: '/bourses'
};

export default class Scholarships extends Component {
  state = {
    scholarships: []
  };

  componentDidMount() {
    const {data} = this.props;
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

    this.setState({scholarships});
  }

  render() {
    return <ScholarshipsPage activeOnly={true} page={page} scholarships={this.state.scholarships} />;
  }
}

Scholarships.propTypes = {
  data: T.shape({
    scholarships: T.object.isRequired
  })
};

export const scholarshipFragment = graphql`
  fragment ScholarshipListItemFragment on MarkdownRemarkConnection {
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
`;

export const pageQuery = graphql`
  query ScholarshipsPageQuery($currentTimestamp: Float) {
    scholarships: allMarkdownRemark(
      limit: 1000
      sort: {fields: [fields___timestamp], order: ASC}
      filter: {fields: {type: {eq: "scholarship"}, timestamp: {gt: $currentTimestamp}}}
    ) {
      ...ScholarshipListItemFragment
    }
  }
`;
