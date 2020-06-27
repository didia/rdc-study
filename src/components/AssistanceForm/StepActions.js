// Vendor
import React from 'react';
import {useIntl} from 'react-intl';
import classnames from 'classnames';
import T from 'prop-types';

// Styles
import styles from './styles.module.scss';

const StepActions = ({disabled, onPrevious}) => {
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

      <li>
        <button type="submit" className="special" disabled={disabled}>
          {intl.formatMessage({id: 'assistance-form.controls.next'})}
        </button>
      </li>
    </ul>
  );
};

StepActions.propTypes = {
  disabled: T.bool,
  onPrevious: T.func
};

export default StepActions;
