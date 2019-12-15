// Vendor
import React from 'react';
import classnames from 'classnames';
import T from 'prop-types';

// Styles
import styles from './styles.module.scss';

const Button = ({className, children, outlined, tag, ...props}) => {
  const Tag = tag || 'button';
  const outlinedClass = outlined ? styles.outlined : null;
  const disabledClass = props.disabled ? styles.disabled : null;

  return (
    <Tag className={classnames(styles.button, outlinedClass, disabledClass, className)} {...props}>
      {children}
    </Tag>
  );
};

Button.propTypes = {
  className: T.string,
  children: T.oneOfType([T.arrayOf(T.element), T.element, T.string]).isRequired,
  disabled: T.string,
  outlined: T.bool,
  tag: T.elementType
};

export default Button;
