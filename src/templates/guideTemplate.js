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
    excerpt: frontmatter.excerpt,
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
      frontmatter {
        excerpt
        title
      }
    }
  }
`;
