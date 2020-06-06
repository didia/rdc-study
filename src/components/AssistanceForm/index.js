// Vendor
import React from 'react';
import {useIntl} from 'react-intl';

// Styles
import styles from './styles.module.scss';

// Components
import CountrySelector from '../CountrySelector';

const AboutCandidateStep = () => {
  const intl = useIntl();

  return (
    <form>
      <h2 className={styles['step-title']}>{intl.formatMessage({id: 'assistance-form.about-candidate.title'})}</h2>
      <p>{intl.formatMessage({id: 'assistance-form.about-candidate.description'})}</p>

      <div className="field">
        <label htmlFor="firstName" className={styles.label}>
          {intl.formatMessage({id: 'assistance-form.about-candidate.first-name'})}
        </label>

        <input type="text" name="firstName" className={styles.input} />
      </div>

      <div className="field">
        <label htmlFor="lastName" className={styles.label}>
          {intl.formatMessage({id: 'assistance-form.about-candidate.last-name'})}
        </label>

        <input type="text" name="lastName" className={styles.input} />
      </div>

      <div className="field">
        <label htmlFor="email" className={styles.label}>
          {intl.formatMessage({id: 'assistance-form.about-candidate.email'})}
        </label>

        <input type="email" name="email" className={styles.input} />
      </div>

      <div className="field">
        <label htmlFor="originCountry" className={styles.label}>
          {intl.formatMessage({id: 'assistance-form.about-candidate.origin-country'})}
        </label>

        <CountrySelector className={styles.input} name="originCountry" />
      </div>

      <ul className="actions">
        <li>
          <input type="submit" className="special" value={intl.formatMessage({id: 'assistance-form.controls.next'})} />
        </li>
      </ul>
    </form>
  );
};

const MasterForm = () => {
  return (
    <div>
      <AboutCandidateStep />
    </div>
  );
};

export default MasterForm;
