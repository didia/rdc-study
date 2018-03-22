/* eslint-disable complexity */
/* eslint-env node */

/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const {cssModulesConfig} = require(`gatsby-1-config-css-modules`);
const {extractTextPlugin} = require(`gatsby-1-config-extract-plugin`);

exports.modifyWebpackConfig = ({config, stage}, options) => {
  const sassFiles = /\.s[ac]ss$/;
  const sassModulesFiles = /\.module\.s[ac]ss$/;
  const sassLoader = `sass?${JSON.stringify(options)}`;
  const sassResourceLoader = 'sass-resources';

  config.merge({
    sassResources: './src/assets/styles/shared.scss'
  });

  switch (stage) {
    case `develop`: {
      config.loader(`sass`, {
        test: sassFiles,
        exclude: sassModulesFiles,
        loaders: [`style`, `css`, sassLoader, sassResourceLoader]
      });

      config.loader(`sassModules`, {
        test: sassModulesFiles,
        loaders: [`style`, cssModulesConfig(stage), sassLoader, sassResourceLoader]
      });
      return config;
    }
    case `build-css`: {
      config.loader(`sass`, {
        test: sassFiles,
        exclude: sassModulesFiles,
        loader: extractTextPlugin(stage).extract([`css?minimize`, sassLoader, sassResourceLoader])
      });

      config.loader(`sassModules`, {
        test: sassModulesFiles,
        loader: extractTextPlugin(stage).extract(`style`, [cssModulesConfig(stage), sassLoader, sassResourceLoader])
      });

      return config;
    }
    case `develop-html`:
    case `build-html`:
    case `build-javascript`: {
      config.loader(`sass`, {
        test: sassFiles,
        exclude: sassModulesFiles,
        loader: `null`
      });

      config.loader(`sassModules`, {
        test: sassModulesFiles,
        loader: extractTextPlugin(stage).extract(`style`, [cssModulesConfig(stage), sassLoader, sassResourceLoader])
      });

      return config;
    }
    default: {
      return config;
    }
  }
};
