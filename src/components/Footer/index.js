// Vendor
import React from 'react';
import classnames from 'classnames';
import {FormattedMessage} from 'react-intl';

// Styles
import styles from './styles.module.scss';

// Contact
import {contact} from '../../../config';

const Footer = () => (
  <section className={styles.footer}>
    <div className={styles.inner}>
      <FormattedMessage id="footer.title">{text => <h2 className="major">{text}</h2>}</FormattedMessage>

      <FormattedMessage id="footer.contact-us-text">{text => <p>{text}</p>}</FormattedMessage>

      <form className={styles['contact-form']} method="post" action="#">
        <div className="field">
          <FormattedMessage id="footer.contact-form.name-label">
            {text => <label htmlFor="name">{text}</label>}
          </FormattedMessage>

          <input type="text" name="name" id="name" />
        </div>

        <div className="field">
          <FormattedMessage id="footer.contact-form.email-label">
            {text => <label htmlFor="email">{text}</label>}
          </FormattedMessage>

          <input type="email" name="email" id="email" />
        </div>

        <div className="field">
          <FormattedMessage id="footer.contact-form.message-label">
            {text => <label htmlFor="message">{text}</label>}
          </FormattedMessage>

          <textarea name="message" id="message" rows="4" />
        </div>

        <ul className="actions">
          <li>
            <FormattedMessage id="footer.contact-form.send-message-button-label">
              {text => <input type="submit" value={text} />}
            </FormattedMessage>
          </li>
        </ul>
      </form>

      <ul className={styles.contact}>
        <li className={classnames(styles.contact__item, 'fa-facebook')}>
          <a href={contact.facebook.link} target="_blank" rel="noopener noreferrer">
            {contact.facebook.label}
          </a>
        </li>

        <li className={classnames(styles.contact__item, 'fa-envelope')}>
          <a href={contact.email.link}>{contact.email.label}</a>
        </li>

        <li className={classnames(styles.contact__item, 'fa-phone')}>
          <a href={contact.phone.link}>{contact.phone.label}</a>
        </li>

        <li className={classnames(styles.contact__item, 'fa-home')}>
          {contact.address.name} <br />
          {contact.address.streetAddress} <br />
          {contact.address.locality} <br />
          {contact.address.country}
        </li>
      </ul>

      <ul className={styles.copyright}>
        <FormattedMessage id="footer.copyright">{text => <li>{text}</li>}</FormattedMessage>

        <li>
          Design: <a href="http://html5up.net">HTML5 UP</a>
        </li>
      </ul>
    </div>
  </section>
);

export default Footer;
