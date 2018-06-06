// Vendor
import React from 'react';
import Helmet from 'react-helmet';
import T from 'prop-types';

import config from '../../../config';

// eslint-disable-next-line complexity
const SEO = ({meta}) => {
  let title;
  let description;
  let image;
  let postURL;
  let keywords;
  if (meta) {
    title = meta.title;
    description = meta.description;
    image = meta.image;
    keywords = meta.keywords;
    postURL = `${config.siteURL}${meta.path}`;
  }

  title = title || config.siteTitle;
  description = description || config.siteDescription;
  image = image || config.siteImage;
  keywords = keywords || config.siteKeywords;

  image = `${config.siteURL}${image}`;
  const blogURL = config.siteURL;
  const schemaOrgJSONLD = [
    {
      '@context': 'http://schema.org',
      '@type': 'WebSite',
      url: blogURL,
      name: title
    }
  ];
  if (meta) {
    schemaOrgJSONLD.push([
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
              image
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
          url: image
        },
        description
      }
    ]);
  }
  return (
    <Helmet>
      <title>{title}</title>
      <link rel="canonical" href={meta ? postURL : blogURL} />
      {/* General tags */}
      <meta name="description" content={description} />
      <meta name="image" content={image} />
      <meta name="keywords" content={keywords} />

      {/* Schema.org tags */}
      <script type="application/ld+json">{JSON.stringify(schemaOrgJSONLD)}</script>

      {/* OpenGraph tags */}
      <meta property="og:url" content={meta ? postURL : blogURL} />
      <meta property="og:type" content={meta ? 'article' : 'website'} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="fb:app_id" content={config.siteFBAppID} />

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

SEO.propTypes = {
  meta: T.shape({
    description: T.string,
    image: T.string,
    path: T.string,
    title: T.string
  })
};

export default SEO;
