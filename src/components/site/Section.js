import React from 'react';
import classnames from 'classnames';

import ui from './ui.module.scss';
import ShareBar from './ShareBar';

export const Section = ({tone = 'light', className, style, children, ...props}) => (
  <section className={classnames(ui.section, ui[tone], className)} style={style} {...props}>
    {children}
  </section>
);

export const Eyebrow = ({children}) => <div className={ui.eyebrow}>{children}</div>;

export const SectionHead = ({eyebrow, title, lead, action}) => (
  <>
    {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
    <div className={ui.head}>
      <div>
        <h2 className={ui.title}>{title}</h2>
        {lead && <p className={ui.lead}>{lead}</p>}
      </div>
      {action}
    </div>
  </>
);

/** Light page banner. `share` ({path, title, excerpt}) adds the social share bar. */
export const PageBanner = ({eyebrow, title, lead, share}) => (
  <div className={ui.banner}>
    {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
    <h1>{title}</h1>
    {lead && <p className={ui.lead}>{lead}</p>}
    {share && <ShareBar path={share.path} title={share.title} excerpt={share.excerpt} />}
  </div>
);
