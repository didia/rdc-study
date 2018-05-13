/* eslint-env node */
const plugins = [
  'gatsby-plugin-react-helmet',
  'gatsby-transformer-sharp',
  'gatsby-transformer-json',
  'gatsby-plugin-sharp',
  'gatsby-plugin-react-next',
  'gatsby-plugin-sitemap',
  'gatsby-plugin-remove-trailing-slashes',
  'gatsby-plugin-catch-links',
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
      path: `${__dirname}/data/guides`,
      name: 'guides'
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
