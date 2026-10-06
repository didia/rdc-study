'use client';

import React from 'react';
import classnames from 'classnames';

import ui from '../../site/ui.module.scss';
import SiteLayout from '../../site/SiteLayout';
import {Section, PageBanner} from '../../site/Section';

/**
 * Plain content page: banner (page.title / description) + white content section.
 * `prose` (default) styles raw HTML/markdown children; turn it off for pages that bring their own layout.
 */
const GenericPage = ({children, page, active, prose = true, withNewsletter = true}) => (
  <SiteLayout active={active} withNewsletter={withNewsletter} newsletterTone="dark">
    <PageBanner
      title={page.title}
      lead={page.description}
      share={page.socialShareEnabled ? {path: page.path, title: page.title, excerpt: page.description} : undefined}
    />
    <Section tone="white">
      <div className={classnames(prose && ui.prose, ui.narrow)}>{children}</div>
    </Section>
  </SiteLayout>
);

export default GenericPage;
