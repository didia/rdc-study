// Vendor
import React from 'react';
import T from 'prop-types';

import GuidePage from '../components/pages/GuidePage';

const guideMarkdownRemark = ({html, frontmatter, fields}) => ({
  content: html,
  coverImage: frontmatter.coverImage ? frontmatter.coverImage.childImageSharp.sizes.src : null,
  excerpt: frontmatter.excerpt,
  path: fields.path,
  related: frontmatter.related,
  slug: frontmatter.slug,
  thumbnail: frontmatter.thumbnail ? frontmatter.thumbnail.childImageSharp : null,
  title: frontmatter.title,
  topic: frontmatter.topic
});

const splitRelatedAndOthers = (guides, mainGuide) => {
  if (!mainGuide.related)
    return {relatedGuides: [], otherGuides: guides.filter(guide => guide.topic === mainGuide.topic)};

  const relatedGuides = [];
  const otherGuides = [];

  guides.forEach(guide => {
    if (mainGuide.related.indexOf(guide.slug) !== -1) return relatedGuides.push(guide);

    if (guide.topic !== mainGuide.topic) return;

    otherGuides.push(guide);
  });

  return {relatedGuides, otherGuides};
};

export default function Template({
  data // this prop will be injected by the GraphQL query below.
}) {
  const {markdownRemark, allMarkdownRemark} = data; // data.markdownRemark holds our post data
  const guide = guideMarkdownRemark(markdownRemark);
  const allGuides = allMarkdownRemark.edges.map(edge => guideMarkdownRemark(edge.node));

  const {relatedGuides, otherGuides} = splitRelatedAndOthers(allGuides, guide);

  return <GuidePage guide={guide} relatedGuides={relatedGuides} otherGuides={otherGuides} />;
}

Template.propTypes = {
  data: T.shape({
    allMarkdownRemark: T.object.isRequired,
    markdownRemark: T.object.isRequired
  })
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
        coverImage: thumbnail {
          childImageSharp {
            sizes(maxWidth: 1200) {
              ...GatsbyImageSharpSizes_noBase64
            }
          }
        }
      }
    }
    allMarkdownRemark(
      limit: 2000
      sort: {fields: [frontmatter___title], order: ASC}
      filter: {frontmatter: {active: {eq: true}}, fields: {path: {ne: $path}, type: {eq: $type}}}
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
