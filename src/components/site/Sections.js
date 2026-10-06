'use client';

import React from 'react';
import classnames from 'classnames';
import {useIntl} from 'react-intl';

import ui from './ui.module.scss';
import {Section, Eyebrow, SectionHead} from './Section';

const JOURNEY_STEPS = ['choose', 'admission', 'funding', 'visa', 'diploma'];
const SERVICES_STEPS = ['choose', 'submit', 'accompanied'];
const TRUST_ITEMS = ['reliability', 'transparency', 'honesty'];

export const Positioning = ({tone = 'dark'}) => {
  const intl = useIntl();

  return (
    <Section tone={tone}>
      <div className={ui.pos}>
        <div>
          <Eyebrow>{intl.formatMessage({id: 'site.positioning.eyebrow'})}</Eyebrow>
          <h2>{intl.formatMessage({id: 'site.positioning.title'})}</h2>
        </div>
        <div>
          <p className={classnames(ui.lead, ui.posLead)}>{intl.formatMessage({id: 'site.positioning.paragraph-1'})}</p>
          <p className={classnames(ui.lead, ui.posSecondary)}>
            {intl.formatMessage({id: 'site.positioning.paragraph-2'})}
          </p>
        </div>
      </div>
    </Section>
  );
};

/** Numbered steps. `messagePrefix` + `.{id}.title|text` are read from fr.json. */
export const Steps = ({messagePrefix, ids, three}) => {
  const intl = useIntl();

  return (
    <div className={classnames(ui.steps, three && ui.steps3)}>
      {ids.map((id, i) => {
        const isEnd = !three && i === ids.length - 1;
        return (
          <div key={id} className={classnames(ui.step, isEnd && ui.stepEnd)}>
            <div className={ui.num}>{isEnd ? '★' : i + 1}</div>
            <h3>{intl.formatMessage({id: `${messagePrefix}.${id}.title`})}</h3>
            <p>{intl.formatMessage({id: `${messagePrefix}.${id}.text`})}</p>
          </div>
        );
      })}
    </div>
  );
};

export const Journey = ({tone = 'white'}) => {
  const intl = useIntl();

  return (
    <Section tone={tone}>
      <SectionHead
        eyebrow={intl.formatMessage({id: 'site.journey.eyebrow'})}
        title={intl.formatMessage({id: 'site.journey.title'})}
        lead={intl.formatMessage({id: 'site.journey.lead'})}
      />
      <Steps messagePrefix="site.journey.steps" ids={JOURNEY_STEPS} />
    </Section>
  );
};

export const ServicesSteps = ({tone = 'white'}) => {
  const intl = useIntl();

  return (
    <Section tone={tone}>
      <SectionHead
        eyebrow={intl.formatMessage({id: 'site.services.steps.eyebrow'})}
        title={intl.formatMessage({id: 'site.services.steps.title'})}
      />
      <Steps messagePrefix="site.services.steps" ids={SERVICES_STEPS} three />
    </Section>
  );
};

export const Trust = ({tone = 'dark'}) => {
  const intl = useIntl();

  return (
    <Section tone={tone}>
      <div className={ui.trust}>
        <div>
          <Eyebrow>{intl.formatMessage({id: 'site.trust.eyebrow'})}</Eyebrow>
          <h2 className={ui.title}>{intl.formatMessage({id: 'site.trust.title'})}</h2>
          <p className={ui.lead}>{intl.formatMessage({id: 'site.trust.lead'})}</p>
        </div>
        <ul>
          {TRUST_ITEMS.map((id, i) => (
            <li key={id}>
              <i>{i + 1}</i>
              <div>
                <b>{intl.formatMessage({id: `site.trust.items.${id}.title`})}</b>
                <span>{intl.formatMessage({id: `site.trust.items.${id}.text`})}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
};
