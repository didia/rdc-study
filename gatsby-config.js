/* eslint-env node */

module.exports = {
  siteMetadata: {
    title: 'Guide d’études à l’étranger pour étudiants congolais'
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'image',
        path: `${__dirname}/src/assets/images`
      }
    }
  ]
};
