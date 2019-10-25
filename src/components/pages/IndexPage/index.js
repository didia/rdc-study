// Vendor
import React from 'react';
import T from 'prop-types';
import classnames from 'classnames';

// Styles
import styles from './styles.module.scss';

import PageLayout from '../../PageLayout';
import Banner from './Banner';
import Service from './Service';
import GuideList from '../../GuideList';
import ArticleList from '../../ArticleList';
import ScholarshipList from '../../ScholarshipList';

const IndexPage = ({articles, countries, scholarships, hasMoreArticles, images}) => {
  const services = [
    {
      descriptionTextKey: 'pages.index.services.assistance.description',
      image: images.consultingServiceImage,
      titleKey: 'pages.index.services.assistance.title',
      detailsLink: {
        isAnchor: false,
        labelKey: 'pages.index.services.assistance.learn-more-text',
        link: '/accompagnement'
      },
      trackingData: {
        category: 'Home page',
        action: 'Contact for assistance service',
        label: '/accompagnement'
      }
    },
    {
      descriptionTextKey: 'pages.index.services.verification.description',
      image: images.verificationServiceImage,
      titleKey: 'pages.index.services.verification.title',
      detailsLink: {
        isAnchor: true,
        labelKey: 'pages.index.services.verification.contact-us-text',
        link: '#contact'
      },
      trackingData: {
        category: 'Home page',
        action: 'Contact for verification service',
        label: '#contact'
      }
    },
    {
      descriptionTextKey: 'pages.index.services.study-guide.description',
      image: images.freeGuideImage,
      titleKey: 'pages.index.services.study-guide.title',
      detailsLink: {
        isAnchor: true,
        labelKey: 'pages.index.services.study-guide.explore-text',
        link: '#guides'
      },
      trackingData: {
        category: 'Home page',
        action: 'Explore guides',
        label: '#guides'
      }
    }
  ];

  return (
    <PageLayout headerWithTitle={true}>
      <Banner />

      <section>
        <section className={classnames(styles.wrapper, styles['wrapper--country-list'])}>
          <GuideList
            id="guides"
            className={styles.inner}
            guides={countries}
            titleKey="pages.index.country-list.title"
          />
        </section>

        <section className={classnames(styles.wrapper, styles['wrapper--article-list'])}>
          <ArticleList
            className={styles.inner}
            articles={articles}
            hasMoreArticles={hasMoreArticles}
            titleKey="pages.index.article-list.title"
          />
        </section>

        <section className={classnames(styles.wrapper, styles['wrapper--scholarship-list'])}>
          <ScholarshipList
            showAllScholarshipsLink
            className={styles.inner}
            scholarships={scholarships}
            titleKey="pages.index.scholarship-list.title"
          />
        </section>

        {services.map((service, i) => (
          <section
            key={i}
            className={classnames(styles.wrapper, styles['wrapper--service'], styles[`wrapper--at-position-${i + 1}`])}
          >
            <Service service={service} className={styles.inner} imageWrapperClassName={styles['image-wrapper']} />
          </section>
        ))}
      </section>
    </PageLayout>
  );
};

IndexPage.propTypes = {
  articles: T.arrayOf(T.object).isRequired,
  countries: T.arrayOf(T.object).isRequired,
  scholarships: T.arrayOf(T.object).isRequired,
  hasMoreArticles: T.bool,
  images: T.shape({
    consultingServiceImage: T.object.isRequired,
    freeGuideImage: T.object.isRequired,
    verificationServiceImage: T.object.isRequired
  }).isRequired
};

export default IndexPage;
