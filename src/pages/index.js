// Vendor
import React from 'react';
import T from 'prop-types';
import {graphql} from 'gatsby';

import IndexPage from '../components/pages/IndexPage';

const Index = ({data}) => {
  const countries = data.guides.edges.map(({node}) => ({
    ...node.frontmatter,
    ...node.fields,
    thumbnail: node.frontmatter.thumbnail.childImageSharp
  }));

  const articles = data.articles.edges.map(({node}) => ({
    ...node.frontmatter,
    ...node.fields,
    timeToRead: node.timeToRead,
    thumbnail: node.frontmatter.thumbnail.childImageSharp
  }));

  const images = {
    consultingServiceImage: data.consultingServiceImage,
    freeGuideImage: data.freeGuideImage,
    verificationServiceImage: data.verificationServiceImage
  };

  const currentTimestamp = Date.now();

  const scholarships = data.scholarships.edges
    .filter(({node}) => node.fields.timestamp - currentTimestamp > 0)
    .map(({node}) => ({
      ...node.frontmatter,
      ...node.fields,
      thumbnail: node.frontmatter.thumbnail.childImageSharp
    }));

  return (
    <IndexPage
      articles={articles}
      countries={countries}
      scholarships={scholarships}
      images={images}
      hasMoreArticles={data.articles.pageInfo.hasNextPage}
    />
  );
};

Index.propTypes = {
  data: T.shape({
    articles: T.object.isRequired,
    consultingServiceImage: T.object.isRequired,
    freeGuideImage: T.object.isRequired,
    guides: T.object.isRequired,
    scholarships: T.object.isRequired,
    verificationServiceImage: T.object.isRequired
  })
};

export default Index;

export const pageQuery = graphql`
  query PageQuery($currentTimestamp: Float) {
    guides: allMarkdownRemark(
      limit: 10
      sort: {fields: [frontmatter___title], order: ASC}
      filter: {frontmatter: {active: {eq: true}, topic: {eq: "country"}}}
    ) {
      edges {
        node {
          fields {
            path
          }
          frontmatter {
            excerpt
            slug
            title
            thumbnail {
              childImageSharp {
                fluid(maxWidth: 584, maxHeight: 394, cropFocus: CENTER) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
      }
    }
    articles: allMarkdownRemark(
      limit: 2
      sort: {fields: [frontmatter___date], order: DESC}
      filter: {fields: {type: {eq: "article"}}}
    ) {
      edges {
        node {
          timeToRead
          fields {
            path
          }
          frontmatter {
            date
            excerpt
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
      pageInfo {
        hasNextPage
      }
    }
    scholarships: allMarkdownRemark(
      limit: 12
      sort: {fields: [fields___timestamp], order: ASC}
      filter: {fields: {type: {eq: "scholarship"}, timestamp: {gt: $currentTimestamp}}}
    ) {
      ...ScholarshipListItemFragment
    }
    consultingServiceImage: imageSharp(fluid: {originalName: {regex: "/consulting-service.jpg/"}}) {
      fluid(maxWidth: 276) {
        ...GatsbyImageSharpFluid
      }
    }
    freeGuideImage: imageSharp(fluid: {originalName: {regex: "/free-guide.jpg/"}}) {
      fluid(maxWidth: 276) {
        ...GatsbyImageSharpFluid
      }
    }
    verificationServiceImage: imageSharp(fluid: {originalName: {regex: "/verification-service.jpg/"}}) {
      fluid(maxWidth: 276) {
        ...GatsbyImageSharpFluid
      }
    }
  }
`;
