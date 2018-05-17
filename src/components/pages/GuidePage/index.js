// Vendor
import React from 'react';
import T from 'prop-types';

// Styles
import styles from './styles.module.scss';

import GenericPage from '../GenericPage';
import GuideList from '../../GuideList';
import Assistance from './Assistance';

const GuidePage = ({guide, otherGuides, relatedGuides}) => {
  const pageWrapperClassName = styles[`page-wrapper--${guide.slug}`];
  const bannerClassName = styles[`banner--${guide.slug}`];
  const footerClassName = styles[`footer--${guide.slug}`];

  const page = {
    description: guide.excerpt,
    facebookShareButtonLabelKey: 'pages.guides-show.banner.facebook-share-button-label',
    image: guide.coverImage,
    path: guide.path,
    title: guide.title
  };

  return (
    <GenericPage
      bannerClassName={bannerClassName}
      footerClassName={footerClassName}
      page={page}
      pageWrapperClassName={pageWrapperClassName}
    >
      <div dangerouslySetInnerHTML={{__html: guide.content}} />

      <Assistance />

      {relatedGuides &&
        relatedGuides.length > 0 && (
          <GuideList guides={relatedGuides} titleKey="pages.guides-show.related-guides.title" />
        )}

      {otherGuides &&
        otherGuides.length > 0 && <GuideList guides={otherGuides} titleKey="pages.guides-show.other-guides.title" />}
    </GenericPage>
  );
};

GuidePage.propTypes = {
  guide: T.shape({
    content: T.string.isRequired,
    coverImage: T.string.isRequired,
    excerpt: T.string.isRequired,
    path: T.string.isRequired,
    slug: T.string.isRequired,
    title: T.string.isRequired
  }).isRequired,
  otherGuides: T.arrayOf(T.object),
  relatedGuides: T.arrayOf(T.object)
};

export default GuidePage;
