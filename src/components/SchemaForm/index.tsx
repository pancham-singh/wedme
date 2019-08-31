import * as React from 'react';
import { Component, ChangeEventHandler } from 'react';
import { reduxForm, InjectedFormProps } from 'redux-form';
import EnumField from './EnumField';
import TextField from './TextField';
import ArrayField from './ArrayField';
import DateField from './DateField';
import CheckboxField from './CheckboxField';
import { FormattedMessage } from 'react-intl';
import { TreeTotal, calculateTreeTotal, treeHasField } from '@src/lib/tree-total';

interface SchemaFormProps extends InjectedFormProps {
  schema: {
    type: 'object';
    properties: any;
    title: 'string';
    titleEnglish: 'string';
    formTotalTree: TreeTotal;
  };
}
interface SchemaFormCallbacks {}

const makeArrayField = (name: string, value: any) => {
  return null;
};

export const makeSchemaFields = (schema: any, makeName: (n: string) => string) => {
  const supportedTypes = ['number', 'string', 'date', 'boolean'];
  makeName = makeName || ((n) => n);

  const fields = Object.keys(schema.properties).map((fieldName) => {
    const fieldValue = schema.properties[fieldName];

    if (!supportedTypes.includes(fieldValue.type)) {
      console.warn('Unsupported field in JSON Schema for creating a form.', fieldName, fieldValue);

      return null;
    }

    if (fieldValue.enum) {
      return <EnumField key={fieldName} name={makeName(fieldName)} schema={fieldValue} />;
    }

    if (fieldValue.type === 'array') {
      return <ArrayField key={fieldName} name={makeName(fieldName)} schema={fieldValue} />;
    }

    if (fieldValue.type === 'date') {
      return <DateField key={fieldName} name={makeName(fieldName)} schema={fieldValue} />;
    }

    if (fieldValue.type === 'boolean') {
      return <CheckboxField key={fieldName} name={makeName(fieldName)} schema={fieldValue} />;
    }

    return <TextField key={fieldName} name={makeName(fieldName)} schema={fieldValue} />;
  });

  return fields;
};

const makeSchemaForm = (props: SchemaFormProps) => {
  const formName = props.schema.title;

  class SchemaForm extends Component<SchemaFormProps & SchemaFormCallbacks> {
    _schemaFields = null;

    get schemaFields() {
      if (this._schemaFields) {
        this._schemaFields = makeSchemaFields(props.schema);
      }

      return this._schemaFields;
    }

    updateTotalField: ChangeEventHandler<HTMLFormElement> = (event) => {
      const tree = this.props.schema.formTotalTree;
      const form = event.currentTarget;
      const valuesToConsider = {};

      // Gigantic hack incoming
      // Passing the form values through props from state was causing a huge
      // brainfuck. So I had to resort to this.
      Array.from(form.querySelectorAll('input[type=number]')).forEach((el: HTMLInputElement) => {
        valuesToConsider[el.name] = el.value;
      });

      if (!tree) {
        return 0;
      }

      const total = calculateTreeTotal(tree, valuesToConsider);
      const target = event.target;

      // update total only if a field contributing to total is changed
      if (treeHasField(tree, target.name)) {
        this.props.change('total', total);
      }
    };

    render() {
      return (
        <form onSubmit={this.props.handleSubmit} onChange={this.updateTotalField}>
          {makeSchemaFields(props.schema)}

          <div className="buttons centered">
            <button className="btn primary">
              <FormattedMessage id="form.button.save" />
            </button>
          </div>
        </form>
      );
    }
  }

  return <SchemaForm {...props} />;
};

export default reduxForm({ form: 'BidsForm', enableReinitialize: true, destroyOnUnmount: true })(
  makeSchemaForm
);
