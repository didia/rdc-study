/* eslint-disable complexity */
/* eslint-env node */

/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require('path');

const CONTENT_TYPE = {
  ARTICLE: 'article',
  GUIDE: 'guide',
  SCHOLARSHIP: 'scholarship'
};

exports.onCreateNode = ({node, actions, getNode}) => {
  const {createNodeField} = actions;

  if (node.internal.type === 'MarkdownRemark') {
    const fileNode = getNode(node.parent);

    if (fileNode.dir.indexOf('guides') !== -1 && node.frontmatter && node.frontmatter.slug) {
      createNodeField({node, name: 'path', value: `/guides/${node.frontmatter.slug}`});
      createNodeField({node, name: 'type', value: CONTENT_TYPE.GUIDE});
    } else if (fileNode.dir.indexOf('articles') !== -1) {
      createNodeField({node, name: 'path', value: `/articles/${fileNode.name}`});
      createNodeField({node, name: 'type', value: CONTENT_TYPE.ARTICLE});
    } else if (fileNode.dir.indexOf('scholarships') !== -1) {
      createNodeField({node, name: 'path', value: `/bourses/${fileNode.name}`});
      createNodeField({node, name: 'type', value: CONTENT_TYPE.SCHOLARSHIP});

      const deadlineTimestamp = node.frontmatter.deadline
        ? new Date(node.frontmatter.deadline).getTime()
        : Number.MAX_SAFE_INTEGER;

      createNodeField({node, name: 'timestamp', value: deadlineTimestamp});
    }
  }
};

exports.onCreatePage = ({page, actions}) => {
  const {createPage, deletePage} = actions;

  deletePage(page);
  // You can access the variable "house" in your page queries now
  createPage({
    ...page,
    context: {
      ...page.context,
      currentTimestamp: Date.now()
    }
  });
};

exports.createPages = ({actions, graphql}) => {
  const {createPage} = actions;

  const guideMapping = {
    [CONTENT_TYPE.ARTICLE]: path.resolve('src/templates/articleTemplate.js'),
    [CONTENT_TYPE.GUIDE]: path.resolve('src/templates/guideTemplate.js'),
    [CONTENT_TYPE.SCHOLARSHIP]: path.resolve('src/templates/scholarshipTemplate.js')
  };

  return graphql(`
    {
      allMarkdownRemark(sort: {order: DESC, fields: [frontmatter___date]}) {
        edges {
          node {
            fields {
              path
              type
            }
            frontmatter {
              active
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
      if (node.fields.type === CONTENT_TYPE.GUIDE && !node.frontmatter.active) return;

      createPage({
        path: node.fields.path,
        component: guideMapping[node.fields.type],
        context: {
          type: node.fields.type
        }
      });
    });
  });
};
