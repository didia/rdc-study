// Vendor
import React from 'react';
import {useIntl} from 'react-intl';
import classnames from 'classnames';
import T from 'prop-types';

// Styles
import styles from './styles.module.scss';

const StepActions = ({disabled, nextButtonLabelKey, previousButtonLabelKey, onPrevious, onNext}) => {
  const intl = useIntl();

  return (
    <ul className={classnames('actions', styles.actions)}>
      {onPrevious && (
        <li className={classnames(styles.actions__item)}>
          <button type="button" className="special-text" disabled={disabled} onClick={onPrevious}>
            {intl.formatMessage({id: previousButtonLabelKey || 'assistance-form.controls.previous'})}
          </button>
        </li>
      )}

      <li className={styles.actions__item}>
        <button type="submit" className="special" disabled={disabled} onClick={onNext}>
          {intl.formatMessage({id: nextButtonLabelKey || 'assistance-form.controls.next'})}
        </button>
      </li>
    </ul>
  );
};

StepActions.propTypes = {
  disabled: T.bool,
  nextButtonLabelKey: T.string,
  previousButtonLabelKey: T.string,
  onNext: T.func,
  onPrevious: T.func
};

export default StepActions;
