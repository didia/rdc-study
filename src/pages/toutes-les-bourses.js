// Vendor
import React from 'react';
import T from 'prop-types';
import {graphql} from 'gatsby';

import ScholarshipsPage from '../components/pages/ScholarshipsPage';

const Scholarships = ({data}) => {
  const page = {
    description: "Voici toutes les offres de bourses partagées avec ❤️ par l'équipe RDC Etudes.",
    image: data.metaImage.childImageSharp.metaImage,
    title: "Bourses d'études",
    path: '/toutes-les-bourses'
  };

  const scholarships = data.scholarships.edges.map(({node}) => ({
    deadline: node.frontmatter.deadline,
    excerpt: node.frontmatter.excerpt,
    levels: node.frontmatter.levels,
    path: node.fields.path,
    targetCountries: node.frontmatter.targetCountries,
    thumbnail: node.frontmatter.thumbnail.childImageSharp,
    title: node.frontmatter.title
  }));

  return <ScholarshipsPage page={page} scholarships={scholarships} />;
};

Scholarships.propTypes = {
  data: T.shape({
    metaImage: T.object,
    scholarships: T.object.isRequired
  })
};

export default Scholarships;

export const pageQuery = graphql`
  query AllScholarshipsPageQuery {
    scholarships: allMarkdownRemark(
      limit: 1000
      sort: {fields: [frontmatter___deadline], order: ASC}
      filter: {fields: {type: {eq: "scholarship"}}}
    ) {
      ...ScholarshipListItemFragment
    }
    metaImage: imageSharp(fluid: {originalName: {regex: "/toutes-les-bourses-cover.jpg/"}}) {
      fixed(width: 1200, height: 630, cropFocus: NORTH) {
        ...GatsbyImageSharpFixed_noBase64
      }
    }
  }
`;
