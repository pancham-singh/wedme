import * as React from 'react';
import { Field } from 'redux-form';
import InputField from 'yapreact/components/Field/Input';
import { locale } from '@src/config';

interface TextFieldProps {
  name: string;
  schema: {
    title: string;
    titleEnglish: string;
    type: string;
  };
}

const TextField = ({ name, schema }: TextFieldProps) => {
  return (
    <div key={name}>
      <label>
        {locale.name === 'en' && schema.titleEnglish ? schema.titleEnglish : schema.title}
      </label>
      <Field
        component={InputField}
        name={name}
        placeholder={null}
        label={null}
        type={schema.type}
        wrapperClassName="input-group"
        inputClassName="input-control"
      />
    </div>
  );
};

export default TextField;
