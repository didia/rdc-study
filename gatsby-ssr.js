/* eslint-env node */
import React from 'react';
/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

exports.onRenderBody = ({setHeadComponents}) => {
  // Ads is currently disabled until we are ready for approbation
  if (process.env.NODE_ENV === 'production') return;

  return setHeadComponents([
    <script key="ads-by-google" async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js" />,
    <script
      key="ads-by-google-script"
      dangerouslySetInnerHTML={{
        __html: `google_ad_test = "on"; (adsbygoogle = window.adsbygoogle || []).push({google_ad_client: "${
          process.env.GATSBY_GOOGLE_AD_CLIENT
        }", enable_page_level_ads: true});`
      }}
    />
  ]);
};
