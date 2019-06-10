import React from 'react';
import {FormattedMessage} from 'react-intl';
import T from 'prop-types';
import {Link} from 'gatsby';

const ContactUsButton = ({className}) => (
  <FormattedMessage id="shared.contact-us-text">
    {text => (
      <Link to={`${window.location.pathname}#contact`} className={className}>
        {text}
      </Link>
    )}
  </FormattedMessage>
);

ContactUsButton.propTypes = {
  className: T.string
};

export default ContactUsButton;
