// Vendor
import React from 'react';
import T from 'prop-types';

import PageLayout from '../layouts/PageLayout';
import AboutUsPage from '../components/pages/AboutUsPage';

const Page = ({data}) => {
  const team = data.allTeamJson.edges.map(edge => edge.node);

  return (
    <PageLayout>
      <AboutUsPage team={team} />
    </PageLayout>
  );
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
              sizes(maxWidth: 350) {
                ...GatsbyImageSharpSizes
              }
            }
          }
        }
      }
    }
  }
`;
