// Vendor
import React from 'react';
import {useIntl} from 'react-intl';
import T from 'prop-types';

// Styles
import styles from './styles.module.scss';

const StepForm = ({children, title, description, recapMode, onEditStep}) => {
  const intl = useIntl();
  const recapClassName = recapMode ? styles['recap-mode'] : null;
  const TitleTag = recapMode ? 'h3' : 'h2';

  return (
    <div className={recapClassName}>
      <div className={styles['title-wrapper']}>
        <TitleTag className={styles.title}>{title}</TitleTag>

        <button type="button" className={styles['edit-button']} onClick={onEditStep}>
          {intl.formatMessage({id: 'assistance-form.controls.edit'})}
        </button>
      </div>

      <p className={styles.description}>{description}</p>

      {children}
    </div>
  );
};

StepForm.propTypes = {
  children: T.object,
  description: T.string,
  onEditStep: T.func,
  recapMode: T.bool,
  title: T.string
};

export default StepForm;
