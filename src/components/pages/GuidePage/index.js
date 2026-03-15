'use client';

// Vendor
import React from 'react';
import {FormattedMessage} from 'react-intl';
import Link from 'next/link';

// Styles
import styles from './styles.module.scss';

import GenericPage from '../GenericPage';
import GuideList from '../../GuideList';
import HtmlContent from '../../HtmlContent';

const Assistance = ({guideSlug}) => (
  <div>
    <FormattedMessage id="pages.guides-show.assistance.title">
      {(text) => <h2 className="major">{text}</h2>}
    </FormattedMessage>

    <div>
      <FormattedMessage id="pages.guides-show.assistance.description-1" tagName="div" />

      <FormattedMessage id="pages.guides-show.assistance.description-2" tagName="div" />

      <div className={styles['call-to-action-wrapper']}>
        <FormattedMessage id="pages.index.banner.call-to-action-button-text">
          {(text) => (
            <Link href={`/accompagnement?pour=${guideSlug}`} className="button special call-to-action">
              {text}
            </Link>
          )}
        </FormattedMessage>
      </div>
    </div>
  </div>
);

const GuidePage = ({guide, otherGuides, relatedGuides}) => {
  const pageWrapperClassName = styles[`page-wrapper--${guide.slug}`];
  const bannerClassName = styles[`banner--${guide.slug}`];
  const footerClassName = styles[`footer--${guide.slug}`];

  const page = {
    description: guide.excerpt,
    image: guide.metaImage,
    path: guide.path,
    title: guide.title,
    socialShareEnabled: true
  };

  return (
    <GenericPage
      bannerClassName={bannerClassName}
      footerClassName={footerClassName}
      page={page}
      pageWrapperClassName={pageWrapperClassName}
    >
      <HtmlContent content={guide.content} />

      <Assistance guideSlug={guide.slug} />

      {relatedGuides && relatedGuides.length > 0 && (
        <GuideList guides={relatedGuides} titleKey="pages.guides-show.related-guides.title" />
      )}

      {otherGuides && otherGuides.length > 0 && (
        <GuideList guides={otherGuides} titleKey="pages.guides-show.other-guides.title" />
      )}
    </GenericPage>
  );
};

export default GuidePage;
