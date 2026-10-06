'use client';

import React from 'react';
import {useIntl} from 'react-intl';

/** "12 mars · 5 minutes de lecture" */
const PostMeta = ({post}) => {
  const intl = useIntl();
  const date = new Date(post.date);
  const year = date.getFullYear() === new Date().getFullYear() ? undefined : 'numeric';

  return (
    <>
      <time dateTime={post.date}>{intl.formatDate(date, {month: 'long', day: '2-digit', year})}</time>
      {' · '}
      {intl.formatMessage({id: 'shared.read-time'}, {time: post.timeToRead})}
    </>
  );
};

export default PostMeta;
