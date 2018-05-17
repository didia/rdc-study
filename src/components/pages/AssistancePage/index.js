// Vendor
import React from 'react';
import T from 'prop-types';
import classnames from 'classnames';
import Link from 'gatsby-link';
import {FormattedMessage} from 'react-intl';

// Styles
import styles from './styles.module.scss';

import GenericPage from '../GenericPage';

const FeatureList = ({featureLabelKeys, className}) => (
  <ul className={classnames(styles['feature-list'], className)}>
    {featureLabelKeys.map((featureLabelKey, i) => (
      <FormattedMessage key={`feature-${i}`} id={featureLabelKey}>
        {text => <li className={classnames('icon fa-check-circle', styles['feature-item'])}>{text}</li>}
      </FormattedMessage>
    ))}
  </ul>
);

FeatureList.propTypes = {
  className: T.string,
  featureLabelKeys: T.arrayOf(T.string).isRequired
};

const page = {
  description:
    'Ce qui nous rend différents des autres c’est que nous ne transigeons pas avec nos valeurs de serviabilité, de transparence et d’honnêteté. Nous vous offrons un service d’assistance qui correspond à vos besoins.',
  title: 'Nous vous assistons dans vos démarches',
  path: '/accompagnement'
};

const freeTierFeatureLabelKeys = [
  'pages.assistance.free.features.admission-guide',
  'pages.assistance.free.features.visa-guide',
  'pages.assistance.free.features.countries-guide',
  'pages.assistance.free.features.protection-guide'
];

const packages = [
  {
    titleKey: 'pages.assistance.packages.admission.title',
    priceKey: 'pages.assistance.packages.admission.pricing',
    featureLabelKeys: [
      'pages.assistance.packages.admission.features.program-choice',
      'pages.assistance.packages.admission.features.university-choice',
      'pages.assistance.packages.admission.features.application',
      'pages.assistance.packages.admission.features.application-documents'
    ]
  },
  {
    titleKey: 'pages.assistance.packages.visa.title',
    priceKey: 'pages.assistance.packages.visa.pricing',
    featureLabelKeys: [
      'pages.assistance.packages.visa.features.application-documents',
      'pages.assistance.packages.visa.features.application-proof',
      'pages.assistance.packages.visa.features.fill-forms',
      'pages.assistance.packages.visa.features.interview'
    ]
  },
  {
    titleKey: 'pages.assistance.packages.full.title',
    priceKey: 'pages.assistance.packages.full.pricing',
    featureLabelKeys: [
      'pages.assistance.packages.full.features.admission',
      'pages.assistance.packages.full.features.visa',
      'pages.assistance.packages.full.features.on-arrival',
      'pages.assistance.packages.full.features.first-year'
    ]
  }
];

const AssistancePage = () => {
  return (
    <GenericPage page={page} bannerClassName={styles.banner}>
      <section className={classnames(styles.card, styles['card--main'])}>
        <header className={styles['column--left']}>
          <FormattedMessage id="pages.assistance.free.title">
            {text => <p className={styles.pricing}>{text}</p>}
          </FormattedMessage>

          <FormattedMessage id="pages.assistance.free.description">{text => <p>{text}</p>}</FormattedMessage>

          <FormattedMessage id="pages.assistance.free.guide-link-text">
            {text => (
              <Link to="/#guides" className={classnames(styles.button, 'button special')}>
                {text}
              </Link>
            )}
          </FormattedMessage>
        </header>

        <FeatureList className={styles['column--right']} featureLabelKeys={freeTierFeatureLabelKeys} />
      </section>

      <section className={styles['offer-block']}>
        <FormattedMessage id="pages.assistance.personal.title">{text => <h2>{text}</h2>}</FormattedMessage>

        <FormattedMessage id="pages.assistance.personal.description">{text => <p>{text}</p>}</FormattedMessage>

        <FormattedMessage id="pages.assistance.personal.about-us-link">
          {text => (
            <Link to="/a-propos" className={classnames(styles.button, 'button special')}>
              {text}
            </Link>
          )}
        </FormattedMessage>
      </section>

      <section className={styles['offer-block']}>
        <FormattedMessage id="pages.assistance.packages.title">{text => <h2>{text}</h2>}</FormattedMessage>

        <FormattedMessage id="pages.assistance.packages.description">{text => <p>{text}</p>}</FormattedMessage>

        <ul className={styles['rate-list']}>
          {packages.map((ratePackage, i) => (
            <li key={`feature-${i}`} className={classnames(styles.card, styles['rate-list__item'])}>
              <FormattedMessage id={ratePackage.titleKey}>
                {text => <h3 className={styles['rate-title']}>{text}</h3>}
              </FormattedMessage>

              <FormattedMessage id={ratePackage.priceKey}>
                {text => <p className={styles.pricing}>{text}</p>}
              </FormattedMessage>

              <FeatureList featureLabelKeys={ratePackage.featureLabelKeys} />

              <FormattedMessage id="general.contact-us-text">
                {text => (
                  <Link to="#contact" className={classnames(styles.button, 'button fit special small')}>
                    {text}
                  </Link>
                )}
              </FormattedMessage>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles['offer-block']}>
        <h2>Des questions?</h2>
        <p>Vous ne savez pas où commencer? Nous sommes là pour vous aider.</p>
        <Link to="/a-props" className={classnames(styles.button, 'button special')}>
          Contactez-nous
        </Link>
      </section>
    </GenericPage>
  );
};

export default AssistancePage;
