'use client';

// Vendor
import React, {useEffect, useMemo, useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import classnames from 'classnames';
import {useIntl} from 'react-intl';

// Styles
import styles from './styles.module.scss';
import ui from '../../site/ui.module.scss';

// Components
import SiteLayout from '../../site/SiteLayout';
import {Section, PageBanner, SectionHead} from '../../site/Section';
import ContentCard from '../../site/ContentCard';
import HtmlContent from '../../HtmlContent';

// Utils
import buildToc from '../../../utils/build-toc';

const GuideCards = ({guides, titleKey, tone}) => {
  const intl = useIntl();

  return (
    <Section tone={tone}>
      <SectionHead title={intl.formatMessage({id: titleKey})} />
      <ul className={ui.grid3}>
        {guides.map((guide) => (
          <li key={guide.path}>
            <ContentCard
              href={guide.path}
              image={guide.thumbnail}
              kicker={intl.formatMessage({id: 'site.guides.card.badge'})}
              title={guide.title}
              text={guide.excerpt}
              linkLabel={intl.formatMessage({id: 'site.guides.card.link'})}
            />
          </li>
        ))}
      </ul>
    </Section>
  );
};

/** Highlights the table-of-contents entry of the section currently being read. */
const useActiveHeading = (toc) => {
  const [activeId, setActiveId] = useState(toc[0] && toc[0].id);

  useEffect(() => {
    const headings = toc.map(({id}) => document.getElementById(id)).filter(Boolean);
    if (headings.length === 0 || typeof IntersectionObserver === 'undefined') return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      {rootMargin: '0px 0px -70% 0px'}
    );
    headings.forEach((heading) => observer.observe(heading));

    return () => observer.disconnect();
  }, [toc]);

  return activeId;
};

const GuidePage = ({guide, otherGuides, relatedGuides}) => {
  const intl = useIntl();
  const {content, toc} = useMemo(() => buildToc(guide.content), [guide.content]);
  const activeId = useActiveHeading(toc);

  const formattedUpdated = guide.updated && intl.formatDate(guide.updated, {dateStyle: 'long', timeZone: 'UTC'});

  return (
    <SiteLayout active="/guides" newsletterTone="dark">
      <PageBanner
        eyebrow={intl.formatMessage({id: 'site.guides.card.badge'})}
        title={guide.title}
        lead={guide.excerpt}
        share={{path: guide.path, title: guide.title, excerpt: guide.excerpt}}
      />

      <Section tone="white">
        <div className={classnames(styles.layout, toc.length === 0 && styles.layoutSingle)}>
          {toc.length > 0 && (
            <aside>
              <nav aria-label={intl.formatMessage({id: 'site.guide.toc'})}>
                <ol>
                  {toc.map(({id, text}, i) => (
                    <li key={id} className={classnames(id === activeId && styles.on)}>
                      <a href={`#${id}`}>
                        <span className={styles.num}>{i + 1}</span>
                        {text}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </aside>
          )}

          <article>
            <div className={ui.cover}>
              <Image
                src={guide.thumbnail}
                alt=""
                fill
                priority
                sizes="(max-width: 980px) 100vw, 800px"
                style={{objectFit: 'cover'}}
              />
            </div>

            {formattedUpdated && (
              <p className={ui.meta} style={{marginBottom: 24}} aria-label="Date de dernière mise à jour">
                {intl.formatMessage({id: 'pages.guides-show.last-updated'}, {date: formattedUpdated})}
              </p>
            )}

            <HtmlContent content={content} />

            <div className={styles.help}>
              <div>
                <b>{intl.formatMessage({id: 'site.guide.help.title'})}</b>
                <p>{intl.formatMessage({id: 'site.guide.help.text'})}</p>
              </div>
              <Link className={ui.btn} href={`/accompagnement?pour=${guide.slug}`}>
                {intl.formatMessage({id: 'site.nav.cta'})}
              </Link>
            </div>
          </article>
        </div>
      </Section>

      {relatedGuides && relatedGuides.length > 0 && (
        <GuideCards guides={relatedGuides} titleKey="pages.guides-show.related-guides.title" tone="light" />
      )}

      {otherGuides && otherGuides.length > 0 && (
        <GuideCards
          guides={otherGuides}
          titleKey="pages.guides-show.other-guides.title"
          tone={relatedGuides && relatedGuides.length > 0 ? 'white' : 'light'}
        />
      )}
    </SiteLayout>
  );
};

export default GuidePage;
