import React from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types'
import { useStaticQuery, graphql } from 'gatsby';

const SEO = ({ description, meta, title }) => {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            author
            description
            keywords
            siteUrl
            title
          }
        }
      }
    `
  );

    const keywords = site.siteMetadata.keywords;
    const metaDescription = description || site.siteMetadata.description;
    const defaultTitle = site.siteMetadata?.title;

    return (
      <Helmet
        htmlAttributes={{
          lang: `fr`,
        }}
        title={title}
        titleTemplate={defaultTitle ? `%s | ${defaultTitle}` : null}
        meta={[
          {
            name: `description`,
            content: metaDescription,
          },
          {
            name: `keywords`,
            content: keywords,
          },
          {
            property: `og:title`,
            content: title,
          },
          {
            property: `og:description`,
            content: metaDescription,
          },
          {
            property: `og:type`,
            content: `website`,
          },
        ].concat(meta)}
      />
    );

};

SEO.defaultProps = {
  lang: `fr`,
  meta: [],
  description: ``,
};

SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string.isRequired
};
export default SEO;