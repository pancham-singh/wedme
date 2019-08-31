import * as React from 'react';
import { Component } from 'react';
import { reduxForm, InjectedFormProps, Field, FormErrors } from 'redux-form';
import InputField from 'yapreact/components/Field/Input';
import { FormattedMessage } from 'react-intl';
import { Vendor } from '@src/firebase/ducks';
import { locale } from '@src/config';

const translations = require(`@src/translations`);
const errorMessages = translations[locale.name].errors;

export interface PaymentTermsFormData {
  advance: number;
  second: number;
  final: number;
}

interface PaymentTermsProps extends InjectedFormProps {
  initialValues: PaymentTermsFormData;
}
interface PaymentTermsCallbacks {
  onSubmit: (values: PaymentTermsFormData) => void;
}

const validate = (values: PaymentTermsFormData) => {
  const errors: FormErrors<PaymentTermsFormData> = {};

  if (values.advance < 0) {
    errors.advance = errorMessages.negativeAmount;
  }

  if (values.second < 0) {
    errors.second = errorMessages.negativeAmount;
  }

  if (values.final < 0) {
    errors.second = errorMessages.negativeAmount;
  }

  return errors;
};

@reduxForm({
  form: 'PaymentTerms',
  enableReinitialize: true,
  validate
})
class PaymentTerms extends Component<PaymentTermsProps & PaymentTermsCallbacks> {
  render() {
    return (
      <form onSubmit={this.props.handleSubmit}>
        <label>
          <FormattedMessage id="form.label.paymentTerms.advance" />
        </label>
        <Field
          component={InputField}
          label={null}
          name="advance"
          type="number"
          wrapperClassName="input-group"
          inputClassName="input-control"
          errorClassName="msg"
        />

        <label>
          <FormattedMessage id="form.label.paymentTerms.second" />
        </label>
        <Field
          component={InputField}
          label={null}
          name="second"
          type="number"
          wrapperClassName="input-group"
          inputClassName="input-control"
          errorClassName="msg"
        />

        <label>
          <FormattedMessage id="form.label.paymentTerms.final" />
        </label>
        <Field
          component={InputField}
          label={null}
          name="final"
          type="number"
          wrapperClassName="input-group"
          inputClassName="input-control"
          errorClassName="msg"
        />

        <div className="buttons centered">
          <button className="btn primary">
            <FormattedMessage id="form.label.paymentTerms.save" />
          </button>
        </div>
      </form>
    );
  }
}

export default PaymentTerms;
