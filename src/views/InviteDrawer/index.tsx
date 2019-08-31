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

import { Invitation, Gift } from '@src/firebase/ducks';

import { InviteDrawerState, saveInvitation } from '@src/views/InviteDrawer/ducks';
import { InvitationViewState } from '@src/views/Invitation/ducks';

interface InviteFormData extends Invitation {}
interface InviteDrawerProps
  extends InjectedFormProps<InviteDrawerState, {}>,
    InviteDrawerState,
    InvitationViewState {
  invite: Invitation;
  inviteId: string;
  initialValues: any;
}

interface InviteDrawerCallback {
  onSubmit: (values: InviteFormData) => void;
}

const validate = (values: InviteFormData): FormErrors<InviteFormData> => {
  const errors: FormErrors<InviteFormData> = {};

  if (!values.name) {
    errors.name = errorMessages.requiredInviteName;
  }

  if (!values.phone) {
    errors.phone = errorMessages.requiredInvitePhone;
  }

  return errors;
};

@reduxForm({
  form: 'InviteDrawer',
  validate
})
class InviteDrawer extends Component<InviteDrawerProps & InviteDrawerCallback> {
  render() {
    console.warn('props', this.props);
    const { invite, relations, foodPreference, status, inviteSubmission } = this.props;

    const error = inviteSubmission.error;
    const isBusy = inviteSubmission.isBusy;

    return (
      <div className="compare-drawer">
        <div className="tabs-list">
          <span>
            <FormattedMessage id="drawer.inviteTableTitle" />
          </span>
        </div>
        <div className="tab-body">
          <div className="">
            <form onSubmit={this.props.handleSubmit}>
              <Loader isVisible={isBusy} />
              <label>
                <FormattedMessage id="form.label.name" />
              </label>
              <Field
                component={InputField}
                label={null}
                name="name"
                type="text"
                wrapperClassName="input-group"
                inputClassName="input-control"
                errorClassName="msg"
              />
              <label>
                <FormattedMessage id="form.label.numberOfGuest" />
              </label>
              <Field
                component={InputField}
                label={null}
                name="invitedCount"
                type="text"
                wrapperClassName="input-group"
                inputClassName="input-control"
                errorClassName="msg"
              />

              <label>
                <FormattedMessage id="form.label.phone" />
              </label>
              <Field
                component={InputField}
                label={null}
                name="phone"
                type="text"
                wrapperClassName="input-group"
                inputClassName="input-control"
                errorClassName="msg"
              />

              <label>
                <FormattedMessage id="form.label.address" />
              </label>
              <Field
                component={InputField}
                label={null}
                name="address"
                type="text"
                wrapperClassName="input-group"
                inputClassName="input-control"
                errorClassName="msg"
              />
              <label>
                <FormattedMessage id="form.label.city" />
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
                <FormattedMessage id="form.label.welcomeTo" />
              </label>
              <Field
                component={SelectField}
                label={null}
                name="relation"
                type="text"
                wrapperClassName="input-group"
                inputClassName="input-control"
                errorClassName="msg"
              >
                <option value="">Relation</option>
                {Object.keys(relations).map((key) => (
                  <option key={key} value={key}>
                    {relations[key]}
                  </option>
                ))}
              </Field>
              <label>
                <FormattedMessage id="form.label.approveArrival" />
              </label>
              <Field
                component={SelectField}
                label={null}
                name="status"
                type="text"
                wrapperClassName="input-group"
                inputClassName="input-control"
                errorClassName="msg"
              >
                <option value="">Status</option>
                {Object.keys(status).map((key) => (
                  <option key={key} value={key}>
                    {status[key]}
                  </option>
                ))}
              </Field>

              <label>
                <FormattedMessage id="form.label.preferences" />
              </label>
              <Field
                component={SelectField}
                label={null}
                name="foodPreference"
                type="text"
                wrapperClassName="input-group"
                inputClassName="input-control"
                errorClassName="msg"
                defaultValue={invite.foodPreference}
              >
                <option value="">Preferences</option>
                {Object.keys(foodPreference).map((key) => (
                  <option key={key} value={key}>
                    {foodPreference[key]}
                  </option>
                ))}
              </Field>

              <label>
                <FormattedMessage id="form.label.transportation" />
              </label>
              <Field
                component={SelectField}
                label={null}
                name="transportation"
                type="text"
                wrapperClassName="input-group"
                inputClassName="input-control"
                errorClassName="msg"
              >
                <option value="">Select</option>
                <option value="1">Yes</option>
                <option value="0">No</option>
              </Field>

              <label>
                <FormattedMessage id="form.label.addedBy" />
              </label>
              <Field
                component={SelectField}
                label={null}
                name="addedBy"
                type="text"
                wrapperClassName="input-group"
                inputClassName="input-control"
                errorClassName="msg"
              >
                <option value="">Select</option>
                <option value="self">Self</option>
                <option value="parent">Parent</option>
              </Field>

              <div className="text-center">
                <button className="btn primary">
                  <FormattedMessage id="invite.submitButton" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (
  { firebase: { invitations }, inviteDrawer, invitationView }: State,
  props: Partial<InviteDrawerProps>
): Partial<InviteDrawerProps> => {
  const invite = props.inviteId ? invitations[props.inviteId] : {};

  return {
    ...inviteDrawer,
    ...invitationView,
    invite,
    inviteId: props.inviteId || '',
    initialValues: invite
      ? {
          name: pathOr('', ['name'], invite),
          invitedCount: pathOr('', ['invitedCount'], invite),
          phone: pathOr('', ['phone'], invite),
          address: pathOr('', ['location', 'address'], invite),
          city: pathOr('', ['location', 'city'], invite),
          relation: pathOr('', ['relation'], invite),
          foodPreference: pathOr('', ['foodPreference'], invite),
          transportation: pathOr(0, ['transportation', 'required'], invite),
          status: pathOr('', ['status'], invite),
          addedBy: pathOr('', ['addedBy'], invite)
        }
      : {}
  };
};

const mapDispatchToProps = (dispatch): InviteDrawerCallback => ({
  onSubmit: (values) => dispatch(saveInvitation.start(values))
});

export default connect(mapStateToProps, mapDispatchToProps)(InviteDrawer);
