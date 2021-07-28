// Vendor
import React from 'react';
import T from 'prop-types';
import {graphql} from 'gatsby';
import {getImage} from 'gatsby-plugin-image';

import ArticlesPage from '../components/pages/ArticlesPage';

const Articles = ({data}) => {
  const articles = data.articles.edges.map(({node}) => ({
    date: node.frontmatter.date,
    excerpt: node.frontmatter.excerpt,
    path: node.fields.path,
    thumbnail: node.frontmatter.thumbnail ? getImage(node.frontmatter.thumbnail.childImageSharp) : null,
    title: node.frontmatter.title,
    timeToRead: node.timeToRead
  }));

  return <ArticlesPage articles={articles} />;
};

Articles.propTypes = {
  data: T.shape({
    articles: T.object.isRequired
  })
};

export default Articles;

export const pageQuery = graphql`
  query ArticlesPageQuery {
    articles: allMarkdownRemark(
      limit: 1000
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
                gatsbyImageData(height: 500, transformOptions: {cropFocus: CENTER}, layout: FULL_WIDTH)
              }
            }
          }
        }
      }
    }
  }
`;
