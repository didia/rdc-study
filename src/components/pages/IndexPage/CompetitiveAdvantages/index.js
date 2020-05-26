// Vendor
import React from 'react';
import T from 'prop-types';
import {FormattedMessage} from 'react-intl';
import classnames from 'classnames';

// Components
import {Link} from 'gatsby';

// Styles
import styles from './styles.module.scss';

const competitiveAdvantages = [
  {
    iconClassName: 'fas fa-handshake',
    title: 'pages.index.competitive-advantages.first-item.title',
    description: 'pages.index.competitive-advantages.first-item.description',
  },
  {
    iconClassName: 'fas fa-hand-holding-heart',
    title: 'pages.index.competitive-advantages.second-item.title',
    description: 'pages.index.competitive-advantages.second-item.description',
  },
  {
    iconClassName: 'fas fa-users',
    title: 'pages.index.competitive-advantages.third-item.title',
    description: 'pages.index.competitive-advantages.third-item.description',
  },
];

const CompetitiveAdvantages = ({className}) => (
  <div className={classnames(styles.wrapper, className)}>
    <FormattedMessage id="pages.index.competitive-advantages.title">
      {(text) => <h2 className={styles.title}>{text}</h2>}
    </FormattedMessage>

    <div className={styles.grid}>
      {competitiveAdvantages.map((entry, index) => (
        <div key={`competitive-${index}`} className={styles['grid-item']}>
          <div className={styles['grid-item-icon-title-wrapper']}>
            <div className={styles['grid-item-icon']}>
              <span className={entry.iconClassName} />
            </div>
            <FormattedMessage id={entry.title}>
              {(title) => <h3 className={styles['grid-item-title']}>{title}</h3>}
            </FormattedMessage>
          </div>
          <FormattedMessage id={entry.description}>
            {(description) => <p className={styles['grid-item-description']}>{description}</p>}
          </FormattedMessage>
        </div>
      ))}
    </div>

    <div className={styles['call-to-action-wrapper']}>
      <FormattedMessage id="pages.index.competitive-advantages.call-to-action">
        {(callToActionText) => (
          <Link to="/a-propos" className="button special call-to-action">
            {callToActionText}
          </Link>
        )}
      </FormattedMessage>
    </div>
  </div>
);

CompetitiveAdvantages.propTypes = {
  className: T.string,
};

export default CompetitiveAdvantages;
