/* eslint-env node */
import React from 'react';
/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

const setDevOnlyScripts = ({setHeadComponents}) => {
  if (process.env.NODE_ENV === 'production') return;

  setHeadComponents([
    <script key="ads-by-google" async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js" />,
    <script
      key="ads-by-google-script"
      dangerouslySetInnerHTML={{
        __html: `google_ad_test = "on"; (adsbygoogle = window.adsbygoogle || []).push({google_ad_client: "${process.env.GATSBY_GOOGLE_AD_CLIENT}", enable_page_level_ads: true});`
      }}
    />
  ]);
};

const setProdOnlyScripts = ({setPostBodyComponents}) => {
  if (process.env.NODE_ENV !== 'production') return;

  setPostBodyComponents([
    process.env.GATSBY_SENTRY_DSN_URL && (
      <script key="sentry-dsn" src="https://cdn.ravenjs.com/3.24.2/raven.min.js" crossOrigin="anonymous" />
    ),
    process.env.GATSBY_SENTRY_DSN_URL && (
      <script
        type="text/javascript"
        dangerouslySetInnerHTML={{
          __html: `Raven.config('${process.env.GATSBY_SENTRY_DSN_URL}').install();`
        }}
      />
    )
  ]);
};

export const onRenderBody = ({setHeadComponents, setPostBodyComponents}) => {
  setHeadComponents([
    <script key="netlify-identity-widget" async src="https://identity.netlify.com/v1/netlify-identity-widget.js" />,
    <script
      key="share-this"
      type="text/javascript"
      dangerouslySetInnerHTML={{
        __html: `
        window.onShareThisLoaded = () => {
          window.__sharethis__.on("share", ({url}) => { 
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
              category: "Social-Share",
              action: "share",
              label: url,
              event: "web-analytics"
            });
          });
        }
        `
      }}
    />
  ]);

  setPostBodyComponents([
    <script
      key="netlify-identity-script"
      dangerouslySetInnerHTML={{
        __html: `if (window.netlifyIdentity) {
        window.netlifyIdentity.on("init", user => {
          if (!user) {
            window.netlifyIdentity.on("login", () => {
              document.location.href = "/admin/";
            });
          }
        });
      }`
      }}
    />
  ]);

  setDevOnlyScripts({setHeadComponents, setPostBodyComponents});
  setProdOnlyScripts({setHeadComponents, setPostBodyComponents});
};
