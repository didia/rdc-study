// Vendor
import React from 'react';
import T from 'prop-types';
import {graphql} from 'gatsby';

import GuidePage from '../components/pages/GuidePage';

const guideMarkdownRemark = ({html, frontmatter, fields}) => ({
  content: html,
  metaImage: frontmatter.metaImage ? frontmatter.metaImage.childImageSharp.fixed : null,
  excerpt: frontmatter.excerpt,
  path: fields.path,
  related: frontmatter.related,
  slug: frontmatter.slug,
  thumbnail: frontmatter.thumbnail ? frontmatter.thumbnail.childImageSharp : null,
  title: frontmatter.title,
  topic: frontmatter.topic,
});

const splitRelatedAndOthers = (guides, mainGuide) => {
  if (!mainGuide.related)
    return {relatedGuides: [], otherGuides: guides.filter((guide) => guide.topic === mainGuide.topic)};

  const relatedGuides = [];
  const otherGuides = [];

  guides.forEach((guide) => {
    if (mainGuide.related.indexOf(guide.slug) !== -1) return relatedGuides.push(guide);

    if (guide.topic !== mainGuide.topic) return;

    otherGuides.push(guide);
  });

  return {relatedGuides, otherGuides};
};

export default function Template({
  data, // this prop will be injected by the GraphQL query below.
}) {
  const {markdownRemark, allMarkdownRemark} = data; // data.markdownRemark holds our post data
  const guide = guideMarkdownRemark(markdownRemark);
  const allGuides = allMarkdownRemark.edges.map((edge) => guideMarkdownRemark(edge.node));

  const {relatedGuides, otherGuides} = splitRelatedAndOthers(allGuides, guide);

  return <GuidePage guide={guide} relatedGuides={relatedGuides} otherGuides={otherGuides} />;
}

Template.propTypes = {
  data: T.shape({
    allMarkdownRemark: T.object.isRequired,
    markdownRemark: T.object.isRequired,
  }),
};

export const pageQuery = graphql`
  query GuideByPath($path: String!, $type: String!) {
    markdownRemark(fields: {path: {eq: $path}}) {
      html
      fields {
        path
      }
      frontmatter {
        excerpt
        slug
        title
        topic
        related
        metaImage: thumbnail {
          childImageSharp {
            fixed(width: 1200, height: 630, cropFocus: CENTER) {
              ...GatsbyImageSharpFixed_noBase64
            }
          }
        }
      }
    }
    allMarkdownRemark(
      limit: 2000
      sort: {fields: [frontmatter___title], order: ASC}
      filter: {fields: {path: {ne: $path}, type: {eq: $type}, draft: {eq: false}}}
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
            topic
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
  }
`;
