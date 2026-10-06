'use client';

import React, {useState} from 'react';
import classnames from 'classnames';
import {useIntl} from 'react-intl';

import styles from './styles.module.scss';
import ui from '../ui.module.scss';
import {Section, Eyebrow} from '../Section';
import subscribeToNewsletter from '../../../utils/subscribe-to-newsletter';
import analyticsPushEvent from '../../../utils/push-analytics-event';

const NewsletterBand = ({tone = 'deep'}) => {
  const intl = useIntl();
  const t = (id) => intl.formatMessage({id: `site.newsletter.${id}`});
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('submitting');

    try {
      await subscribeToNewsletter({email});
      analyticsPushEvent({category: 'Newsletter', action: 'SubscribeSuccess', label: window.location.pathname});
      setStatus('success');
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <Section tone={tone} className={styles.band}>
      <div className={styles.inner}>
        <div>
          <Eyebrow>{t('eyebrow')}</Eyebrow>
          <h2 className={styles.title}>{t('title')}</h2>
          <p className={ui.lead}>{t('lead')}</p>
        </div>

        <div className={styles.formWrapper}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              className={styles.input}
              type="email"
              name="email"
              required
              placeholder={t('placeholder')}
              aria-label={t('placeholder')}
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
            />
            <button className={classnames(ui.btn)} type="submit" disabled={!email || status === 'submitting'}>
              {t('button')}
            </button>
          </form>
          {status === 'success' && <p className={styles.alert}>{t('success')}</p>}
          {status === 'error' && <p className={styles.alert}>{t('error')}</p>}
        </div>
      </div>
    </Section>
  );
};

export default NewsletterBand;
