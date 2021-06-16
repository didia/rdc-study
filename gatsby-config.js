/* eslint-env node */
const netlifyCmsPaths = {
  resolve: `gatsby-plugin-netlify-cms-paths`,
  options: {
    cmsConfig: `/static/admin/config.yml`
  }
};

const plugins = [
  'gatsby-plugin-netlify-cache',
  'gatsby-plugin-react-helmet',
  'gatsby-transformer-json',
  netlifyCmsPaths,
  'gatsby-transformer-sharp',
  'gatsby-plugin-sharp',
  'gatsby-plugin-remove-trailing-slashes',
  'gatsby-plugin-catch-links',
  'gatsby-plugin-use-query-params',
  {
    resolve: 'gatsby-plugin-webpack-bundle-analyzer',
    options: {
      production: process.env.WITH_BUNDLE_ANALYZER != null,
      disable: !process.env.WITH_BUNDLE_ANALYZER
    }
  },
  {
    resolve: 'gatsby-plugin-netlify-cms',
    options: {
      enableIdentityWidget: false
    }
  },
  {
    resolve: 'gatsby-plugin-sitemap',
    options: {
      query: `
          {
            site {
              siteMetadata {
                siteUrl
              }
            }
            allSitePage(
              filter: {
                path: { regex: "/^(?!/404/|/404.html|/dev-404-page/)/" }
              }
            ) {
              edges {
                node {
                  path
                }
              }
            }
          }
        `,
      output: '/sitemap.xml',
      serialize: ({site, allSitePage}) =>
        allSitePage.edges.map((edge) => ({
          url: `${site.siteMetadata.siteUrl + edge.node.path}/`,
          changefreq: 'daily',
          priority: 0.7
        }))
    }
  },
  {
    resolve: 'gatsby-plugin-manifest',
    options: {
      name: 'RDC Etudes - Votre source d’informations sur les études à l’étranger!',
      short_name: 'RDC Études',
      start_url: '/',
      background_color: '#ffffff',
      theme_color: '#ffffff',
      display: 'standalone',
      icon: 'static/logo.png'
    }
  },
  {
    resolve: 'gatsby-plugin-sass',
    options: {
      cssLoaderOptions: {
        camelCase: false
      },
      data: '@import "shared.scss";',
      includePaths: ['src/assets/styles', 'node_modules']
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
      path: `${__dirname}/data/pages`,
      name: 'pages'
    }
  },
  {
    resolve: 'gatsby-source-filesystem',
    options: {
      path: `${__dirname}/data/scholarships`,
      name: 'scholarships'
    }
  },
  {
    resolve: 'gatsby-source-filesystem',
    options: {
      path: `${__dirname}/data/services`,
      name: 'services'
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
  },
  'gatsby-plugin-netlify',
  {
    resolve: 'gatsby-plugin-html-attributes',
    options: {
      lang: 'fr'
    }
  },
  {
    resolve: 'gatsby-plugin-sentry',
    options: {
      dsn: process.env.GATSBY_SENTRY_DSN_URL,
      environment: process.env.NODE_ENV,
      enabled: (() => ['production', 'stage'].indexOf(process.env.NODE_ENV) !== -1)()
    }
  },
  'gatsby-plugin-offline'
];

module.exports = {
  siteMetadata: {
    siteUrl: 'https://www.rdcetudes.com'
  },
  plugins
};
