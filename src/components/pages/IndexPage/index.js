// Vendor
import React from 'react';
import T from 'prop-types';
import classnames from 'classnames';

// Styles
import styles from './styles.module.scss';

import PageLayout from '../../../layouts/PageLayout';
import Banner from './Banner';
import Service from './Service';
import GuideList from '../../GuideList';

const IndexPage = ({images, countries}) => {
  const services = [
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
    }
  ];

  return (
    <PageLayout headerWithTitle={true}>
      <Banner />

      <section>
        {services.map((service, i) => (
          <section
            key={i}
            className={classnames(styles.wrapper, styles['wrapper--service'], styles[`wrapper--at-position-${i + 1}`])}
          >
            <Service service={service} className={styles.inner} imageWrapperClassName={styles['image-wrapper']} />
          </section>
        ))}

        <section
          className={classnames(styles.wrapper, styles['wrapper--country-list'], styles['wrapper--at-position-1'])}
        >
          <GuideList
            id="guides"
            className={styles.inner}
            descriptionKey="pages.index.country-list.description"
            guides={countries}
            titleKey="pages.index.country-list.title"
          />
        </section>
      </section>
    </PageLayout>
  );
};

IndexPage.propTypes = {
  countries: T.arrayOf(T.object).isRequired,
  images: T.shape({
    consultingServiceImage: T.object.isRequired,
    freeGuideImage: T.object.isRequired,
    verificationServiceImage: T.object.isRequired
  }).isRequired
};

export default IndexPage;
