// Vendor
import React from 'react';
import T from 'prop-types';
import {graphql} from 'gatsby';

import AboutUsPage from '../components/pages/AboutUsPage';

const Page = ({data}) => {
  const team = data.allTeamJson.edges.map(edge => edge.node);

  return <AboutUsPage team={team} />;
};

Page.propTypes = {
  data: T.shape({
    allTeamJson: T.object.isRequired
  })
};

export default Page;

export const pageQuery = graphql`
  query AllTeamMembers {
    allTeamJson {
      edges {
        node {
          about
          name
          role
          title
          image {
            childImageSharp {
              fluid(maxWidth: 350) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
    }
  }
`;
