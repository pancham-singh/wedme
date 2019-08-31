import * as React from 'react';
import { sortBy } from 'ramda';
import { Component } from 'react';
import { Category, Vendor } from '@src/firebase/ducks';
import SchemaForm from '@src/components/SchemaForm';

interface BidsFormProps {
  category: Category;
  vendor: Vendor;
}

interface BidsFormCallback {
  onSubmit: (values: any) => void;
}

export const getNormalizedFormSchema = (category, initialValues) => {
  const schema = category.forms && category.forms.bids;
  // Convert firebase object value to array for array type fields because
  // otherwise redux-form would crash
  Object.entries(schema.properties).forEach(([key, prop]) => {
    if (prop.type === 'array' && initialValues[key]) {
      initialValues[key] = Object.values(initialValues[key]);
    }
  });

  schema.properties = sortBy(([key, value]) => value.index)(
    Object.entries(schema.properties)
  ).reduce((accum, [key, val]) => {
    accum[key] = val;
    return accum;
  }, {});

  return schema;
};

class BidsForm extends Component<BidsFormProps & BidsFormCallback> {
  render() {
    const { category, vendor } = this.props;
    const initialValues = (vendor && vendor.bids) || {};
    const schema = getNormalizedFormSchema(category, initialValues);

    if (!schema) {
      return null;
    }

    return (
      <SchemaForm schema={schema} onSubmit={this.props.onSubmit} initialValues={initialValues} />
    );
  }
}

export default BidsForm;
