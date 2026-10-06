'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import classnames from 'classnames';
import {useIntl} from 'react-intl';

import styles from './styles.module.scss';
import ui from '../ui.module.scss';
import {Section, SectionHead} from '../Section';
import config from '../../../../config';

const STEP_IDS = ['1', '2', '3', '4', '5', '6'];
const SECTION_IDS = ['1', '2'];

/**
 * Step-by-step guide highlighted on /guides. Hidden unless `config.features.featuredGuide` is on.
 * Content lives in fr.json under `site.guides.featured.*`; `guide` is the country guide it links to
 * (`site.guides.featured.guide-slug`), which also provides the cover image.
 */
const FeaturedGuide = ({guide, tone = 'white'}) => {
  const intl = useIntl();

  if (!config.features.featuredGuide) return null;

  const t = (id) => intl.formatMessage({id: `site.guides.featured.${id}`});
  const href = guide ? guide.path : `/guides/${t('guide-slug')}`;

  return (
    <Section tone={tone}>
      <SectionHead
        eyebrow={t('eyebrow')}
        title={t('title')}
        action={
          <Link className={ui.btn} href={href}>
            {t('link')}
          </Link>
        }
      />

      <div className={styles.layout}>
        <aside>
          <ol>
            {STEP_IDS.map((id, i) => (
              <li key={id} className={classnames(i === 0 && styles.on)}>
                <span className={styles.num}>{id}</span>
                {t(`steps.${id}`)}
              </li>
            ))}
          </ol>
        </aside>
        <article>
          {guide && (
            <div className={styles.image}>
              <Image
                src={guide.thumbnail}
                alt=""
                fill
                sizes="(max-width: 980px) 100vw, 700px"
                style={{objectFit: 'cover'}}
              />
            </div>
          )}
          {SECTION_IDS.map((id) => (
            <React.Fragment key={id}>
              <h3>{t(`sections.${id}.title`)}</h3>
              <p>{t(`sections.${id}.text`)}</p>
            </React.Fragment>
          ))}
        </article>
      </div>
    </Section>
  );
};

export default FeaturedGuide;
