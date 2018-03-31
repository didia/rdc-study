/* eslint-disable complexity */
/* eslint-env node */

/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const {cssModulesConfig} = require(`gatsby-1-config-css-modules`);
const {extractTextPlugin} = require(`gatsby-1-config-extract-plugin`);
const path = require('path');

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
        loaders: [`style`, `css`, `postcss`, sassLoader, sassResourceLoader]
      });

      config.loader(`sassModules`, {
        test: sassModulesFiles,
        loaders: [`style`, cssModulesConfig(stage), `postcss`, sassLoader, sassResourceLoader]
      });
      return config;
    }
    case `build-css`: {
      config.loader(`sass`, {
        test: sassFiles,
        exclude: sassModulesFiles,
        loader: extractTextPlugin(stage).extract([`css?minimize`, `postcss`, sassLoader, sassResourceLoader])
      });

      config.loader(`sassModules`, {
        test: sassModulesFiles,
        loader: extractTextPlugin(stage).extract(`style`, [
          cssModulesConfig(stage),
          `postcss`,
          sassLoader,
          sassResourceLoader
        ])
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
        loader: extractTextPlugin(stage).extract(`style`, [
          cssModulesConfig(stage),
          `postcss`,
          sassLoader,
          sassResourceLoader
        ])
      });

      return config;
    }
    default: {
      return config;
    }
  }
};

exports.onCreateNode = ({node, boundActionCreators, getNode}) => {
  const {createNodeField} = boundActionCreators;

  if (node.internal.type === 'MarkdownRemark') {
    const fileNode = getNode(node.parent);
    const parsedFilePath = path.parse(fileNode.dir);

    if (parsedFilePath.name === 'guides' && node.frontmatter && node.frontmatter.slug) {
      createNodeField({node, name: 'path', value: `/guides/${node.frontmatter.slug}`});
    }
  }
};

exports.createPages = ({boundActionCreators, graphql}) => {
  const {createPage} = boundActionCreators;

  const guideTemplate = path.resolve(`src/templates/guideTemplate.js`);

  return graphql(`
    {
      allMarkdownRemark(sort: {order: DESC, fields: [frontmatter___date]}, limit: 1000) {
        edges {
          node {
            frontmatter {
              slug
              title
            }
            fields {
              path
            }
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      return Promise.reject(result.errors);
    }

    result.data.allMarkdownRemark.edges.forEach(({node}) => {
      createPage({
        path: node.fields.path,
        component: guideTemplate,
        context: {
          slug: node.frontmatter.slug
        }
      });
    });
  });
};
