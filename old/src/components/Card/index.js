import React from 'react';
import T from 'prop-types';
import classnames from 'classnames';

// Styles
import styles from './styles.module.scss';

const Card = ({className, children}) => <div className={classnames(styles.card, className)}>{children}</div>;

Card.propTypes = {
  className: T.string,
  children: T.oneOfType([T.arrayOf(T.element), T.element]),
};

export default Card;
