/* eslint-env node */

exports.onClientEntry = () => {
  return new Promise((resolve, reject) => {
    window.__polyfillio__ = () => {
      resolve();
    };

    const features = [];

    if (!('Intl' in window)) {
      const locale = window.location.pathname.split('/')[1];
      features.push(`Intl.~locale.${locale}`);
    }

    if (!('Set' in window)) {
      features.push('Set');
    }

    if (features.length) {
      const s = document.createElement('script');
      s.src = `https://cdn.polyfill.io/v2/polyfill.min.js?features=${features.join(
        ','
      )}&rum=1&flags=always&callback=__polyfillio__`;
      s.async = true;
      s.onerror = reject;
      document.head.appendChild(s);
    } else {
      resolve();
    }
  });
};
