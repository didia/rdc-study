'use client';

import React, {useState, useEffect} from 'react';
import {differenceInCalendarDays} from 'date-fns';
import {useIntl} from 'react-intl';
import classnames from 'classnames';

import styles from './styles.module.scss';

const MAX_NUMBER_OF_DAYS_IN_MONTH = 31;

const getDeadlineMessage = (date, intl) => {
  if (!date) {
    return {
      color: 'green',
      message: intl.formatMessage({id: 'scholarship-deadline.no-expiration'})
    };
  }

  const deadline = new Date(date);
  const remainingDays = differenceInCalendarDays(deadline, new Date());

  if (remainingDays >= 0 && remainingDays < MAX_NUMBER_OF_DAYS_IN_MONTH) {
    return {
      color: 'yellow',
      message: intl.formatMessage({id: 'scholarship-deadline.remaining-days'}, {date, days: remainingDays})
    };
  }

  const messageKey = remainingDays < 0 ? 'scholarship-deadline.expired' : 'scholarship-deadline.expiration-date';
  const year = deadline.getFullYear() === new Date().getFullYear() ? undefined : 'numeric';
  const formattedDeadline = intl.formatDate(deadline, {month: 'long', day: '2-digit', year});

  return {
    color: remainingDays < 0 ? 'red' : 'green',
    message: intl.formatMessage({id: messageKey}, {date, deadline: formattedDeadline})
  };
};

const ScholarshipDeadline = ({className, tag, date}) => {
  const intl = useIntl();
  const [deadlineInfo, setDeadlineInfo] = useState({color: null, message: null});

  useEffect(() => {
    setDeadlineInfo(getDeadlineMessage(date, intl));
  }, [date, intl]);

  const Tag = tag || 'div';

  return (
    <Tag className={className}>
      <span
        className={classnames('far fa-clock', styles.text, deadlineInfo.color && styles[deadlineInfo.color])}
        dangerouslySetInnerHTML={{__html: deadlineInfo.message}}
      />
    </Tag>
  );
};

export default ScholarshipDeadline;
