// Vendor
import React from 'react';
import T from 'prop-types';

import PageLayout from '../layouts/PageLayout';
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
    title: frontmatter.title
  };
  return (
    <PageLayout>
      <CountryGuidePage country={country} />
    </PageLayout>
  );
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
