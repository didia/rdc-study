// Vendor
import React from 'react';
import T from 'prop-types';

// Styles
import styles from './styles.module.scss';

const StepForm = ({children, title, description, className}) => {
  return (
    <div className={className}>
      <h2 className={styles.title}>{title}</h2>

      {description && <p className={styles.description}>{description}</p>}

      {children}
    </div>
  );
};

StepForm.propTypes = {
  className: T.string,
  children: T.object,
  description: T.string,
  title: T.string
};

export default StepForm;
