'use client';

// Vendor
import React, {useState} from 'react';
import T from 'prop-types';
import Image from 'next/image';
import Link from 'next/link';
import classnames from 'classnames';
import {useIntl} from 'react-intl';

// Styles
import styles from './styles.module.scss';
import ui from '../../site/ui.module.scss';

// Components
import SiteLayout from '../../site/SiteLayout';
import {Section, PageBanner} from '../../site/Section';
import ContentCard from '../../site/ContentCard';
import PostMeta from '../../site/PostMeta';

const PAGE_SIZE = 9;

const ArticlesPage = ({articles}) => {
  const intl = useIntl();
  const t = (id) => intl.formatMessage({id: `site.articles.${id}`});
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const [featured, ...others] = articles;

  return (
    <SiteLayout active="/articles" newsletterTone="dark">
      <PageBanner eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')} />

      <Section tone="light">
        {featured && (
          <article className={styles.featured}>
            <Link href={featured.path} className={styles.featuredImage} tabIndex={-1} aria-hidden="true">
              <Image
                src={featured.thumbnail}
                alt=""
                fill
                priority
                sizes="(max-width: 980px) 100vw, 600px"
                style={{objectFit: 'cover'}}
              />
            </Link>
            <div className={styles.featuredBody}>
              <span className={ui.chip}>{t('featured')}</span>
              <h2>
                <Link href={featured.path}>{featured.title}</Link>
              </h2>
              <p className={ui.lead}>{featured.excerpt}</p>
              <div className={ui.meta}>
                <PostMeta post={featured} />
              </div>
              <Link className={classnames(ui.btn, styles.featuredButton)} href={featured.path}>
                {t('read')}
              </Link>
            </div>
          </article>
        )}

        <ul className={ui.grid3}>
          {others.slice(0, visibleCount).map((article) => (
            <li key={article.path}>
              <ContentCard
                href={article.path}
                image={article.thumbnail}
                title={article.title}
                meta={<PostMeta post={article} />}
              />
            </li>
          ))}
        </ul>

        {visibleCount < others.length && (
          <div className={styles.more}>
            <button
              type="button"
              className={classnames(ui.btn, ui.ghost)}
              onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
            >
              {t('load-more')}
            </button>
          </div>
        )}
      </Section>
    </SiteLayout>
  );
};

ArticlesPage.propTypes = {
  articles: T.arrayOf(T.object)
};

export default ArticlesPage;
