// Vendor
import React from 'react';
import classnames from 'classnames';
import T from 'prop-types';

// Styles
import ui from '../site/ui.module.scss';

const HtmlContent = ({className, content}) => (
  <div className={classnames(ui.prose, className)} dangerouslySetInnerHTML={{__html: content}} />
);

HtmlContent.propTypes = {
  content: T.string.isRequired,
  className: T.string
};

export default HtmlContent;
