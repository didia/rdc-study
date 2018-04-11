// Vendor
import React from 'react';
import T from 'prop-types';

// Styles
import styles from './styles.module.scss';

import GenericPage from '../GenericPage';

const CountryGuidePage = ({country}) => {
  const pageWrapperClassName = styles[`page-wrapper--${country.slug}`];
  const bannerClassName = styles[`banner--${country.slug}`];
  const footerClassName = styles[`footer--${country.slug}`];

  const page = {
    description: country.excerpt,
    facebookShareButtonLabelKey: 'pages.guides-show.banner.facebook-share-button-label',
    image: country.coverImage,
    path: country.path,
    title: country.title
  };

  return (
    <GenericPage
      bannerClassName={bannerClassName}
      footerClassName={footerClassName}
      page={page}
      pageWrapperClassName={pageWrapperClassName}
    >
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
    slug: T.string.isRequired,
    title: T.string.isRequired
  })
};

export default CountryGuidePage;
