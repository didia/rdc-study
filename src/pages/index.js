// Vendor
import React from 'react';
import T from 'prop-types';

import PageLayout from '../layouts/PageLayout';
import IndexPage from '../components/pages/IndexPage';

const Index = ({data}) => {
  const images = {
    consultingServiceImage: data.consultingServiceImage,
    freeGuideImage: data.freeGuideImage,
    verificationServiceImage: data.verificationServiceImage
  };

  return (
    <PageLayout>
      <IndexPage images={images} />
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
