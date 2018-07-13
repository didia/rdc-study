// Vendor
import React from 'react';
import T from 'prop-types';
import classnames from 'classnames';
import {FormattedDate, FormattedMessage} from 'react-intl';

// Styles
import styles from './styles.module.scss';

const PostMeta = ({className, post}) => {
  const postDate = new Date(post.date);
  const year = postDate.getFullYear() === new Date().getFullYear() ? undefined : 'numeric';

  return (
    <span className={classnames(styles.meta, className)}>
      <FormattedDate value={postDate} month="long" day="2-digit" year={year}>
        {time => <time>{time}</time>}
      </FormattedDate>
      <span className={styles.separator} />
      <FormattedMessage id="shared.read-time" values={{time: post.timeToRead}} />
    </span>
  );
};

PostMeta.propTypes = {
  className: T.string,
  post: T.shape({
    date: T.string.isRequired,
    timeToRead: T.number.isRequired
  })
};

export default PostMeta;
