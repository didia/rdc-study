// Vendor
import React, {Component} from 'react';
import classnames from 'classnames';
import {FormattedMessage} from 'react-intl';
import axios from 'axios';
import T from 'prop-types';
import Link from 'gatsby-link';

// Styles
import styles from './styles.module.scss';

// Config
import {contact, contactFormEndpoint} from '../../../config';

// Utils
import getCurrentUrl from '../../utils/get-current-url';

import ActivityIndicator from '../ActivityIndicator';

const ContactForm = ({className, submitDisabledState, values, onUpdate, onSubmit}) => (
  <form className={classnames(styles.form, className)} onSubmit={onSubmit}>
    <div className="field">
      <FormattedMessage id="footer.contact-form.name-label">
        {text => <label htmlFor="name">{text}</label>}
      </FormattedMessage>

      <input type="text" name="name" onChange={onUpdate} value={values.name} />
    </div>

    <div className="field">
      <FormattedMessage id="footer.contact-form.email-label">
        {text => <label htmlFor="email">{text}</label>}
      </FormattedMessage>

      <input type="email" name="email" onChange={onUpdate} value={values.email} />
    </div>

    <div className="field">
      <FormattedMessage id="footer.contact-form.message-label">
        {text => <label htmlFor="message">{text}</label>}
      </FormattedMessage>

      <textarea name="message" rows="4" onChange={onUpdate} value={values.message} />
    </div>

    <ul className="actions">
      <li>
        <FormattedMessage id="footer.contact-form.send-message-button-label">
          {text => <input type="submit" className="special" disabled={submitDisabledState} value={text} />}
        </FormattedMessage>
      </li>
    </ul>
  </form>
);

ContactForm.propTypes = {
  className: T.string,
  submitDisabledState: T.string.isRequired,
  values: T.shape({
    email: T.string,
    message: T.string,
    name: T.string
  }).isRequired,
  onUpdate: T.func.isRequired,
  onSubmit: T.func.isRequired
};

const Alert = ({className, messageTranslationId, titleTranslationId, onDiscardAlert}) => (
  <div className={classnames(styles.alert, className)}>
    <h4 className={styles.alert__title}>
      <FormattedMessage id={titleTranslationId} />

      <a onClick={onDiscardAlert} className="icon fa-close" />
    </h4>

    <FormattedMessage id={messageTranslationId}>{text => <div>{text}</div>}</FormattedMessage>
  </div>
);

Alert.propTypes = {
  className: T.string,
  titleTranslationId: T.string.isRequired,
  messageTranslationId: T.string.isRequired,
  onDiscardAlert: T.func.isRequired
};

const SuccessAlert = ({className, ...props}) => (
  <Alert
    className={classnames(styles['alert--success'], className)}
    messageTranslationId="footer.contact-form.success.message-text"
    titleTranslationId="footer.contact-form.success.title"
    {...props}
  />
);

SuccessAlert.propTypes = {
  className: T.string
};

const ErrorAlert = ({className, ...props}) => (
  <Alert
    className={classnames(styles['alert--error'], className)}
    messageTranslationId="footer.contact-form.error.message-text"
    titleTranslationId="footer.contact-form.error.title"
    {...props}
  />
);

ErrorAlert.propTypes = {
  className: T.string
};

class Footer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      message: '',
      name: '',
      showError: false,
      showSuccess: false
    };

    this.discardErrorAlert = this.discardErrorAlert.bind(this);
    this.discardSuccessAlert = this.discardSuccessAlert.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  _submitDisabledState() {
    const {email, message, name, isSubmitting} = this.state;

    return email && message && name && !isSubmitting ? '' : 'disabled';
  }

  _shouldShowContactForm() {
    return this.state.showSuccess || this.state.showError;
  }

  discardErrorAlert() {
    this.setState({
      showError: false,
      showSuccess: false
    });
  }

  discardSuccessAlert() {
    this.setState({
      email: '',
      message: '',
      name: '',
      isSubmitting: false,
      showError: false,
      showSuccess: false
    });
  }

  handleChange(event) {
    this.setState({
      ...this.state,
      [event.target.name]: event.target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const {email, message, name} = this.state;

    const payload = {
      email,
      message,
      name,
      link: getCurrentUrl()
    };

    this.setState({
      ...this.state,
      isSubmitting: true
    });

    axios
      .post(contactFormEndpoint, payload)
      .then(() => {
        this.setState({
          ...this.state,
          isSubmitting: false,
          showError: false,
          showSuccess: true
        });
      })
      .catch(error => {
        this.setState({
          ...this.state,
          isSubmitting: false,
          showError: true,
          showSuccess: false
        });

        window.console.log('An error occured: ', error);
      });
  }

  render() {
    return (
      <section id="contact" className={classnames(styles.footer, this.props.className)}>
        <ActivityIndicator isActive={this.state.isSubmitting} />

        <div className={styles.inner}>
          <FormattedMessage id="footer.title">{text => <h2 className="major">{text}</h2>}</FormattedMessage>

          <FormattedMessage id="footer.contact-us-text">{text => <p>{text}</p>}</FormattedMessage>

          <div className={styles['contact-form']}>
            <ContactForm
              className={this._shouldShowContactForm() ? styles['form--hidden'] : null}
              submitDisabledState={this._submitDisabledState()}
              values={this.state}
              onUpdate={this.handleChange}
              onSubmit={this.handleSubmit}
            />

            <SuccessAlert
              className={this.state.showSuccess ? null : styles['alert--hidden']}
              onDiscardAlert={this.discardSuccessAlert}
            />

            <ErrorAlert
              className={this.state.showError ? null : styles['alert--hidden']}
              onDiscardAlert={this.discardErrorAlert}
            />
          </div>

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

            <FormattedMessage id="footer.privacy-policy">
              {text => (
                <li>
                  <Link to="/politique-de-confidentialite">{text}</Link>
                </li>
              )}
            </FormattedMessage>
            <li>
              Design: <a href="http://html5up.net">HTML5 UP</a>
            </li>
          </ul>
        </div>
      </section>
    );
  }
}

Footer.propTypes = {
  className: T.string
};

export default Footer;
