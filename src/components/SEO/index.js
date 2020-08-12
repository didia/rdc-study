// Vendor
import React from 'react';
import {Helmet} from 'react-helmet';
import T from 'prop-types';

// Config
import config from '../../../config';

// Utils
import getCanonicalLink from '../../utils/get-canonical-link';

// eslint-disable-next-line complexity
const SEO = ({meta}) => {
  let title;
  let description;
  let imageURL;
  let imageWidth;
  let imageHeight;
  let postURL;
  let keywords;
  if (meta) {
    title = meta.title;
    description = meta.description;
    keywords = meta.keywords ? meta.keywords.join(',') : null;
    postURL = getCanonicalLink(meta.path);

    if (meta.image) {
      imageURL = meta.image.src;
      imageWidth = meta.image.width;
      imageHeight = meta.image.height;
    }
  }

  title = title || config.siteTitle;
  description = description || config.siteDescription;
  imageURL = imageURL || config.siteImage;
  keywords = keywords || config.siteKeywords;

  imageURL = `${config.siteURL}${imageURL}`;
  const blogURL = config.siteURL;
  let schemaOrgJSONLD = [
    {
      '@context': 'http://schema.org',
      '@type': 'WebSite',
      url: blogURL,
      name: title
    }
  ];
  if (meta) {
    schemaOrgJSONLD = schemaOrgJSONLD.concat([
      {
        '@context': 'http://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            item: {
              '@id': postURL,
              name: title,
              image: imageURL
            }
          }
        ]
      },
      {
        '@context': 'http://schema.org',
        '@type': 'BlogPosting',
        url: blogURL,
        name: title,
        headline: title,
        image: {
          '@type': 'ImageObject',
          url: imageURL
        },
        description
      }
    ]);
  }
  return (
    <Helmet>
      <title>{title}</title>
      <link rel="canonical" href={meta ? postURL : blogURL} />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#4c96d7" />

      {/* General tags */}
      <meta name="msapplication-TileColor" content="#ffffff" />
      <meta name="theme-color" content="#ffffff" />
      <meta name="description" content={description} />
      <meta name="image" content={imageURL} />
      <meta name="keywords" content={keywords} />

      {/* Schema.org tags */}
      <script type="application/ld+json">{JSON.stringify(schemaOrgJSONLD)}</script>

      {/* OpenGraph tags */}
      <meta property="og:site_name" content={config.siteTitle} />
      <meta property="og:url" content={meta ? postURL : blogURL} />
      <meta property="og:type" content={meta ? 'article' : 'website'} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" itemProp="image" content={imageURL} />
      {imageWidth && <meta property="og:image:width" content={imageWidth} />}
      {imageHeight && <meta property="og:image:height" content={imageHeight} />}
      <meta property="fb:app_id" content={config.siteFBAppID} />

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageURL} />
    </Helmet>
  );
};

SEO.propTypes = {
  meta: T.shape({
    description: T.string,
    image: T.shape({
      src: T.string,
      width: T.number,
      height: T.number
    }),
    keywords: T.arrayOf(T.string),
    path: T.string,
    title: T.string
  })
};

export default SEO;
