import * as React from 'react';
import { Field, FieldArray } from 'redux-form';
import InputField from 'yapreact/components/Field/Input';
import { locale } from '@src/config';

interface ArrayFieldProps {
  name: string;
  schema: {
    title: string;
    titleEnglish: string;
    type: 'array';
    items: {
      type: string;
    };
  };
}

const ArrayField = ({ name, schema }) => {
  return (
    <div>
      <label>
        {locale.name === 'en' && schema.titleEnglish ? schema.titleEnglish : schema.title}
      </label>
      <FieldArray
        name={name}
        component={({ fields }) => (
          <ul className="field-array">
            {fields.map((field, index) => (
              <li key={index}>
                <Field
                  name={`${field}`}
                  component={InputField}
                  placeholder={null}
                  label={null}
                  type={schema.items.type}
                  wrapperClassName="input-group"
                  inputClassName="input-control"
                />
                <span className="remove btn" onClick={() => fields.remove(index)}>
                  X
                </span>
              </li>
            ))}
            <li>
              <span className="btn text-only add-more" onClick={() => fields.push()}>
                Add additional Expense
              </span>
            </li>
          </ul>
        )}
      />
    </div>
  );
};

export default ArrayField;
