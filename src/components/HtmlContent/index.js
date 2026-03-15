// Vendor
import React from 'react';
import classnames from 'classnames';
import T from 'prop-types';

// Styles
import styles from './styles.module.scss';

const HtmlContent = ({className, content}) => {
  const mergedClassName = classnames(className, styles['html-content']);

  return <div className={mergedClassName} dangerouslySetInnerHTML={{__html: content}} />;
};

HtmlContent.propTypes = {
  content: T.string.isRequired,
  className: T.string
};

export default HtmlContent;
