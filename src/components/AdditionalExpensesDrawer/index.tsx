import * as React from 'react';
import { Component } from 'react';
import { Field, reduxForm, InjectedFormProps, FormErrors } from 'redux-form';
import { State } from '@src/ducks';
import Loader from '@src/components/Loader';
import { AdditionalExpense } from '@src/firebase/ducks';
import { DuckStateNode } from 'yapreact/utils/createDuck';
import InputField from 'yapreact/components/Field/Input';
import { FormattedMessage } from 'react-intl';
import SelectField from 'yapreact/components/Field/Select';
import { locale } from '@src/config';

const translations = require(`@src/translations`);
const errorMessages = translations[locale.name].errors;

interface FormData {
  whatToBuy: string;
  whereToBuy: string;
  responsible: 'groom' | 'bride';
  isPaid: boolean;
  amount: number;
  currency: string;
}
interface FormProps extends InjectedFormProps {}
interface FormCallbacks {
  initialVales: FormData;
  onSubmit: (values) => void;
}

const validate = (values: FormData) => {
  const errors: FormErrors<FormData> = {};

  if (!values.whereToBuy || !values.whereToBuy.trim()) {
    errors.whereToBuy = errorMessages.requiredWhereToBuy;
  }

  if (!values.whatToBuy || !values.whatToBuy.trim()) {
    errors.whatToBuy = errorMessages.requiredWhatToBuy;
  }

  if (typeof values.amount === 'undefined') {
    errors.amount = errorMessages.requiredAmount;
  }

  return errors;
};

@reduxForm({ form: 'AdditionalExpenseForm', validate, enableReinitialize: true })
class AdditionalExpenseForm extends Component<InjectedFormProps> {
  render() {
    return (
      <form className="additional-expense-form" onSubmit={this.props.handleSubmit}>
        <label>
          <FormattedMessage id="form.label.additionalExpense.expenditure" />
        </label>
        <Field
          component={InputField}
          label={null}
          name="expenditure"
          type="text"
          wrapperClassName="input-group"
          inputClassName="input-control"
          errorClassName="msg"
        />

        <label>
          <FormattedMessage id="form.label.additionalExpense.whatToBuy" />
        </label>
        <Field
          component={InputField}
          label={null}
          name="whatToBuy"
          type="text"
          wrapperClassName="input-group"
          inputClassName="input-control"
          errorClassName="msg"
        />

        <label>
          <FormattedMessage id="form.label.additionalExpense.whereToBuy" />
        </label>
        <Field
          component={InputField}
          label={null}
          name="whereToBuy"
          type="text"
          wrapperClassName="input-group"
          inputClassName="input-control"
          errorClassName="msg"
        />

        <label>
          <FormattedMessage id="form.label.additionalExpense.responsible" />
        </label>
        <Field
          component={SelectField}
          label={null}
          name="responsible"
          wrapperClassName="input-group"
          inputClassName="input-control"
          errorClassName="msg"
        >
          <FormattedMessage id="form.label.additionalExpense.groom">
            {(msg) => <option value={'groom'}>{msg}</option>}
          </FormattedMessage>
          <FormattedMessage id="form.label.additionalExpense.bride">
            {(msg) => <option value={'bride'}>{msg}</option>}
          </FormattedMessage>
        </Field>

        <label>
          <FormattedMessage id="form.label.additionalExpense.amount" />
        </label>
        <div className="amount-field">
          <Field
            component={InputField}
            label={null}
            name="isPaid"
            type="checkbox"
            wrapperClassName="is-paid-amount-field"
            inputClassName="checkbox-control"
          />

          <Field
            component={InputField}
            label={null}
            name="amount"
            type="number"
            wrapperClassName="input-group"
            inputClassName="input-control"
            errorClassName="msg"
          />
        </div>

        <button className="btn primary">
          <FormattedMessage id="form.label.additionalExpense.saveButton" />
        </button>
      </form>
    );
  }
}

interface AdditionalExpensesProps {
  expense?: AdditionalExpense;
  status: DuckStateNode<null>;
}

interface AdditionalExpensesCallbacks {
  onCreateExpense: (values: any) => void;
}

const AdditionalExpenses = (props: AdditionalExpensesProps & AdditionalExpensesCallbacks) => {
  const isBusy = props.status.isBusy;
  const { expense } = props;
  const initialValues = {
    id: expense ? expense.id : null,
    expenditure: expense ? expense.expenditure : '',
    whatToBuy: expense ? expense.whatToBuy : '',
    whereToBuy: expense ? expense.whereToBuy : '',
    responsible: expense ? expense.responsible : '',
    isPaid: expense ? expense.isPaid : false,
    amount: expense ? expense.amount : 0
  };

  return (
    <div className="budget-drawer">
      <Loader isVisible={isBusy} />

      <div className="tab-body">
        <div className="drawer-tab-body-heading">
          <FormattedMessage id="budget.additionalExpenses.title" />
        </div>
        <AdditionalExpenseForm initialValues={initialValues} onSubmit={props.onCreateExpense} />
      </div>
    </div>
  );
};

export default AdditionalExpenses;
