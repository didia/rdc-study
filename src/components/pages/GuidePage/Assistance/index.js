// Vendor
import React from 'react';
import {FormattedMessage} from 'react-intl';
import Link from 'gatsby-link';

const Assistance = () => (
  <div>
    <FormattedMessage id="pages.guides-show.assistance.title">
      {text => <h2 className="major">{text}</h2>}
    </FormattedMessage>

    <p>
      <FormattedMessage id="pages.guides-show.assistance.description-1">{text => <div>{text}</div>}</FormattedMessage>
      <FormattedMessage id="pages.guides-show.assistance.description-2">{text => <div>{text}</div>}</FormattedMessage>
    </p>

    <FormattedMessage id="pages.guides-show.assistance.link-text">
      {text => (
        <Link to="/accompagnement" className="special">
          {text}
        </Link>
      )}
    </FormattedMessage>
  </div>
);

export default Assistance;
