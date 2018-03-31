// Vendor
import React from 'react';
import T from 'prop-types';

const Content = ({country, className}) => (
  <div className={className} dangerouslySetInnerHTML={{__html: country.content}} />
);

Content.propTypes = {
  className: T.string,
  country: T.shape({
    content: T.string.isRequired
  })
};

export default Content;
