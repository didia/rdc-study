// Vendor
import React from 'react';
import T from 'prop-types';
import classnames from 'classnames';
import {Link} from 'gatsby';
import {FormattedMessage} from 'react-intl';
import {RecoilRoot} from 'recoil';

// Styles
import styles from './styles.module.scss';

// Components
import GenericPage from '../GenericPage';
import ContactUsLink from '../../ContactUsLink';
import Card from '../../Card';
import AssistanceForm from '../../AssistanceForm';

const FeatureList = ({featureLabelKeys, className}) => (
  <ul className={classnames(styles['feature-list'], className)}>
    {featureLabelKeys.map((featureLabelKey, i) => (
      <FormattedMessage key={`feature-${i}`} id={featureLabelKey}>
        {(text) => <li className={classnames('icon fa-check-circle', styles['feature-item'])}>{text}</li>}
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
    titleKey: 'pages.assistance.packages.after-visa.title',
    priceKey: 'pages.assistance.packages.after-visa.pricing',
    featureLabelKeys: [
      'pages.assistance.packages.after-visa.features.travel',
      'pages.assistance.packages.after-visa.features.housing',
      'pages.assistance.packages.after-visa.features.on-arrival',
      'pages.assistance.packages.after-visa.features.first-year'
    ]
  }
];

const AssistancePage = ({assistancePackages}) => {
  return (
    <RecoilRoot>
      <GenericPage page={page} bannerClassName={styles.banner}>
        <AssistanceForm assistancePackages={assistancePackages} />

        <section className={styles['offer-block']}>
          <FormattedMessage id="pages.assistance.personal.title" tagName="h2" />

          <FormattedMessage id="pages.assistance.personal.description" tagName="p" />

          <FormattedMessage
            id="pages.assistance.personal.pricing"
            tagName="p"
            values={{
              pricePerPackage: <b>200$</b>,
              priceForAllPackages: <b>500$</b>
            }}
          />

          <ul className={styles['offer-list']}>
            {packages.map((ratePackage, i) => (
              <li key={`feature-${i}`} className={styles['offer-list__item']}>
                <Card className={styles['offer-card']}>
                  <FormattedMessage id={ratePackage.titleKey}>
                    {(text) => <h3 className={styles['offer-title']}>{text}</h3>}
                  </FormattedMessage>

                  <FeatureList featureLabelKeys={ratePackage.featureLabelKeys} />
                </Card>
              </li>
            ))}
          </ul>

          <FormattedMessage id="pages.assistance.personal.about-us-link">
            {(text) => (
              <Link to="/a-propos" className={classnames(styles.button, styles['button--about-us'], 'button special')}>
                {text}
              </Link>
            )}
          </FormattedMessage>

          <p style={{marginTop: '20px'}}>
            <FormattedMessage id="pages.assistance.visa.warning" />
            <FormattedMessage id="pages.assistance.visa.warning-learn-more">
              {(text) => <Link to="/assistance-visa">{text}</Link>}
            </FormattedMessage>
          </p>
        </section>

        <section className={styles['offer-block']}>
          <FormattedMessage id="pages.assistance.questions.title" tagName="h2" />

          <FormattedMessage id="pages.assistance.questions.description" tagName="p" />

          <ContactUsLink className={classnames(styles.button, 'button special')} />
        </section>
      </GenericPage>
    </RecoilRoot>
  );
};

AssistancePage.propTypes = {
  assistancePackages: T.object.isRequired
};

export default AssistancePage;
