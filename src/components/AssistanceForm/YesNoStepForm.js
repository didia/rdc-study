'use client';

// Vendor
import React from 'react';
import {useForm, FormProvider, useFormContext} from 'react-hook-form';
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

export const YesNoField = ({label, name, options, onChange}) => {
  const {register, setValue, watch} = useFormContext();
  const value = watch(name);

  const handleChange = (event) => {
    setValue(name, event.target.value, {shouldValidate: true});
    if (onChange) {
      onChange(event.target.value);
    }
  };

  return (
    <div className={classnames('field', styles.field)}>
      {label && (
        <label htmlFor={name} className={styles.label}>
          {label}
        </label>
      )}

      <Selector
        name={name}
        value={value}
        options={options || OPTIONS}
        className={styles.input}
        onChange={handleChange}
      />
    </div>
  );
};

const YesNoStepForm = ({title, value, options, onSubmit, onPreviousStep}) => {
  const methods = useForm({
    defaultValues: {field: value ? 'true' : 'false'}
  });

  const {
    handleSubmit,
    formState: {isSubmitting}
  } = methods;

  const onFormSubmit = (values) => {
    onSubmit(values.field === 'true');
  };

  return (
    <StepForm title={title}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <div className={styles.fields}>
            <YesNoField name="field" options={options} />
          </div>

          <StepActions disabled={isSubmitting} onPrevious={onPreviousStep} />
        </form>
      </FormProvider>
    </StepForm>
  );
};

export default YesNoStepForm;
