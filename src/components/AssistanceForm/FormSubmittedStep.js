// Vendor
import React from 'react';
import {useIntl} from 'react-intl';
import {Link} from 'gatsby';
import {useRecoilState} from 'recoil';

// Styles
import styles from './styles.module.scss';

// States
import {destinationCountryState} from './state';

const FormSubmittedStep = () => {
  const intl = useIntl();
  const [destinationCountry] = useRecoilState(destinationCountryState);

  const guidePath = `/guides/${destinationCountry}`;

  return (
    <div>
      <h2 className={styles.title}>{intl.formatMessage({id: 'assistance-form.steps.form-submitted.title'})}</h2>

      <p>{intl.formatMessage({id: 'assistance-form.steps.form-submitted.description'})}</p>

      <p>{intl.formatMessage({id: 'assistance-form.steps.form-submitted.guide-call-to-action'})}</p>

      <div className={styles['centralized-button-wrapper']}>
        <Link to={guidePath} className="button special">
          {intl.formatMessage({id: 'assistance-form.steps.form-submitted.read-guide-button'})}
        </Link>
      </div>
    </div>
  );
};

export default FormSubmittedStep;
