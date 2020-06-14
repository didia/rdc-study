// Vendor
import React from 'react';
import {useIntl} from 'react-intl';
import classnames from 'classnames';
import T from 'prop-types';

// Styles
import styles from './styles.module.scss';

const PreviousNextActions = ({disabled}) => {
  const intl = useIntl();

  return (
    <ul className={classnames('actions', styles.actions)}>
      <li>
        <button type="submit" className="special" disabled={disabled}>
          {intl.formatMessage({id: 'assistance-form.controls.next'})}
        </button>
      </li>
    </ul>
  );
};

PreviousNextActions.propTypes = {
  disabled: T.bool,
};

export default PreviousNextActions;
