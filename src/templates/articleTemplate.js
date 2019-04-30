// Vendor
import React from 'react';
import T from 'prop-types';
import {graphql} from 'gatsby';

import ArticlePage from '../components/pages/ArticlePage';

const articleMarkdownRemark = ({html, timeToRead, frontmatter, fields}) => ({
  content: html,
  metaImage: frontmatter.thumbnail ? frontmatter.thumbnail.childImageSharp.metaImage : null,
  date: frontmatter.date,
  excerpt: frontmatter.excerpt,
  path: fields.path,
  tags: frontmatter.tags,
  thumbnail: frontmatter.thumbnail ? {fluid: frontmatter.thumbnail.childImageSharp.contentImage} : null,
  thumbnailCredits: frontmatter.thumbnailCredits,
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
  const hasMoreArticles = allMarkdownRemark ? allMarkdownRemark.pageInfo.hasNextPage : false;

  return <ArticlePage article={article} otherArticles={allArticles} hasMoreArticles={hasMoreArticles} />;
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
        thumbnailCredits
        thumbnail {
          childImageSharp {
            contentImage: fluid(maxWidth: 1200, cropFocus: CENTER) {
              ...GatsbyImageSharpFluid
            }
            metaImage: fixed(width: 1200, height: 630, cropFocus: CENTER) {
              ...GatsbyImageSharpFixed_noBase64
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
  }
`;
