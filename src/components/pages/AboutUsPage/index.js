'use client';

// Vendor
import React from 'react';
import Image from 'next/image';
import {useIntl} from 'react-intl';

// Styles
import styles from './styles.module.scss';

// Components
import SiteLayout from '../../site/SiteLayout';
import {Section, PageBanner, SectionHead} from '../../site/Section';
import {Positioning} from '../../site/Sections';
import Testimonials from '../../site/Testimonials';

const VALUE_IDS = ['reliability', 'transparency', 'honesty', 'helpfulness'];
const AboutUsPage = ({team, countryNames}) => {
  const intl = useIntl();
  const t = (id, values) => intl.formatMessage({id: `site.about.${id}`}, values);
  const stats = [
    {label: t('stats.families.label'), value: intl.formatMessage({id: 'site.stats.families.value'})},
    {
      label: t('stats.countries.label', {countries: countryNames.join(', ')}),
      value: countryNames.length
    },
    {label: t('stats.free.label'), value: t('stats.free.value')}
  ];

  return (
    <SiteLayout active="/a-propos" newsletterTone="dark">
      <PageBanner eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')} />

      <Positioning tone="dark" />

      <Section tone="light">
        <SectionHead eyebrow={t('stats.eyebrow')} title={t('stats.title')} />
        <div className={styles.stats}>
          {stats.map((stat) => (
            <div key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="white">
        <SectionHead eyebrow={t('values.eyebrow')} title={t('values.title')} />
        <div className={styles.values}>
          {VALUE_IDS.map((id) => (
            <div key={id}>
              <h3>{t(`values.${id}.title`)}</h3>
              <p>{t(`values.${id}.text`)}</p>
            </div>
          ))}
        </div>
      </Section>

      {team.length > 0 && (
        <Section tone="light">
          <SectionHead eyebrow={t('team.eyebrow')} title={t('team.title')} />
          <div className={styles.team}>
            {team.map((member) => (
              <article key={member.name} className={styles.member}>
                <div className={styles.photo}>
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={350}
                    height={350}
                    style={{objectFit: 'cover', width: '100%', height: '100%'}}
                  />
                </div>
                <div>
                  <h3>{member.name}</h3>
                  <span className={styles.memberTitle}>{member.title}</span>
                  <p>{member.role}</p>
                  <p>{member.about}</p>
                </div>
              </article>
            ))}
          </div>
        </Section>
      )}

      <Testimonials tone="white" />
    </SiteLayout>
  );
};

export default AboutUsPage;
