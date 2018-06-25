// Vendor
import React from 'react';
import T from 'prop-types';

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
                sizes(maxHeight: 500) {
                  ...GatsbyImageSharpSizes
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
                sizes(maxHeight: 500) {
                  ...GatsbyImageSharpSizes
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
    consultingServiceImage: imageSharp(id: {regex: "/consulting-service.jpg/"}) {
      sizes(maxWidth: 276) {
        ...GatsbyImageSharpSizes
      }
    }
    freeGuideImage: imageSharp(id: {regex: "/free-guide.jpg/"}) {
      sizes(maxWidth: 276) {
        ...GatsbyImageSharpSizes
      }
    }
    verificationServiceImage: imageSharp(id: {regex: "/verification-service.jpg/"}) {
      sizes(maxWidth: 276) {
        ...GatsbyImageSharpSizes
      }
    }
  }
`;
