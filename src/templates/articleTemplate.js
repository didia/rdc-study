// Vendor
import React from 'react';
import T from 'prop-types';

import ArticlePage from '../components/pages/ArticlePage';

const articleMarkdownRemark = ({html, timeToRead, frontmatter, fields}) => ({
  content: html,
  coverImage: frontmatter.thumbnail ? frontmatter.thumbnail.childImageSharp.coverImage.src : null,
  date: frontmatter.date,
  excerpt: frontmatter.excerpt,
  path: fields.path,
  tags: frontmatter.tags,
  thumbnail: frontmatter.thumbnail ? {sizes: frontmatter.thumbnail.childImageSharp.contentImage} : null,
  title: frontmatter.title,
  timeToRead
});

const articlePreviewMarkdownRemark = ({frontmatter, fields, timeToRead}) => ({
  date: frontmatter.date,
  excerpt: frontmatter.excerpt,
  path: fields.path,
  thumbnail: frontmatter.thumbnail ? frontmatter.thumbnail.childImageSharp : null,
  title: frontmatter.title,
  timeToRead
});

export default function Template({
  data // this prop will be injected by the GraphQL query below.
}) {
  const {markdownRemark, allMarkdownRemark} = data; // data.markdownRemark holds our post data
  const article = articleMarkdownRemark(markdownRemark);
  const allArticles = allMarkdownRemark
    ? allMarkdownRemark.edges.map(edge => articlePreviewMarkdownRemark(edge.node))
    : [];

  return <ArticlePage article={article} otherArticles={allArticles} />;
}

Template.propTypes = {
  data: T.shape({
    allMarkdownRemark: T.object.isRequired,
    markdownRemark: T.object.isRequired
  })
};

export const pageQuery = graphql`
  query ArticleByPath($path: String!, $type: String) {
    markdownRemark(fields: {path: {eq: $path}}) {
      html
      timeToRead
      fields {
        path
      }
      frontmatter {
        date
        excerpt
        tags
        title
        thumbnail {
          childImageSharp {
            contentImage: sizes(maxWidth: 1200) {
              ...GatsbyImageSharpSizes
            }
            coverImage: sizes(maxWidth: 1200) {
              ...GatsbyImageSharpSizes_noBase64
            }
          }
        }
      }
    }
    allMarkdownRemark(
      limit: 10
      sort: {fields: [frontmatter___date], order: DESC}
      filter: {fields: {path: {ne: $path}, type: {eq: $type}}}
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
    }
  }
`;
