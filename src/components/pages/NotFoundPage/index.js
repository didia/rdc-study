// Vendor
import React from 'react';
import {FormattedMessage} from 'react-intl';
import Link from 'gatsby-link';

// Styles
import styles from './styles.module.scss';

import PageLayout from '../../../layouts/PageLayout';

const NotFoundPage = () => (
  <PageLayout>
    <div className={styles.wrapper}>
      <div className={styles.inner}>
        <FormattedMessage id="not-found.title">{text => <h1 className="major">{text}</h1>}</FormattedMessage>

        <FormattedMessage id="not-found.message-text">{text => <p>{text}</p>}</FormattedMessage>

        <FormattedMessage id="not-found.return-home-button-text">
          {text => (
            <Link to="/" className="button special">
              {text}
            </Link>
          )}
        </FormattedMessage>
      </div>
    </div>
  </PageLayout>
);

export default NotFoundPage;
