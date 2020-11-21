// Vendor
import React, {useState} from 'react';
import classnames from 'classnames';
import T from 'prop-types';
import {FormattedMessage} from 'react-intl';

// Styles
import styles from './styles.module.scss';

// Components
import ActivityIndicator from '../ActivityIndicator';
import Button from '../Button';

// Utils
import subscribeToNewsletter from '../../utils/subscribe-to-newsletter';
import analyticsPushEvent from '../../utils/push-analytics-event';

const handleSubscribe = async (event, email, setFormState) => {
  event.preventDefault();

  setFormState({
    isSubmitting: true,
    showError: false,
    showSuccess: false,
  });

  try {
    await subscribeToNewsletter({email});

    analyticsPushEvent({
      category: 'Newsletter',
      action: 'SubscribeSuccess',
      label: window.location.pathname
    });

    setFormState({
      isSubmitting: false,
      showError: false,
      showSuccess: true,
    });
  } catch (error) {
    setFormState({
      isSubmitting: false,
      showError: true,
      showSuccess: false,
    });
  }
};

const formClassModifier = ({showError, showSuccess}) => {
  if (showError) return 'form-wrapper--error';
  if (showSuccess) return 'form-wrapper--success';
};

const showAlert = ({showError, showSuccess}) => showError || showSuccess;

const alertMessageKey = ({showSuccess}) =>
  showSuccess ? 'shared.newsletter.alert.success' : 'shared.newsletter.alert.error';

const Newsletter = ({className}) => {
  const [email, setEmail] = useState('');
  const [formState, setFormState] = useState({isSubmitting: false, showError: false, showSuccess: false});

  const disabledState = email && !formState.isSubmitting ? '' : 'disabled';

  return (
    <section className={classnames(styles.wrapper, className)}>
      <ActivityIndicator isActive={formState.isSubmitting} />

      <div className={styles['title-wrapper']}>
        <i className={classnames('far fa-envelope', styles.icon)} />
        <div className={styles['title-container']}>
          <FormattedMessage id="shared.newsletter.title">
            {(title) => <h6 className={styles.title}>{title}</h6>}
          </FormattedMessage>

          <FormattedMessage id="shared.newsletter.subtitle">
            {(subtitle) => <p className={styles.subtitle}>{subtitle}</p>}
          </FormattedMessage>
        </div>
      </div>
      <div className={classnames(styles['form-wrapper'], styles[formClassModifier(formState)])}>
        <form className={styles.form} onSubmit={(event) => handleSubscribe(event, email, setFormState)}>
          <FormattedMessage id="shared.newsletter.input-placeholder">
            {(text) => (
              <input
                className={styles.input}
                placeholder={text}
                type="email"
                name="email"
                onChange={(e) => setEmail(e.currentTarget.value)}
                value={email}
              />
            )}
          </FormattedMessage>

          {formState.showSuccess ? (
            <i className={classnames('far fa-check-circle', styles['form-success-icon'])} />
          ) : (
            <FormattedMessage id="shared.newsletter.button-label">
              {(text) => (
                <Button type="submit" className={styles.button} outlined disabled={disabledState}>
                  {text}
                </Button>
              )}
            </FormattedMessage>
          )}
        </form>

        {showAlert(formState) && (
          <FormattedMessage id={alertMessageKey(formState)}>
            {(message) => <p className={styles.alert}>{message}</p>}
          </FormattedMessage>
        )}
      </div>
    </section>
  );
};

Newsletter.propTypes = {
  className: T.string
};

export default Newsletter;
