// Vendor
import React from 'react';
import {useIntl} from 'react-intl';
import classnames from 'classnames';
import T from 'prop-types';

// Styles
import styles from './styles.module.scss';

const StepActions = ({disabled, onNext, onPrevious, onEdit}) => {
  const intl = useIntl();

  return (
    <ul className={classnames('actions', styles.actions)}>
      {onPrevious && (
        <li>
          <button type="button" className="special" disabled={disabled} onClick={onPrevious}>
            {intl.formatMessage({id: 'assistance-form.controls.previous'})}
          </button>
        </li>
      )}

      {onEdit && (
        <li>
          <button type="button" className={styles['edit-button']} onClick={onEdit}>
            {intl.formatMessage({id: 'assistance-form.controls.edit'})}
          </button>
        </li>
      )}

      {onNext && (
        <li>
          <button type="button" className="special" disabled={disabled} onClick={onNext}>
            {intl.formatMessage({id: 'assistance-form.controls.next'})}
          </button>
        </li>
      )}
    </ul>
  );
};

StepActions.propTypes = {
  disabled: T.bool,
  onEdit: T.func,
  onNext: T.func,
  onPrevious: T.func
};

export default StepActions;
