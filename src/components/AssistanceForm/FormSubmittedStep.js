// Vendor
import React from 'react';
import {useIntl} from 'react-intl';
import {Link} from 'gatsby';

// Styles
import styles from './styles.module.scss';

const FormSubmittedStep = () => {
  const intl = useIntl();
  return (
    <div>
      <h2 className={styles.title}>{intl.formatMessage({id: 'assistance-form.steps.form-submitted.title'})}</h2>

      <p>{intl.formatMessage({id: 'assistance-form.steps.form-submitted.description'})}</p>

      <p>{intl.formatMessage({id: 'assistance-form.steps.form-submitted.guide-call-to-action'})}</p>

      <Link to="/guides/canada" className="button special">
        {intl.formatMessage({id: 'assistance-form.steps.form-submitted.read-guide-button'})}
      </Link>
    </div>
  );
};

export default FormSubmittedStep;
