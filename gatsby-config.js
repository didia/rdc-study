/* eslint-env node */
const netlifyCmsPaths = {
  resolve: `gatsby-plugin-netlify-cms-paths`,
  options: {
    cmsConfig: `/static/admin/config.yml`
  }
};

const plugins = [
  'gatsby-plugin-react-helmet',
  'gatsby-transformer-json',
  netlifyCmsPaths,
  'gatsby-transformer-sharp',
  'gatsby-plugin-sharp',
  'gatsby-plugin-sitemap',
  'gatsby-plugin-remove-trailing-slashes',
  'gatsby-plugin-catch-links',
  {
    resolve: 'gatsby-plugin-sass',
    options: {
      cssLoaderOptions: {
        camelCase: false
      },
      data: '@import "shared.scss";',
      includePaths: ['src/assets/styles']
    }
  },
  {
    resolve: 'gatsby-source-filesystem',
    options: {
      name: 'images',
      path: `${__dirname}/src/assets/images`
    }
  },
  {
    resolve: 'gatsby-source-filesystem',
    options: {
      name: 'uploaded-images',
      path: `${__dirname}/static/images/uploads`
    }
  },
  {
    resolve: 'gatsby-source-filesystem',
    options: {
      path: `${__dirname}/data/guides`,
      name: 'guides'
    }
  },
  {
    resolve: 'gatsby-source-filesystem',
    options: {
      path: `${__dirname}/data/articles`,
      name: 'articles'
    }
  },
  {
    resolve: 'gatsby-source-filesystem',
    options: {
      path: `${__dirname}/data/team`,
      name: 'team'
    }
  },
  {
    resolve: 'gatsby-source-filesystem',
    options: {
      path: `${__dirname}/data/faqs`,
      name: 'faqs'
    }
  },
  {
    resolve: 'gatsby-transformer-remark',
    options: {
      plugins: [
        {
          resolve: `gatsby-remark-images`,
          options: {
            maxWidth: 590
          }
        },
        'gatsby-remark-prismjs',
        'gatsby-remark-copy-linked-files',
        'gatsby-remark-smartypants'
      ]
    }
  },
  {
    resolve: 'gatsby-plugin-google-tagmanager',
    options: {
      id: process.env.GOOGLE_TAG_MANAGER_ID,
      includeInDevelopment: false
    }
  }
];

module.exports = {
  siteMetadata: {
    siteUrl: 'https://www.rdcetudes.com'
  },
  plugins
};
