'use client';

import React from 'react';
import Link from 'next/link';
import {FormattedMessage} from 'react-intl';

import ui from './ui.module.scss';
import {Section} from './Section';

const VisaWarning = ({tone = 'white'}) => (
  <Section tone={tone} style={{paddingBlock: 48}}>
    <p className={ui.lead} style={{maxWidth: 'none'}}>
      <FormattedMessage id="pages.assistance.visa.warning" />{' '}
      <FormattedMessage id="pages.assistance.visa.warning-learn-more">
        {(text) => (
          <Link href="/assistance-visa" style={{color: '#118aec'}}>
            {text}
          </Link>
        )}
      </FormattedMessage>
    </p>
  </Section>
);

export default VisaWarning;
