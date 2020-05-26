// Vendor
import React from 'react';
import T from 'prop-types';
import {graphql} from 'gatsby';

import IndexPage from '../components/pages/IndexPage';

const NUMBER_OF_SCHOLARSHIPS_IN_HOME_PAGE = 6;

const Index = ({data}) => {
  const countries = data.guides.edges.map(({node}) => ({
    ...node.frontmatter,
    ...node.fields,
    thumbnail: node.frontmatter.flag.childImageSharp,
  }));

  const articles = data.articles.edges.map(({node}) => ({
    ...node.frontmatter,
    ...node.fields,
    timeToRead: node.timeToRead,
    thumbnail: node.frontmatter.thumbnail.childImageSharp,
  }));

  const currentTimestamp = Date.now();

  const scholarships = data.scholarships.edges
    .filter(({node}) => node.fields.timestamp - currentTimestamp > 0)
    .slice(0, NUMBER_OF_SCHOLARSHIPS_IN_HOME_PAGE)
    .map(({node}) => ({
      ...node.frontmatter,
      ...node.fields,
      thumbnail: node.frontmatter.thumbnail.childImageSharp,
    }));

  return (
    <IndexPage
      articles={articles}
      countries={countries}
      scholarships={scholarships}
      hasMoreArticles={data.articles.pageInfo.hasNextPage}
    />
  );
};

Index.propTypes = {
  data: T.shape({
    articles: T.object.isRequired,
    guides: T.object.isRequired,
    scholarships: T.object.isRequired,
  }),
};

export default Index;

export const pageQuery = graphql`
  query PageQuery($currentTimestamp: Float) {
    guides: allMarkdownRemark(
      limit: 10
      sort: {fields: [frontmatter___name], order: ASC}
      filter: {frontmatter: {topic: {eq: "country"}}, fields: {draft: {eq: false}}}
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
            name
            flag {
              childImageSharp {
                fluid(maxWidth: 450, maxHeight: 304, cropFocus: CENTER) {
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
      filter: {fields: {type: {eq: "article"}, draft: {eq: false}}}
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
                fluid(maxWidth: 300, cropFocus: CENTER) {
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
      filter: {fields: {type: {eq: "scholarship"}, timestamp: {gt: $currentTimestamp}, draft: {eq: false}}}
    ) {
      ...ScholarshipListItemFragment
    }
  }
`;
