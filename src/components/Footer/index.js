'use client';

import React, {useState} from 'react';
import classnames from 'classnames';
import {FormattedMessage} from 'react-intl';
import axios from 'axios';
import Link from 'next/link';

import styles from './styles.module.scss';
import config from '../../../config';
import ActivityIndicator from '../ActivityIndicator';
import analyticsPushEvent from '../../utils/push-analytics-event';

const {contact, contactFormEndpoint} = config;

const ContactForm = ({className, submitDisabledState, values, onUpdate, onSubmit}) => (
  <form className={classnames(styles.form, className)} onSubmit={onSubmit}>
    <div className="field">
      <FormattedMessage id="footer.contact-form.name-label">
        {(text) => <label htmlFor="name">{text}</label>}
      </FormattedMessage>
      <input type="text" name="name" onChange={onUpdate} value={values.name} />
    </div>

    <div className="field">
      <FormattedMessage id="footer.contact-form.email-label">
        {(text) => <label htmlFor="email">{text}</label>}
      </FormattedMessage>
      <input type="email" name="email" onChange={onUpdate} value={values.email} />
    </div>

    <div className="field">
      <FormattedMessage id="footer.contact-form.message-label">
        {(text) => <label htmlFor="message">{text}</label>}
      </FormattedMessage>
      <textarea name="message" rows="4" onChange={onUpdate} value={values.message} />
    </div>

    <ul className="actions">
      <li>
        <FormattedMessage id="footer.contact-form.send-message-button-label">
          {(text) => <input type="submit" className="special" disabled={submitDisabledState} value={text} />}
        </FormattedMessage>
      </li>
    </ul>
  </form>
);

const Alert = ({className, messageTranslationId, titleTranslationId, onDiscardAlert}) => (
  <div className={classnames(styles.alert, className)}>
    <h4 className={styles.alert__title}>
      <FormattedMessage id={titleTranslationId} />
      <a onClick={onDiscardAlert} className="icon fa-close" />
    </h4>
    <FormattedMessage id={messageTranslationId}>{(text) => <div>{text}</div>}</FormattedMessage>
  </div>
);

const SuccessAlert = ({className, ...props}) => (
  <Alert
    className={classnames(styles['alert--success'], className)}
    messageTranslationId="footer.contact-form.success.message-text"
    titleTranslationId="footer.contact-form.success.title"
    {...props}
  />
);

const ErrorAlert = ({className, ...props}) => (
  <Alert
    className={classnames(styles['alert--error'], className)}
    messageTranslationId="footer.contact-form.error.message-text"
    titleTranslationId="footer.contact-form.error.title"
    {...props}
  />
);

const Footer = ({className}) => {
  const [formState, setFormState] = useState({
    email: '',
    message: '',
    name: '',
    showError: false,
    showSuccess: false,
    isSubmitting: false,
  });

  const submitDisabledState = formState.email && formState.message && formState.name && !formState.isSubmitting ? '' : 'disabled';
  const shouldShowContactForm = formState.showSuccess || formState.showError;

  const handleChange = (event) => {
    setFormState((prev) => ({...prev, [event.target.name]: event.target.value}));
  };

  const discardErrorAlert = () => {
    setFormState((prev) => ({...prev, showError: false, showSuccess: false}));
  };

  const discardSuccessAlert = () => {
    setFormState({email: '', message: '', name: '', isSubmitting: false, showError: false, showSuccess: false});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const {email, message, name} = formState;

    const payload = {
      email,
      message,
      name,
      form: 'contact',
      link: typeof window !== 'undefined' ? window.location.href : '',
    };

    setFormState((prev) => ({...prev, isSubmitting: true}));

    analyticsPushEvent({category: 'ContactForm', action: 'Submit', label: typeof window !== 'undefined' ? window.location.pathname : ''});

    try {
      await axios.post(contactFormEndpoint, payload);
      setFormState((prev) => ({...prev, isSubmitting: false, showError: false, showSuccess: true}));
      analyticsPushEvent({category: 'ContactForm', action: 'SubmitSuccess', label: typeof window !== 'undefined' ? window.location.pathname : ''});
    } catch (error) {
      setFormState((prev) => ({...prev, isSubmitting: false, showError: true, showSuccess: false}));
      analyticsPushEvent({category: 'ContactForm', action: 'SubmitError', label: typeof window !== 'undefined' ? window.location.pathname : ''});
      console.error('An error occured: ', error);
    }
  };

  return (
    <section id="contact" className={classnames(styles.footer, className)}>
      <ActivityIndicator isActive={formState.isSubmitting} />

      <div className={styles.inner}>
        <FormattedMessage id="footer.title">{(text) => <h2 className="major">{text}</h2>}</FormattedMessage>
        <FormattedMessage id="footer.contact-us-text">{(text) => <p>{text}</p>}</FormattedMessage>

        <div className={styles['contact-form']}>
          <ContactForm
            className={shouldShowContactForm ? styles['form--hidden'] : null}
            submitDisabledState={submitDisabledState}
            values={formState}
            onUpdate={handleChange}
            onSubmit={handleSubmit}
          />

          <SuccessAlert
            className={formState.showSuccess ? null : styles['alert--hidden']}
            onDiscardAlert={discardSuccessAlert}
          />

          <ErrorAlert
            className={formState.showError ? null : styles['alert--hidden']}
            onDiscardAlert={discardErrorAlert}
          />
        </div>

        <ul className={styles.contact}>
          <li className={styles.contact__item}>
            <i className={classnames(styles['contact-item__icon'], 'fab fa-facebook-f')} />
            <a href={contact.facebook.link} target="_blank" rel="noopener noreferrer">
              {contact.facebook.label}
            </a>
          </li>

          <li className={styles.contact__item}>
            <i className={classnames(styles['contact-item__icon'], 'far fa-envelope')} />
            <a href={contact.email.link}>{contact.email.label}</a>
          </li>

          <li className={styles.contact__item}>
            <i className={classnames(styles['contact-item__icon'], 'fas fa-phone')} />
            <div>
              {contact.phones.map((phone) => (
                <div key={phone.label}>
                  <a href={phone.link}>
                    {phone.countryFlag} {phone.label}
                  </a>
                </div>
              ))}
            </div>
          </li>

          <li className={styles.contact__item}>
            <i className={classnames(styles['contact-item__icon'], 'fas fa-home')} />
            <div>
              {contact.address.name} <br />
              {contact.address.streetAddress} <br />
              {contact.address.locality} <br />
              {contact.address.country}
            </div>
          </li>
        </ul>

        <ul className={styles.copyright}>
          <FormattedMessage id="footer.copyright">{(text) => <li>{text}</li>}</FormattedMessage>
          <FormattedMessage id="footer.privacy-policy">
            {(text) => (
              <li>
                <Link href="/politique-de-confidentialite">{text}</Link>
              </li>
            )}
          </FormattedMessage>
          <li>
            Design: <a href="https://html5up.net">HTML5 UP</a>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default Footer;
