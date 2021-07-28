// Vendor
import React, {Component} from 'react';
import T from 'prop-types';
import {graphql} from 'gatsby';
import {getImage} from 'gatsby-plugin-image';

import ScholarshipsPage from '../components/pages/ScholarshipsPage';

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
        thumbnail: getImage(node.frontmatter.thumbnail.childImageSharp),
        title: node.frontmatter.title
      }));

    this.setState({scholarships});
  }

  render() {
    const page = {
      description: "Voici les offres de bourses en cours trouvées pour vous avec ❤️ par l'équipe RDC Etudes.",
      image: getImage(this.props.data.metaImage),
      title: "Trouver une bourse d'études",
      path: '/bourses',
      socialShareEnabled: true
    };

    return <ScholarshipsPage activeOnly={true} page={page} scholarships={this.state.scholarships} />;
  }
}

Scholarships.propTypes = {
  data: T.shape({
    metaImage: T.object,
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
              gatsbyImageData(height: 300, transformOptions: {cropFocus: CENTER, fit: COVER}, layout: FULL_WIDTH)
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
      filter: {fields: {type: {eq: "scholarship"}, timestamp: {gt: $currentTimestamp}, draft: {eq: false}}}
    ) {
      ...ScholarshipListItemFragment
    }
    metaImage: imageSharp(fluid: {originalName: {regex: "/bourses-courantes-cover.jpg/"}}) {
      gatsbyImageData(width: 1200, height: 630, transformOptions: {cropFocus: CENTER, fit: COVER}, layout: FULL_WIDTH)
    }
  }
`;
