import * as React from 'react';
import { Component } from 'react';
import { reduxForm, InjectedFormProps, Field, FormErrors } from 'redux-form';
import InputField from 'yapreact/components/Field/Input';
import { FormattedMessage } from 'react-intl';
import { Vendor } from '@src/firebase/ducks';
import { locale } from '@src/config';

const translations = require(`@src/translations`);
const errorMessages = translations[locale.name].errors;

interface Payment {
  amount: number;
  isPaid: boolean;
}

export interface PaymentTermsFormData {
  advance: Payment;
  second: Payment;
  final: Payment;
}

interface PaymentTermsProps extends InjectedFormProps {
  initialValues: PaymentTermsFormData;
  formValues: PaymentTermsFormData;
}
interface PaymentTermsCallbacks {
  onSubmit: (values: PaymentTermsFormData) => void;
}

const validate = (values: PaymentTermsFormData) => {
  const errors: FormErrors<PaymentTermsFormData> = {
    advance: {},
    second: {},
    final: {}
  };

  if (Number(values.advance.amount) < 0) {
    errors.advance.amount = errorMessages.negativeAmount;
  }

  if (Number(values.second.amount) < 0) {
    errors.second.amount = errorMessages.negativeAmount;
  }

  if (Number(values.final.amount) < 0) {
    errors.final.amount = errorMessages.negativeAmount;
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
    const values = this.props.formValues || {
      advance: { amount: 0 },
      second: { amount: 0 },
      final: { amount: 0 }
    };

    return (
      <form onSubmit={this.props.handleSubmit}>
        <label>
          {Boolean(Number(values.advance.amount)) && (
            <Field
              component={InputField}
              label={null}
              name="advance.isPaid"
              type="checkbox"
              wrapperClassName="inline-form"
              inputClassName="checkbox-control"
            />
          )}
          <FormattedMessage id="form.label.paymentTerms.advance" />
        </label>
        <Field
          component={InputField}
          label={null}
          name="advance.amount"
          type="number"
          wrapperClassName="input-group"
          inputClassName="input-control"
          errorClassName="msg"
        />

        <label>
          {Boolean(Number(values.second.amount)) && (
            <Field
              component={InputField}
              label={null}
              name="second.isPaid"
              type="checkbox"
              wrapperClassName="inline-form"
              inputClassName="checkbox-control"
            />
          )}
          <FormattedMessage id="form.label.paymentTerms.second" />
        </label>
        <Field
          component={InputField}
          label={null}
          name="second.amount"
          type="number"
          wrapperClassName="input-group"
          inputClassName="input-control"
          errorClassName="msg"
        />

        <label>
          {Boolean(Number(values.final.amount)) && (
            <Field
              component={InputField}
              label={null}
              name="final.isPaid"
              type="checkbox"
              wrapperClassName="inline-form"
              inputClassName="checkbox-control"
            />
          )}
          <FormattedMessage id="form.label.paymentTerms.final" />
        </label>
        <Field
          component={InputField}
          label={null}
          name="final.amount"
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
