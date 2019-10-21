// Vendor
import React from 'react';
import T from 'prop-types';
import classnames from 'classnames';
import Img from 'gatsby-image';

// Styles
import styles from './styles.module.scss';

// Component
import PageLayout from '../../PageLayout';
import SEO from '../../SEO';
import SocialShareButtons from '../../SocialShareButtons';

const ScholarshipPage = ({scholarship, otherScholarships, hasMoreActiveScholarships}) => {
  const page = {
    description: scholarship.excerpt,
    image: scholarship.metaImage,
    keywords: scholarship.tags,
    path: scholarship.path,
    title: scholarship.title
  };

  return (
    <PageLayout>
      <SEO key="seo" meta={page} />
      <section key="content" className={classnames(styles.wrapper, styles['wrapper--content'])}>
        <div className={styles.inner}>
          <div className={styles.cover}>
            <div className={styles['cover__image-wrapper']}>
              <Img fluid={scholarship.thumbnail.fluid} alt={scholarship.title} />
            </div>

            {scholarship.thumbnailCredits && (
              <div
                className={styles['thumbnail-credit']}
                dangerouslySetInnerHTML={{__html: scholarship.thumbnailCredits}}
              />
            )}

            <div className={styles['cover__title-excerpt-wrapper']}>
              <h1 className={styles.cover__title}>{scholarship.title}</h1>
            </div>

            <SocialShareButtons path={scholarship.path} />
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

ScholarshipPage.propTypes = {
  scholarship: T.shape({
    excerpt: T.string.isRequired,
    metaImage: T.object.isRequired,
    path: T.string.isRequired,
    tags: T.arrayOf(T.string),
    thumbnail: T.object.isRequired,
    thumbnailCredits: T.string,
    title: T.string.isRequired
  }).isRequired,
  otherScholarships: T.arrayOf(T.object).isRequired,
  hasMoreActiveScholarships: T.bool
};

export default ScholarshipPage;
