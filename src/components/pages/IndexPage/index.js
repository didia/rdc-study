// Vendor
import React from 'react';
import T from 'prop-types';

import Banner from './Banner';
import Service from './Service';

const IndexPage = ({images}) => {
  const services = [
    {
      descriptionTextKey: 'pages.index.study-guide.description',
      image: images.freeGuideImage,
      titleKey: 'pages.index.study-guide.title',
      detailsLink: {
        isAnchor: true,
        labelKey: 'pages.index.study-guide.explore-text',
        link: '#'
      }
    },
    {
      descriptionTextKey: 'pages.index.verification.description',
      image: images.verificationServiceImage,
      titleKey: 'pages.index.verification.title',
      detailsLink: {
        isAnchor: true,
        labelKey: 'pages.index.verification.contact-us-text',
        link: '#'
      }
    },
    {
      descriptionTextKey: 'pages.index.consulting.description',
      image: images.consultingServiceImage,
      titleKey: 'pages.index.consulting.title',
      detailsLink: {
        isAnchor: true,
        labelKey: 'pages.index.consulting.learn-more-text',
        link: '#'
      }
    }
  ];

  return (
    <div>
      <Banner />

      <section>
        {services.map((service, i) => <Service key={i} service={service} modifier={`at-position-${i + 1}`} />)}
      </section>
    </div>
  );
};

IndexPage.propTypes = {
  images: T.shape({
    consultingServiceImage: T.object.isRequired,
    freeGuideImage: T.object.isRequired,
    verificationServiceImage: T.object.isRequired
  }).isRequired
};

export default IndexPage;
