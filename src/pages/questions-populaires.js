// Vendor
import React from 'react';
import T from 'prop-types';
import {graphql} from 'gatsby';

import FaqsPage from '../components/pages/FaqsPage';

const Page = ({data}) => {
  return <FaqsPage questions={data.allFaqsJson.edges[0].node.entries} />;
};

Page.propTypes = {
  data: T.shape({
    allFaqsJson: T.object.isRequired
  })
};

export default Page;

export const pageQuery = graphql`
  query AllFaqsQuestion {
    allFaqsJson {
      edges {
        node {
          entries {
            answer
            question
          }
        }
      }
    }
  }
`;
