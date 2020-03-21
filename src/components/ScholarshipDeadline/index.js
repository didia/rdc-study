// Vendor
import React, {Component} from 'react';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
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

class ScholarshipDeadline extends Component {
  state = {
    color: null,
    message: null
  };

  componentDidMount() {
    this.setState(getDeadlineMessage(this.props.date, this.props.intl));
  }

  render() {
    const {className, tag} = this.props;
    const Tag = tag || 'div';

    return (
      <Tag className={className}>
        <span
          className={classnames('fa fa-clock-o', styles.text, styles[this.state.color])}
          dangerouslySetInnerHTML={{__html: this.state.message}}
        />
      </Tag>
    );
  }
}

ScholarshipDeadline.propTypes = {
  className: T.string,
  tag: T.elementType,
  date: T.string,
  intl: T.shape({
    formatDate: T.func,
    formatMessage: T.func
  })
};

export default injectIntl(ScholarshipDeadline);
