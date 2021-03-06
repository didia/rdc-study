// Vendor
import React from 'react';
import {FormattedMessage} from 'react-intl';
import {useStaticQuery, graphql, Link} from 'gatsby';
import Img from 'gatsby-image';

// Styles
import styles from './styles.module.scss';

const Banner = () => {
  const data = useStaticQuery(graphql`
    query LogoQuery {
      imageSharp(fluid: {originalName: {regex: "/logo.png/"}}) {
        fluid(maxWidth: 60) {
          ...GatsbyImageSharpFluid
          presentationWidth
          presentationHeight
        }
      }
    }
  `);

  return (
    <section className={styles.banner}>
      <div className={styles.wrapper}>
        <div className={styles.logo}>
          <div className={styles.logo__icon}>
            <Img
              fluid={data.imageSharp.fluid}
              style={{width: data.imageSharp.fluid.presentationWidth, height: data.imageSharp.fluid.presentationHeight}}
              alt="RDC Etudes Logo"
            />
          </div>
        </div>

        <FormattedMessage id="pages.index.banner.title">
          {(text) => <h2 className={styles.title}>{text}</h2>}
        </FormattedMessage>

        <FormattedMessage id="pages.index.banner.description">
          {(text) => <p className={styles.description}>{text}</p>}
        </FormattedMessage>

        <div className={styles['call-to-action-wrapper']}>
          <FormattedMessage id="pages.index.banner.call-to-action-button-text">
            {(text) => (
              <Link to="/accompagnement" className="button special call-to-action">
                {text}
              </Link>
            )}
          </FormattedMessage>
        </div>
      </div>
    </section>
  );
};

export default Banner;
