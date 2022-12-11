// Vendor
import React from 'react';
import { useIntl } from 'react-intl';
import classnames from 'classnames';
import { Formik, Form, Field, ErrorMessage } from 'formik';

import T from 'prop-types';
import { useRecoilState } from 'recoil';

// Styles
import styles from './styles.module.scss';

// Utils
import { formikFieldErrorClass } from '../../AssistanceForm/utils';

// Components

import StepActions from '../../AssistanceForm/StepActions';
import StepForm from '../../AssistanceForm/StepForm';

// States
import { destinationDetailState } from './states';
import { object, string } from 'yup';

// Const
//import {steps} from './steps';

const destinationDetailSchema = (intl) =>
  object().shape({
    country: string().required(intl.formatMessage({ id: 'shared.forms.validation.required' })),
    city: string().required(intl.formatMessage({ id: 'shared.forms.validation.required' })),
  });


const DetsinationDetailStep = ({ onNextStep, onPreviousStep, steps }) => {
  const intl = useIntl();
  const [destinationDetailData, setDestinationDetailData] = useRecoilState(destinationDetailState);

  return (
    <StepForm
      title={intl.formatMessage({ id: 'assistance-form.steps.buy-ticket.title' })}
      description={intl.formatMessage({ id: 'assistance-form.steps.buy-ticket.description' })}
    >
      <Formik
        initialValues={destinationDetailData}
        validationSchema={destinationDetailSchema(intl)}
        onSubmit={(values) => {
          setDestinationDetailData(values);
          onNextStep(steps.AboutCandidate);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className={classnames(styles.fields, styles['fields--2-by-2'])}>
              <div className={classnames('field', styles.field)}>
                <label htmlFor="country" className={styles.label}>
                  {intl.formatMessage({ id: 'assistance-form.steps.buy-ticket.labels.country' })}
                </label>

                <Field name="country">
                  {({ field, meta }) => (
                    <input
                      type="text"
                      className={classnames(styles.input, formikFieldErrorClass(meta))}
                      placeholder={intl.formatMessage({
                        id: 'assistance-form.steps.buy-ticket.labels.country'
                      })}
                      {...field}
                    />
                  )}
                </Field>

                <ErrorMessage name="country" className={styles['error-message']} component="div" />
              </div>

              <div className={classnames('field', styles.field)}>
                <label htmlFor="city" className={styles.label}>
                  {intl.formatMessage({ id: 'assistance-form.steps.buy-ticket.placeholders.city' })}
                </label>

                <Field name="city">
                  {({ field, meta }) => (
                    <input
                      type="text"
                      className={classnames(styles.input, formikFieldErrorClass(meta))}
                      placeholder={intl.formatMessage({
                        id: 'assistance-form.steps.buy-ticket.placeholders.city'
                      })}
                      {...field}
                    />
                  )}
                </Field>

                <ErrorMessage name="city" className={styles['error-message']} component="div" />
              </div>

            </div>

            <StepActions disabled={isSubmitting} onPrevious={onPreviousStep} />
          </Form>
        )}
      </Formik>
    </StepForm>
  );
};

DetsinationDetailStep.propTypes = {
  onNextStep: T.func,
  onPreviousStep: T.func
};

export default DetsinationDetailStep;
