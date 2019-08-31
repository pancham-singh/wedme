import * as React from 'react';
import { Field } from 'redux-form';
import InputField from 'yapreact/components/Field/Input';
import { locale } from '@src/config';

interface TextFieldProps {
  name: string;
  schema: {
    title: string;
    titleEnglish: string;
    type: 'boolean';
  };
}

const TextField = ({ name, schema }: TextFieldProps) => {
  return (
    <div key={name} className="input-label-group input-label-group--inline">
      <Field
        component={InputField}
        name={name}
        placeholder={null}
        label={null}
        type="checkbox"
        wrapperClassName="input-group"
        inputClassName="checkbox-control"
      />
      <label>
        {locale.name === 'en' && schema.titleEnglish ? schema.titleEnglish : schema.title}
      </label>
    </div>
  );
};

export default TextField;
