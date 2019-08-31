import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { reduxForm, Field, FormErrors } from 'redux-form';
import InputField from 'yapreact/components/Field/Input';
import { locale } from '@src/config';
import { validateEmail } from 'yapreact/utils';

const translations = require(`@src/translations`);
const errorMessages = translations[locale.name].errors;

interface FormData {
  email: string;
}

const OtpEmailForm = ({ handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit}>
      <label>
        <FormattedMessage id="form.label.email" />
      </label>
      <Field
        component={InputField}
        label={null}
        name="email"
        type="email"
        wrapperClassName="input-group"
        inputClassName="input-control"
        errorClassName="msg"
      />

      <div className="text-center">
        <button className="btn primary">
          <FormattedMessage id="forgotPassword.sendEmailButton" />
        </button>
      </div>
    </form>
  );
};

const validate = (values: FormData) => {
  const errors: FormErrors<FormData> = {};

  if (!values.email || !values.email.trim()) {
    errors.email = errorMessages.requiredEmail;

    return errors;
  }

  if (!validateEmail(values.email)) {
    errors.email = errorMessages.invalidEmail;
  }

  return errors;
};

export default reduxForm({ form: 'ForgotPasswordOtp', validate })(OtpEmailForm);
