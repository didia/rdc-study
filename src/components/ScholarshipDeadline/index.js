// Vendor
import React from 'react';
import differenceInCalendarDays from 'date-fns/differenceInBusinessDays';
import {injectIntl} from 'react-intl';
import T from 'prop-types';
import classnames from 'classnames';

// Styles
import styles from './styles.module.scss';

// Constants
const MAX_NUMBER_OF_DAYS_IN_MONTH = 31;

// eslint-disable-next-line complexity
const getDeadlineMessage = (date, intl) => {
  if (!date) {
    return {
      class: 'green',
      message: intl.formatMessage({id: 'scholarship-deadline.no-expiration'})
    };
  }

  const deadline = new Date(date);

  const remainingDays = differenceInCalendarDays(deadline, new Date());

  if (remainingDays >= 0 && remainingDays < MAX_NUMBER_OF_DAYS_IN_MONTH) {
    return {
      color: 'yellow',
      message: intl.formatHTMLMessage({id: 'scholarship-deadline.remaining-days'}, {date, days: remainingDays})
    };
  }

  const messageKey = remainingDays < 0 ? 'scholarship-deadline.expired' : 'scholarship-deadline.expiration-date';
  const year = deadline.getFullYear() === new Date().getFullYear() ? undefined : 'numeric';
  const formattedDeadline = intl.formatDate(deadline, {month: 'long', day: '2-digit', year});

  return {
    color: remainingDays < 0 ? 'red' : 'green',
    message: intl.formatHTMLMessage({id: messageKey}, {date, deadline: formattedDeadline})
  };
};

const ScholarshipDeadline = injectIntl(({className, date, intl, tag}) => {
  const Tag = tag || 'div';
  const {color, message} = getDeadlineMessage(date, intl);

  return (
    <Tag className={className}>
      <span
        className={classnames('fa fa-clock-o', styles.text, styles[color])}
        dangerouslySetInnerHTML={{__html: message}}
      />
    </Tag>
  );
});

ScholarshipDeadline.propTypes = {
  className: T.string,
  tag: T.elementType,
  date: T.string,
  intl: T.shape({
    formatDate: T.func,
    formatMessage: T.func,
    formatHTMLMessage: T.func
  })
};

export default ScholarshipDeadline;
