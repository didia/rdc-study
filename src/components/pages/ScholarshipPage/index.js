// Vendor
import React from 'react';
import classnames from 'classnames';
import Image from 'next/image';

// Styles
import styles from './styles.module.scss';

// From styles.cover__image-wrapper: max-height 400px, width 100%
const COVER_IMAGE_WIDTH = 800;
const COVER_IMAGE_HEIGHT = 400;

// Component
import PageLayout from '../../PageLayout';
import SocialShareButtons from '../../SocialShareButtons';
import ScholarshipLevels from '../../ScholarshipLevels';
import ScholarshipDeadline from '../../ScholarshipDeadline';
import ScholarshipCountries from '../../ScholarshipCountries';
import HtmlContent from '../../HtmlContent';
import ScholarshipList from '../../../components/ScholarshipList';
import Newsletter from '../../Newsletter';

const ScholarshipPage = ({scholarship, otherScholarships}) => {
  const page = {
    description: scholarship.excerpt,
    image: scholarship.metaImage,
    keywords: scholarship.tags,
    path: scholarship.path,
    title: scholarship.title
  };

  return (
    <PageLayout>
      <section key="content" className={classnames(styles.wrapper, styles['wrapper--content'])}>
        <div className={styles.inner}>
          <div className={styles.cover}>
            <div className={styles['cover__image-wrapper']}>
              <Image
                src={scholarship.thumbnail}
                alt={scholarship.title}
                width={COVER_IMAGE_WIDTH}
                height={COVER_IMAGE_HEIGHT}
                className={styles.coverImage}
                style={{objectFit: 'cover', width: '100%', height: 'auto'}}
              />
            </div>

            {scholarship.thumbnailCredits && (
              <div
                className={styles['thumbnail-credit']}
                dangerouslySetInnerHTML={{__html: scholarship.thumbnailCredits}}
              />
            )}

            <div className={styles['cover__title-excerpt-wrapper']}>
              <h1 className={styles.cover__title}>{scholarship.title}</h1>
              <p className={styles.cover__description}>{scholarship.excerpt}</p>
              <div className={styles.cover__meta}>
                <ScholarshipCountries className={styles['cover-meta__item']} countries={scholarship.targetCountries} />
                <ScholarshipLevels className={styles['cover-meta__item']} levels={scholarship.levels} />
                <ScholarshipDeadline className={styles['cover-meta__item']} date={scholarship.deadline} />
              </div>
            </div>

            <SocialShareButtons path={scholarship.path} excerpt={scholarship.excerpt} title={scholarship.title} />
          </div>

          <HtmlContent content={scholarship.content} />

          <Newsletter className={styles.newsletter} />

          {otherScholarships && otherScholarships.length > 0 && (
            <ScholarshipList
              showAllScholarshipsLink
              scholarships={otherScholarships}
              titleKey="pages.scholarships-show.other-scholarships.title"
            />
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default ScholarshipPage;
