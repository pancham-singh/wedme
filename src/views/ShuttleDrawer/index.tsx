import * as React from 'react';
import { pathOr } from 'ramda';
import { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import * as classnames from 'classnames';
import {
  reduxForm,
  Field,
  FormProps,
  FormSubmitProp,
  FormErrors,
  InjectedFormProps
} from 'redux-form';
import { State } from '@src/ducks';

import InputField from 'yapreact/components/Field/Input';
import SelectField from 'yapreact/components/Field/Select';
import Loader from '@src/components/Loader';
import { locale } from '@src/config';

const translations = require(`@src/translations`);
const errorMessages = translations[locale.name].errors;

import { Shuttle } from '@src/firebase/ducks';

import { ShuttleDrawerState, saveShuttle } from '@src/views/ShuttleDrawer/ducks';

interface ShuttleFormData extends Shuttle {}
interface ShuttleDrawerProps
  extends InjectedFormProps<ShuttleDrawerState, {}>,
    ShuttleDrawerState {}

interface ShuttleDrawerCallback {
  onSubmit: (values: ShuttleFormData) => void;
}

const validate = (values: ShuttleFormData): FormErrors<ShuttleFormData> => {
  const errors: FormErrors<ShuttleFormData> = {};

  if (!values.city) {
    errors.city = errorMessages.fullName;
  }

  return errors;
};

@reduxForm({
  form: 'ShuttleDrawer',
  validate
})
class ShuttleDrawer extends Component<ShuttleDrawerProps & ShuttleDrawerCallback> {
  render() {
    const { shuttleSubmission } = this.props;

    const error = shuttleSubmission.error;
    const isBusy = shuttleSubmission.isBusy;

    return (
      <div className="compare-drawer">
        <div className="tabs-list">
          <span>
            <FormattedMessage id="drawer.shuttleTableTitle" />
          </span>
        </div>
        <div className="tab-body">
          <div className="">
            <form onSubmit={this.props.handleSubmit}>
              <Loader isVisible={isBusy} />
              <label>
                <FormattedMessage id="form.label.addShuttle.city" />
              </label>
              <Field
                component={InputField}
                label={null}
                name="city"
                type="text"
                wrapperClassName="input-group"
                inputClassName="input-control"
                errorClassName="msg"
              />
              <label>
                <FormattedMessage id="form.label.addShuttle.gatheringPlace" />
              </label>
              <Field
                component={InputField}
                label={null}
                name="gatheringPlace"
                type="text"
                wrapperClassName="input-group"
                inputClassName="input-control"
                errorClassName="msg"
              />

              <label>
                <FormattedMessage id="form.label.addShuttle.pickupDateTime" />
              </label>
              <Field
                component={InputField}
                label={null}
                name="pickupDateTime"
                type="text"
                wrapperClassName="input-group"
                inputClassName="input-control"
                errorClassName="msg"
              />

              <div className="text-center">
                <button className="btn primary">
                  <FormattedMessage id="form.button.addShuttle.saveShuttle" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ shuttleDrawer }: State): Partial<ShuttleDrawerProps> => {
  return {
    ...shuttleDrawer
  };
};

const mapDispatchToProps = (dispatch): ShuttleDrawerCallback => ({
  onSubmit: (values) => dispatch(saveShuttle.start(values))
});

export default connect(mapStateToProps, mapDispatchToProps)(ShuttleDrawer);
