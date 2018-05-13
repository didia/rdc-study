// Vendor
import React from 'react';
import T from 'prop-types';

import GuidePage from '../components/pages/GuidePage';

const guidePageFromMarkdownRemark = ({html, frontmatter, fields}) => ({
  content: html,
  coverImage: frontmatter.coverImage.childImageSharp.sizes.src,
  excerpt: frontmatter.excerpt,
  path: fields.path,
  related: frontmatter.related,
  slug: frontmatter.slug,
  title: frontmatter.title
});

const guideThumbnailFromMarkdownRemark = ({fields, frontmatter}) => ({
  excerpt: frontmatter.excerpt,
  path: fields.path,
  slug: frontmatter.slug,
  thumbnail: frontmatter.thumbnail.childImageSharp,
  title: frontmatter.title
});

const splitRelatedAndOthers = (guides, relatedSlugs) => {
  if (!relatedSlugs) return {relatedGuides: [], otherGuides: guides};
  const relatedGuides = [];
  const otherGuides = [];

  guides.forEach(guide => {
    if (relatedSlugs.includes(guide.slug)) return relatedGuides.push(guide);
    otherGuides.push(guide);
  });

  return {relatedGuides, otherGuides};
};

export default function Template({
  data // this prop will be injected by the GraphQL query below.
}) {
  const {markdownRemark, allMarkdownRemark} = data; // data.markdownRemark holds our post data
  const guide = guidePageFromMarkdownRemark(markdownRemark);

  const allGuides = allMarkdownRemark.edges.map(edge => guideThumbnailFromMarkdownRemark(edge.node));

  const {relatedGuides, otherGuides} = splitRelatedAndOthers(allGuides, guide.related);

  return <GuidePage guide={guide} relatedGuides={relatedGuides} otherGuides={otherGuides} />;
}

Template.propTypes = {
  data: T.shape({
    allMarkdownRemark: T.object.isRequired,
    markdownRemark: T.object.isRequired
  })
};

export const pageQuery = graphql`
  query GuideByPath($slug: String!) {
    markdownRemark(frontmatter: {slug: {eq: $slug}}) {
      html
      fields {
        path
      }
      frontmatter {
        excerpt
        slug
        title
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
      filter: {frontmatter: {active: {eq: true}, slug: {ne: $slug}}}
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
  }
`;
