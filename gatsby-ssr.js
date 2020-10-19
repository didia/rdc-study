/* eslint-env node */
import React from 'react';
/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

export const onRenderBody = ({setPostBodyComponents}) => {
  setPostBodyComponents([
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
};
