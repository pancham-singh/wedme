import * as React from 'react';
import { Component } from 'react';
import { Field, reduxForm, InjectedFormProps, FormErrors, formValues } from 'redux-form';
import { State } from '@src/ducks';
import Loader from '@src/components/Loader';
import { AdditionalExpense, Category } from '@src/firebase/ducks';
import { DuckStateNode } from 'yapreact/utils/createDuck';
import InputField from 'yapreact/components/Field/Input';
import { FormattedMessage } from 'react-intl';
import SelectField from 'yapreact/components/Field/Select';
import { locale } from '@src/config';
import DrawerBidsForm, { getNormalizedFormSchema } from '@src/views/DrawerBidsForm';
import { makeSchemaFields } from '@src/components/SchemaForm';

const translations = require(`@src/translations`);
const errorMessages = translations[locale.name].errors;

interface Payment {
  amount: number;
  isPaid: boolean;
}

interface FormData {
  paymentMilestones: {
    advance: Payment;
    second: Payment;
    final: Payment;
  };
  vendor: {
    businessName: string;
    categoryId: string | number;
  };
}

interface FormProps extends InjectedFormProps {
  formValues: FormData;
  categories: Category[];
  selectedCategory: Category;
}
interface FormCallbacks {
  onSubmit: (values) => void;
}

const validate = (values: FormData) => {
  const errors: FormErrors<FormData> = {
    vendor: {},
    paymentMilestones: {
      advance: {},
      second: {},
      final: {}
    }
  };

  if (!values.vendor.businessName || !values.vendor.businessName.trim()) {
    errors.vendor.businessName = errorMessages.displayName;
  }

  if (values.paymentMilestones.advance && Number(values.paymentMilestones.advance.amount) < 0) {
    errors.paymentMilestones.advance.amount = errorMessages.negativeAmount;
  }

  if (values.paymentMilestones.second && Number(values.paymentMilestones.second.amount) < 0) {
    errors.paymentMilestones.second.amount = errorMessages.negativeAmount;
  }

  if (values.paymentMilestones.final && Number(values.paymentMilestones.final.amount) < 0) {
    errors.paymentMilestones.final.amount = errorMessages.negativeAmount;
  }

  return errors;
};

@reduxForm({ form: 'AddProviderForm', validate, enableReinitialize: true })
class AddProviderForm extends Component<FormProps & FormCallbacks> {
  render() {
    const selectedCategory = this.props.categories.find(
      (c) => String(c.id) === this.props.formValues.vendor.categoryId
    );
    const categoryFormSchema = getNormalizedFormSchema(selectedCategory, formValues.bids || {});
    const categoryFormFields = makeSchemaFields(categoryFormSchema, (name) => `bids.${name}`);

    return (
      <form onSubmit={this.props.handleSubmit}>
        <h1 className="drawer-form-header">
          <FormattedMessage id="form.title.addProvider" />
        </h1>

        <h2 className="drawer-form-sub-header">
          <FormattedMessage id="form.heading.addProvider.generalInformation" />
        </h2>

        <label>
          <FormattedMessage id="form.label.addProvider.vendorType" />
        </label>
        <Field
          component={SelectField}
          label={null}
          name="vendor.categoryId"
          type="text"
          wrapperClassName="input-group"
          inputClassName="input-control"
          errorClassName="msg"
        >
          {this.props.categories.map((c) => (
            <option key={c.id} value={c.id}>
              {locale.name === 'en' && c.englishName ? c.englishName : c.name}
            </option>
          ))}
        </Field>

        <label>
          <FormattedMessage id="form.label.addProvider.providerName" />
        </label>
        <Field
          component={InputField}
          label={null}
          name="vendor.businessName"
          type="text"
          wrapperClassName="input-group"
          inputClassName="input-control"
          errorClassName="msg"
        />

        <label className="label">
          <FormattedMessage id="form.label.address" />
        </label>
        <Field
          name="vendor.businessAddress"
          label={null}
          component={InputField}
          wrapperClassName="input-group"
          inputClassName="input-control"
          errorClassName="msg"
        />

        <label className="label">
          <FormattedMessage id="form.label.phone" />
        </label>

        <div className="input-group two-elem-provider-form">
          <Field
            component={InputField}
            name="vendor.phone"
            pattern={/^\d{1,9}$/}
            label={null}
            wrapperClassName="two-elem-second-child"
            inputClassName="input-control"
            errorClassName="msg"
          />
          <Field
            component={SelectField}
            name="countryCode"
            label={null}
            wrapperClassName="two-elem-first-child"
            inputClassName="input-control "
            defaultValue="972"
          >
            <option value="972">+972</option>
          </Field>
        </div>

        <h2 className="drawer-form-sub-header">
          <FormattedMessage id="form.heading.addProvider.bids" />
        </h2>
        {categoryFormFields}

        <h2 className="drawer-form-sub-header">
          <FormattedMessage id="form.heading.addProvider.paymentTerms" />
        </h2>

        <label>
          <Field
            component={InputField}
            label={null}
            name="paymentMilestones.advance.isPaid"
            type="checkbox"
            wrapperClassName="inline-form"
            inputClassName="checkbox-control"
          />
          <FormattedMessage id="form.label.addProvider.advance" />
        </label>
        <Field
          component={InputField}
          label={null}
          name="paymentMilestones.advance.amount"
          type="number"
          wrapperClassName="input-group"
          inputClassName="input-control"
          errorClassName="msg"
        />

        <label>
          <Field
            component={InputField}
            label={null}
            name="paymentMilestones.second.isPaid"
            type="checkbox"
            wrapperClassName="inline-form"
            inputClassName="checkbox-control"
          />
          <FormattedMessage id="form.label.addProvider.second" />
        </label>
        <Field
          component={InputField}
          label={null}
          name="paymentMilestones.second.amount"
          type="number"
          wrapperClassName="input-group"
          inputClassName="input-control"
          errorClassName="msg"
        />

        <label>
          <Field
            component={InputField}
            label={null}
            name="paymentMilestones.final.isPaid"
            type="checkbox"
            wrapperClassName="inline-form"
            inputClassName="checkbox-control"
          />
          <FormattedMessage id="form.label.addProvider.final" />
        </label>
        <Field
          component={InputField}
          label={null}
          name="paymentMilestones.final.amount"
          type="number"
          wrapperClassName="input-group"
          inputClassName="input-control"
          errorClassName="msg"
        />

        <div className="buttons centered">
          <button className="btn primary">
            <FormattedMessage id="form.label.addProvider.save" />
          </button>
        </div>
      </form>
    );
  }
}

interface AddProviderProps {
  status: DuckStateNode<void>;
  categories: Category[];
  formValues: any;
}

interface AddProviderCallbacks {
  onAddProvider: (values: FormData) => void;
}

const AddProvider = (props: AddProviderProps & AddProviderCallbacks) => {
  const isBusy = props.status.isBusy;
  const initialPaymentTerms = {
    paymentMilestones: {
      advance: {
        amount: 0,
        isPaid: false
      },
      second: {
        amount: 0,
        isPaid: false
      },
      final: {
        amount: 0,
        isPaid: false
      }
    },
    props: {}
  };

  const initialValues = {
    ...props.formValues,
    ...initialPaymentTerms
  };

  return (
    <div className="budget-drawer">
      <Loader isVisible={isBusy} />

      <div className="tab-body">
        <AddProviderForm
          categories={props.categories || []}
          initialValues={initialValues}
          onSubmit={(values) => {
            props.onAddProvider(values);
          }}
          formValues={props.formValues}
        />
      </div>
    </div>
  );
};

export default AddProvider;
