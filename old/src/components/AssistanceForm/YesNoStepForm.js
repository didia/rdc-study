// Vendor
import React from 'react';
import T from 'prop-types';
import {Formik, Form, Field} from 'formik';
import classnames from 'classnames';

// Styles
import styles from './styles.module.scss';

// Components
import StepForm from './StepForm';
import StepActions from './StepActions';
import Selector from '../Selector';

const OPTIONS = [
  {
    labelKey: 'shared.no',
    value: 'false'
  },
  {
    labelKey: 'shared.yes',
    value: 'true'
  }
];

const yesNoFieldOnChange = (field, onChange) => (event) => {
  if (onChange) {
    onChange(event.target.value);
  }

  field.onChange(event);
};

export const YesNoField = ({label, name, options, onChange}) => (
  <div className={classnames('field', styles.field)}>
    {label && (
      <label htmlFor={name} className={styles.label}>
        {label}
      </label>
    )}

    <Field name={name}>
      {({field}) => (
        <Selector
          {...field}
          options={options || OPTIONS}
          className={styles.input}
          onChange={yesNoFieldOnChange(field, onChange)}
        />
      )}
    </Field>
  </div>
);

const YesNoStepForm = ({title, value, options, onSubmit, onPreviousStep}) => (
  <StepForm title={title}>
    <Formik
      initialValues={{field: value ? 'true' : 'false'}}
      onSubmit={(values) => {
        onSubmit(values.field === 'true');
      }}
    >
      {({isSubmitting}) => (
        <Form>
          <div className={styles.fields}>
            <YesNoField name="field" options={options} />
          </div>

          <StepActions disabled={isSubmitting} onPrevious={onPreviousStep} />
        </Form>
      )}
    </Formik>
  </StepForm>
);

export default YesNoStepForm;

YesNoField.propTypes = {
  label: T.string,
  name: T.string.isRequired,
  options: T.arrayOf(
    T.shape({
      labelKey: T.string.isRequired,
      value: T.string.isRequired
    })
  ),
  onChange: T.func
};

YesNoStepForm.propTypes = {
  title: T.string.isRequired,
  value: T.bool,
  options: T.arrayOf(
    T.shape({
      labelKey: T.string.isRequired,
      value: T.string.isRequired
    })
  ),
  onPreviousStep: T.func.isRequired,
  onSubmit: T.func.isRequired
};
