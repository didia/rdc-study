// Vendor
import React from 'react';
import {graphql} from 'gatsby';
import T from 'prop-types';

import AssistanceProcess from '../components/pages/AssistanceProcess';

const Assistance = ({data}) => {
  const assistancePackages = data.assistancePackages.edges.reduce((accumulator, {node}) => {
    accumulator[node.frontmatter.slug] = {
      content: node.html,
      title: node.frontmatter.title,
      slug: node.frontmatter.slug
    };

    return accumulator;
  }, {});

  const services = data.services.edges.reduce((accumulator, {node}) => {
    accumulator.push(node.frontmatter);
    return accumulator;
  }, []);

  return <AssistanceProcess assistancePackages={assistancePackages} services={services} />;
};

Assistance.propTypes = {
  data: T.shape({
    assistancePackages: T.object.isRequired,
    services: T.object.isRequired
  })
};

export default Assistance;
export const pageQuery = graphql`
  query AssistanceProcessPageQuery {
    assistancePackages: allMarkdownRemark(filter: {fields: {type: {eq: "assistance-package"}}}) {
      edges {
        node {
          html
          frontmatter {
            slug
            title
          }
        }
      }
    }

    services: allMarkdownRemark(filter: {fields: {type: {eq: "service"}}}) {
      edges {
        node {
          frontmatter {
            slug
            price
            assistanceFormServiceChoiceLabel
            assistanceFormConfirmationTitle
            assistanceFormConfirmationFirstParagraph
            assistanceFormConfirmationSecondParagraph
          }
        }
      }
    }
  }
`;
