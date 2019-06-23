import React from 'react';
import {FormattedMessage} from 'react-intl';
import T from 'prop-types';

const ContactUsButton = ({className}) => (
  <FormattedMessage id="shared.contact-us-text">
    {text => (
      <a href="#contact" className={className}>
        {text}
      </a>
    )}
  </FormattedMessage>
);

ContactUsButton.propTypes = {
  className: T.string
};

export default ContactUsButton;
