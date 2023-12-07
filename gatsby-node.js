exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions;

  const guideTemplate = require.resolve(`./src/templates/guideTemplate.js`);
  const articleTemplate = require.resolve(`./src/templates/articleTemplate.js`);

  // Guide Query
  const guideQuery = await graphql(`
    query GuideCountryPagesQuery {
      allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/guides/" } }
      ) {
        edges {
          node {
            frontmatter {
              slug
            }
          }
        }
      }
    }
  `);
  if (guideQuery.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`);
    return;
  }
  guideQuery.data.allMarkdownRemark.edges.forEach(({ node }) => {
    createPage({
      path: node.frontmatter.slug,
      component: guideTemplate,
      context: {
        slug: node.frontmatter.slug,
      },
    });
  });

  // Article Query
    const articleQuery = await graphql(`
      query ArticleQuery {
        allMarkdownRemark(
          filter: { fileAbsolutePath: { regex: "/articles/" } }
        ) {
          edges {
            node {
              frontmatter {
                slug
              }
            }
          }
        }
      }
    `);
    if (articleQuery.errors) {
      reporter.panicOnBuild(`Error while running GraphQL query.`);
      return;
    }
    articleQuery.data.allMarkdownRemark.edges.forEach(({ node }) => {
      createPage({
        path: node.frontmatter.slug,
        component: articleTemplate,
        context: {
          slug: node.frontmatter.slug,
        },
      });
    });
};

exports.createSchemaCustomization = ({ actions }) => {
  actions.createTypes(`
    type MarkdownRemarkFrontmatter {
      date: Date @dateformat
    }

    type MarkdownRemark implements Node {
      frontmatter: MarkdownRemarkFrontmatter
    }
  `);
};
