'use client';

// Vendor
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import classnames from 'classnames';
import {useIntl} from 'react-intl';

// Styles
import ui from '../../site/ui.module.scss';

// Components
import SiteLayout from '../../site/SiteLayout';
import {Section, PageBanner, SectionHead} from '../../site/Section';
import ContentCard from '../../site/ContentCard';
import PostMeta from '../../site/PostMeta';
import HtmlContent from '../../HtmlContent';

const NUMBER_OF_RELATED_ARTICLES = 3;

const ArticlePage = ({article, otherArticles}) => {
  const intl = useIntl();
  const t = (id) => intl.formatMessage({id: `site.articles.${id}`});
  const related = (otherArticles || []).slice(0, NUMBER_OF_RELATED_ARTICLES);

  return (
    <SiteLayout active="/articles" newsletterTone="dark">
      <PageBanner
        eyebrow={t('detail.eyebrow')}
        title={article.title}
        lead={article.excerpt}
        share={{path: article.path, title: article.title, excerpt: article.excerpt}}
      />

      <Section tone="white">
        <div className={ui.detail}>
          <article>
            <div className={ui.cover}>
              <Image
                src={article.thumbnail}
                alt={article.title}
                fill
                priority
                sizes="(max-width: 980px) 100vw, 800px"
                style={{objectFit: 'cover'}}
              />
            </div>
            {article.thumbnailCredits && (
              <div className={ui.coverCredit} dangerouslySetInnerHTML={{__html: article.thumbnailCredits}} />
            )}
            <p className={ui.meta} style={{marginBottom: 24}}>
              <PostMeta post={article} />
            </p>
            <HtmlContent content={article.content} />
          </article>

          <aside className={ui.aside}>
            <b className={ui.asideTitle}>{t('help.title')}</b>
            <p className={ui.asideText}>{t('help.text')}</p>
            <Link className={classnames(ui.btn)} href="/accompagnement">
              {intl.formatMessage({id: 'site.nav.cta'})}
            </Link>
          </aside>
        </div>
      </Section>

      {related.length > 0 && (
        <Section tone="light">
          <SectionHead eyebrow={t('related.eyebrow')} title={t('related.title')} />
          <ul className={ui.grid3}>
            {related.map((other) => (
              <li key={other.path}>
                <ContentCard
                  href={other.path}
                  image={other.thumbnail}
                  title={other.title}
                  meta={<PostMeta post={other} />}
                />
              </li>
            ))}
          </ul>
        </Section>
      )}
    </SiteLayout>
  );
};

export default ArticlePage;
