// Vendor
import React from 'react';
import T from 'prop-types';

import GenericPage from '../GenericPage';

const CountryGuidePage = ({country}) => {
  const page = {
    description: country.excerpt,
    facebookShareButtonLabelKey: 'pages.guides-show.banner.facebook-share-button-label',
    image: country.coverImage,
    path: country.path,
    title: country.title
  };
  return (
    <GenericPage page={page}>
      <div dangerouslySetInnerHTML={{__html: country.content}} />
    </GenericPage>
  );
};

CountryGuidePage.propTypes = {
  country: T.shape({
    content: T.string.isRequired,
    coverImage: T.string.isRequired,
    excerpt: T.string.isRequired,
    path: T.string.isRequired,
    title: T.string.isRequired
  })
};

export default CountryGuidePage;
