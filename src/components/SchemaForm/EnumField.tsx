import * as React from 'react';
import { Field } from 'redux-form';
import SelectField from 'yapreact/components/Field/Select';
import { locale } from '@src/config';

interface EnumFieldProps {
  name: string;
  schema: {
    title: string;
    titleEnglish: string;
    enum: string[];
  };
}

const EnumField = ({ name, schema }) => {
  return (
    <div>
      <label>
        {locale.name === 'en' && schema.titleEnglish ? schema.titleEnglish : schema.title}
      </label>
      <Field
        component={SelectField}
        name={name}
        placeholder={null}
        label={null}
        wrapperClassName="input-group"
        inputClassName="input-control"
      >
        {Object.values(schema.enum).map((x) => (
          <option key={x} value={x}>
            {x}
          </option>
        ))}
      </Field>
    </div>
  );
};

export default EnumField;
