// Vendor
import React from 'react';
import T from 'prop-types';

import CountryGuidePage from '../components/pages/CountryGuidePage';

export default function Template({
  data // this prop will be injected by the GraphQL query below.
}) {
  const {markdownRemark} = data; // data.markdownRemark holds our post data
  const {frontmatter, html} = markdownRemark;
  const country = {
    content: html,
    coverImage: frontmatter.coverImage.childImageSharp.sizes.src,
    excerpt: frontmatter.excerpt,
    path: markdownRemark.fields.path,
    slug: frontmatter.slug,
    title: frontmatter.title
  };

  return <CountryGuidePage country={country} />;
}

Template.propTypes = {
  data: T.shape({
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
        coverImage: thumbnail {
          childImageSharp {
            sizes(maxWidth: 1200) {
              ...GatsbyImageSharpSizes_noBase64
            }
          }
        }
      }
    }
  }
`;
