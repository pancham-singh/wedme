import * as React from 'react';
import { reduxForm, Field } from 'redux-form';
import InputField from 'yapreact/components/Field/Input';
import SelectField from 'yapreact/components/Field/Select';
import { Category } from '@src/firebase/ducks';
import { locale } from '@src/config';
import { FormattedMessage } from 'react-intl';

interface Props {
  categories: Category[];
}

interface Callbacks {
  onChangeCategory: (id: string) => void;
}

const NewProvider = (props: Props & Callbacks) => {
  return (
    <form>
      <label className="label">
        <FormattedMessage id="form.label.addProvider.providerName" />
      </label>
      <Field
        name="vendor.businessName"
        label={null}
        component={InputField}
        wrapperClassName="input-group"
        inputClassName="input-control"
        errorClassName="msg"
      />

      <label className="label">
        <FormattedMessage id="form.label.address" />
      </label>
      <Field
        name="vendor.address"
        label={null}
        component={InputField}
        wrapperClassName="input-group"
        inputClassName="input-control"
        errorClassName="msg"
      />

      <label className="label">
        <FormattedMessage id="form.label.phone" />
      </label>
      <Field
        name="vendor.phone"
        component={InputField}
        label={null}
        wrapperClassName="input-group"
        inputClassName="input-control"
        errorClassName="msg"
      />

      <label className="label">
        <FormattedMessage id="form.label.category" />
      </label>
      <Field
        name="vendor.categoryId"
        component={SelectField}
        label={null}
        wrapperClassName="input-group"
        inputClassName="input-control"
        errorClassName="msg"
        onChange={(x) => props.onChangeCategory(x.target.value)}
      >
        {props.categories.map((c) => (
          <option key={c.id} value={c.id}>
            {locale.name === 'en' && c.englishName ? c.englishName : c.name}
          </option>
        ))}
      </Field>
    </form>
  );
};

export default reduxForm({
  form: 'NewCompareProvider',
  enableReinitialize: true,
  destroyOnUnmount: true
})(NewProvider);
