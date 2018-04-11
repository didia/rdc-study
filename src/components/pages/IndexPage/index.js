// Vendor
import React from 'react';
import T from 'prop-types';
import classnames from 'classnames';

// Styles
import styles from './styles.module.scss';

import PageLayout from '../../../layouts/PageLayout';
import Banner from './Banner';
import Service from './Service';
import CountryList from './CountryList';

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
        link: '#contact-form'
      },
      trackingData: {
        category: 'Home page',
        action: 'Contact for verification service',
        label: '#contact-form'
      }
    },
    {
      descriptionTextKey: 'pages.index.services.consulting.description',
      image: images.consultingServiceImage,
      titleKey: 'pages.index.services.consulting.title',
      detailsLink: {
        isAnchor: true,
        labelKey: 'pages.index.services.consulting.learn-more-text',
        link: '#contact-form'
      },
      trackingData: {
        category: 'Home page',
        action: 'Contact for consulting service',
        label: '#contact-form'
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
          <CountryList className={styles.inner} countries={countries} />
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
