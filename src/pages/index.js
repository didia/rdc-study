// Vendor
import React from 'react';
import T from 'prop-types';

import PageLayout from '../layouts/PageLayout';
import IndexPage from '../components/pages/IndexPage';

const Index = ({data}) => {
  const countries = data.allMarkdownRemark.edges.map(edge => ({
    excerpt: edge.node.excerpt,
    path: edge.node.fields.path,
    thumbnail: edge.node.frontmatter.thumbnail.childImageSharp,
    title: edge.node.frontmatter.title
  }));

  return (
    <PageLayout>
      <IndexPage images={data} countries={countries} />
    </PageLayout>
  );
};

Index.propTypes = {
  data: T.shape({
    consultingServiceImage: T.object.isRequired,
    freeGuideImage: T.object.isRequired,
    verificationServiceImage: T.object.isRequired
  })
};

export default Index;

export const pageQuery = graphql`
  query PageQuery {
    allMarkdownRemark(limit: 2000, sort: {fields: [frontmatter___title], order: ASC}) {
      edges {
        node {
          excerpt
          fields {
            path
          }
          frontmatter {
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
    consultingServiceImage: imageSharp(id: {regex: "/consulting-service.jpg/"}) {
      sizes(maxWidth: 276) {
        ...GatsbyImageSharpSizes
      }
    }
    freeGuideImage: imageSharp(id: {regex: "/free-guide.jpg/"}) {
      sizes(maxWidth: 276) {
        ...GatsbyImageSharpSizes
      }
    }
    verificationServiceImage: imageSharp(id: {regex: "/verification-service.jpg/"}) {
      sizes(maxWidth: 276) {
        ...GatsbyImageSharpSizes
      }
    }
  }
`;
