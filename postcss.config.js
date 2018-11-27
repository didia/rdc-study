/* eslint-env node */

const postcssImport = require(`postcss-import`);
const postCssPresetEnv = require(`postcss-preset-env`);
const postcssBrowserReporter = require(`postcss-browser-reporter`);
const postcssReporter = require(`postcss-reporter`);

module.exports = () => ({
  plugins: [postcssImport(), postCssPresetEnv(), postcssBrowserReporter(), postcssReporter()]
});
