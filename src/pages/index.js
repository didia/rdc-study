// Vendor
import React from 'react';
import T from 'prop-types';

import PageLayout from '../layouts/PageLayout';
import IndexPage from '../components/pages/IndexPage';

const Index = ({data}) => {
  return (
    <PageLayout>
      <IndexPage images={data} />
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

// eslint-disable-next-line no-undef
export const pageQuery = graphql`
  query PageQuery {
    canadaThumbnailImage: imageSharp(id: {regex: "/canada.jpg/"}) {
      sizes(maxHeight: 500) {
        ...GatsbyImageSharpSizes
      }
    }
    consultingServiceImage: imageSharp(id: {regex: "/consulting-service.jpg/"}) {
      sizes(maxWidth: 276) {
        ...GatsbyImageSharpSizes
      }
    }
    franceThumbnailImage: imageSharp(id: {regex: "/france.jpg/"}) {
      sizes(maxHeight: 500) {
        ...GatsbyImageSharpSizes
      }
    }
    freeGuideImage: imageSharp(id: {regex: "/free-guide.jpg/"}) {
      sizes(maxWidth: 276) {
        ...GatsbyImageSharpSizes
      }
    }
    usaThumbnailImage: imageSharp(id: {regex: "/usa.jpg/"}) {
      sizes(maxHeight: 500) {
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
