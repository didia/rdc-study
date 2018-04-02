// Vendor
import React from 'react';
import T from 'prop-types';

const Content = ({country, className}) => (
  <div className={className}>
    <div dangerouslySetInnerHTML={{__html: country.content}} />
  </div>
);

Content.propTypes = {
  className: T.string,
  country: T.shape({
    content: T.string.isRequired
  })
};

export default Content;
