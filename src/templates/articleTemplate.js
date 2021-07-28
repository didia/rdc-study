// Vendor
import React from 'react';
import T from 'prop-types';
import {graphql} from 'gatsby';
import {getImage} from 'gatsby-plugin-image';

import ArticlePage from '../components/pages/ArticlePage';

const articleMarkdownRemark = ({html, timeToRead, frontmatter, fields}) => ({
  content: html,
  metaImage: frontmatter.thumbnail ? getImage(frontmatter.metaImage) : null,
  date: frontmatter.date,
  excerpt: frontmatter.excerpt,
  path: fields.path,
  tags: frontmatter.tags,
  thumbnail: frontmatter.thumbnail ? getImage(frontmatter.contentImage) : null,
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
    ? allMarkdownRemark.edges.map((edge) => articlePreviewMarkdownRemark(edge.node))
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
        contentImage: thumbnail {
          childImageSharp {
            gatsbyImageData(transformOptions: {cropFocus: CENTER}, layout: FULL_WIDTH)
          }
        }
        metaImage: thumbnail {
          childImageSharp {
            gatsbyImageData(width: 1200, height: 630, transformOptions: {cropFocus: CENTER})
          }
        }
      }
    }
    allMarkdownRemark(
      limit: 10
      sort: {fields: [frontmatter___date], order: DESC}
      filter: {fields: {path: {ne: $path}, type: {eq: $type}, draft: {eq: false}}}
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
      pageInfo {
        hasNextPage
      }
    }
  }
`;
