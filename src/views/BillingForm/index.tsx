import * as React from 'react';
import { Component } from 'react';
import { reduxForm, InjectedFormProps, FormErrors } from 'redux-form';
import { State } from '@src/ducks';
import { connect } from 'react-redux';

interface FormData {}

interface BillingFormProps extends InjectedFormProps {
  planName: 'medium' | 'small' | 'large';
}
interface BillingFormCallbacks {}

const validate = (values: FormData) => {
  const errors: FormErrors<FormData> = {};

  return errors;
};

@reduxForm({ form: 'BillingForm', validate })
class BillingForm extends Component<BillingFormProps & BillingFormCallbacks> {
  render() {
    return (
      <div>
        <h1>Billing form {this.props.planName}</h1>
      </div>
    );
  }
}

const mapStateToProps = (state: State, props): Partial<BillingFormProps> => {
  let planName = props.match.params.planName;
  planName = planName.match(/small|large|medium/) ? planName : 'large';

  return {
    planName
  };
};
const mapDispatchToProps = (dispatch): BillingFormCallbacks => ({});

export default connect(mapStateToProps, mapDispatchToProps)(BillingForm);
