'use client';

// Vendor
import React from 'react';
import classnames from 'classnames';
import Image from 'next/image';
import {FormattedMessage} from 'react-intl';

// Styles
import styles from './styles.module.scss';

import GenericPage from '../GenericPage';
import Card from '../../Card';

const imageClassPerIndex = (index) => (index % 2 === 0 ? 'image left' : 'image right');

const page = {
  description: 'Nous voulons que tout le monde ait facilement acces a une education de qualite.',
  title: 'Pourquoi RDC-Etudes?',
  path: '/a-propos',
};

const values = [
  {
    titleKey: 'pages.about-us.values.honesty.title',
    descriptionKey: 'pages.about-us.values.honesty.description',
  },
  {
    titleKey: 'pages.about-us.values.helpfulness.title',
    descriptionKey: 'pages.about-us.values.helpfulness.description',
  },
  {
    titleKey: 'pages.about-us.values.transparency.title',
    descriptionKey: 'pages.about-us.values.transparency.description',
  },
];

const AboutUsPage = ({team}) => {
  return (
    <GenericPage page={page}>
      <section className={styles.section}>
        <FormattedMessage id="pages.about-us.values.title">
          {(text) => <h2 className={styles['text-center']}>{text}</h2>}
        </FormattedMessage>

        <div className={styles['value-list']}>
          {values.map((value, i) => (
            <Card key={`value-${i}`} className={styles['value-list__item']}>
              <FormattedMessage id={value.titleKey}>
                {(text) => <h3 className={styles['value-title']}>{text}</h3>}
              </FormattedMessage>

              <FormattedMessage id={value.descriptionKey} tagName="p" />
            </Card>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <FormattedMessage id="pages.about-us.mentors.title">
          {(text) => <h2 className={styles['text-center']}>{text}</h2>}
        </FormattedMessage>

        <div className={styles['team-member-list']}>
          {team.map((member, index) => (
            <Card key={member.name} className={styles['team-member-list__item']}>
              <div className={classnames(styles['team-member-photo-outer'], imageClassPerIndex(index))}>
                <Image src={member.image} alt={member.name} width={350} height={350} style={{objectFit: 'cover'}} />
              </div>

              <div className={styles['team-member-info']}>
                <header className={styles['team-member-info__header']}>
                  <h4 className={styles['team-member-info-name']}>{member.name}</h4>
                  <p className={styles['team-member-info-title']}>{member.title}</p>
                </header>

                <section className={styles['team-member-info__details']}>
                  <p className={styles['team-member-info-about']}>{member.about}</p>
                </section>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </GenericPage>
  );
};

export default AboutUsPage;
