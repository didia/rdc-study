// Vendor
import React, {Component} from 'react';
import classnames from 'classnames';
import {FormattedMessage} from 'react-intl';
import axios from 'axios';
import T from 'prop-types';

// Styles
import styles from './styles.module.scss';

// Contact
import {contact, contactFormEndpoint} from '../../../config';

// Utils
import getCurrentUrl from '../../utils/get-current-url';

const ContactForm = ({submitDisabledState, onUpdate, onSubmit}) => (
  <form onSubmit={onSubmit}>
    <div className="field">
      <FormattedMessage id="footer.contact-form.name-label">
        {text => <label htmlFor="name">{text}</label>}
      </FormattedMessage>

      <input type="text" name="name" onChange={onUpdate} />
    </div>

    <div className="field">
      <FormattedMessage id="footer.contact-form.email-label">
        {text => <label htmlFor="email">{text}</label>}
      </FormattedMessage>

      <input type="email" name="email" onChange={onUpdate} />
    </div>

    <div className="field">
      <FormattedMessage id="footer.contact-form.message-label">
        {text => <label htmlFor="message">{text}</label>}
      </FormattedMessage>

      <textarea name="message" rows="4" onChange={onUpdate} />
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
  submitDisabledState: T.string.isRequired,
  onUpdate: T.func.isRequired,
  onSubmit: T.func.isRequired
};

class Footer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      message: '',
      name: '',
      hasSubmitted: false,
      hasFailedToSubmit: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  _submitDisabledState() {
    const {email, message, name} = this.state;

    return email && message && name ? '' : 'disabled';
  }

  handleChange(event) {
    const newState = {
      ...this.state,
      [event.target.name]: event.target.value
    };

    this.setState(newState);
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

    axios
      .post(contactFormEndpoint, payload)
      .then(() => {
        this.setState({
          ...this.state,
          hasSubmitted: true,
          hasFailedToSubmit: false
        });
      })
      .catch(error => {
        this.setState({
          ...this.state,
          hasSubmitted: false,
          hasFailtedToSubmit: true
        });

        window.console.log('An error occured: ', error);
      });
  }

  render() {
    return (
      <section className={styles.footer}>
        <div className={styles.inner}>
          <FormattedMessage id="footer.title">{text => <h2 className="major">{text}</h2>}</FormattedMessage>

          <FormattedMessage id="footer.contact-us-text">{text => <p>{text}</p>}</FormattedMessage>

          <div className={styles['contact-form']}>
            <ContactForm
              submitDisabledState={this._submitDisabledState()}
              onUpdate={this.handleChange}
              onSubmit={this.handleSubmit}
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

            <li>
              Design: <a href="http://html5up.net">HTML5 UP</a>
            </li>
          </ul>
        </div>
      </section>
    );
  }
}

export default Footer;
