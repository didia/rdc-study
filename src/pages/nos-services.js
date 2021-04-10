// Vendor
import React from 'react';
import T from 'prop-types';
import {graphql} from 'gatsby';

import ServicesPage from '../components/pages/ServicesPage';

const Page = ({data}) => {
  const page = {
    title: 'Nous sommes là pour vous à chaque étape de votre projet d’études!',
    description:
      'Que vous soyez au tout début ne sachant pas comment vous y prendre, que vous ayez déjà obtenu votre admission ou que vous soyez déjà dans votre pays de destination, nous offrons un éventail de services qui vous permettent de réussir votre projet d’études',
    path: '/nos-services',
    socialShareEnabled: true
  };

  const services = data.allMarkdownRemark.edges.map(({node}) => node.frontmatter);

  return <ServicesPage page={page} services={services} />;
};

export default Page;

Page.propTypes = {
  data: T.shape({
    allMarkdownRemark: T.object.isRequired
  })
};

export const pageQuery = graphql`
  query ServicesPageQuery {
    allMarkdownRemark(
      limit: 1000
      sort: {fields: [frontmatter___rank], order: ASC}
      filter: {fields: {type: {eq: "service"}}}
    ) {
      edges {
        node {
          frontmatter {
            slug
            title
            price
            excerpt
          }
        }
      }
    }
  }
`;
