'use client';

import React from 'react';
import Image from 'next/image';
import {useIntl} from 'react-intl';

import styles from './styles.module.scss';
import ui from '../ui.module.scss';
import {Section, SectionHead} from '../Section';
import config from '../../../../config';

const TESTIMONIAL_IDS = ['1', '2', '3'];
const AI_ASSISTANT_IDS = ['chatgpt', 'claude', 'gemini'];

/**
 * Student testimonials and AI-assistant answers. Hidden unless `config.features.testimonials` is on.
 * Content lives in fr.json under `site.testimonials.*`. To show a photo for testimonial N, add
 * `site.testimonials.items.N.photo` (path under /public, e.g. "/images/uploads/jane.jpg"); without it a placeholder is shown.
 */
const Testimonials = ({tone = 'light'}) => {
  const intl = useIntl();

  if (!config.features.testimonials) return null;

  const t = (id) => intl.formatMessage({id: `site.testimonials.${id}`});
  const photoKey = (id) => `site.testimonials.items.${id}.photo`;

  return (
    <Section tone={tone}>
      <SectionHead eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')} />

      <div className={ui.grid3}>
        {TESTIMONIAL_IDS.map((id) => (
          <figure key={id} className={styles.card}>
            {intl.messages[photoKey(id)] ? (
              <Image
                className={styles.avatar}
                src={intl.formatMessage({id: photoKey(id)})}
                alt={t(`items.${id}.name`)}
                width={56}
                height={56}
              />
            ) : (
              <div className={styles.avatar}>{t('photo-placeholder')}</div>
            )}
            <blockquote>{t(`items.${id}.quote`)}</blockquote>
            <figcaption>
              <b>{t(`items.${id}.name`)}</b>
              <span>{t(`items.${id}.role`)}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className={styles.ai}>
        <div className={styles.aiLabel}>{t('ai.title')}</div>
        <div className={styles.aiGrid}>
          {AI_ASSISTANT_IDS.map((id) => (
            <figure key={id} className={styles.card}>
              <blockquote>{t(`ai.items.${id}.quote`)}</blockquote>
              <figcaption>
                <b>{t(`ai.items.${id}.name`)}</b>
                <span>{t(`ai.items.${id}.caption`)}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default Testimonials;
