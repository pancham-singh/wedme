import * as React from 'react';
import { Field } from 'redux-form';
import DayPickerField from 'yapreact/components/Field/DayPicker';
import { locale } from '@src/config';

interface DateFieldProps {
  name: string;
  schema: {
    title: string;
    titleEnglish: string;
    type: string;
  };
}

const DateField = ({ name, schema }: DateFieldProps) => {
  return (
    <div key={name}>
      <label>
        {locale.name === 'en' && schema.titleEnglish ? schema.titleEnglish : schema.title}
      </label>
      <Field
        component={DayPickerField}
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

export default DateField;
