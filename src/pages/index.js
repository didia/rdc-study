// Vendor
import React from 'react';
import T from 'prop-types';
import {graphql} from 'gatsby';

import IndexPage from '../components/pages/IndexPage';

const Index = ({data}) => {
  const countries = data.guides.edges.map(({node}) => ({
    excerpt: node.frontmatter.excerpt,
    path: node.fields.path,
    thumbnail: node.frontmatter.thumbnail.childImageSharp,
    title: node.frontmatter.title
  }));

  const articles = data.articles.edges.map(({node}) => ({
    date: node.frontmatter.date,
    excerpt: node.frontmatter.excerpt,
    path: node.fields.path,
    thumbnail: node.frontmatter.thumbnail ? node.frontmatter.thumbnail.childImageSharp : null,
    title: node.frontmatter.title,
    timeToRead: node.timeToRead
  }));

  const images = {
    consultingServiceImage: data.consultingServiceImage,
    freeGuideImage: data.freeGuideImage,
    verificationServiceImage: data.verificationServiceImage
  };

  return (
    <IndexPage
      articles={articles}
      countries={countries}
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
    verificationServiceImage: T.object.isRequired
  })
};

export default Index;

export const pageQuery = graphql`
  query PageQuery {
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
      limit: 5
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
