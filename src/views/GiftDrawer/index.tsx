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

import { GiftDrawerState, saveGift } from '@src/views/GiftDrawer/ducks';
import { InvitationViewState } from '@src/views/Invitation/ducks';
import { GiftViewState } from '@src/views/Gift/ducks';

interface GiftFormData extends Gift {}
interface GiftDrawerProps
  extends InjectedFormProps<GiftDrawerState, {}>,
    GiftDrawerState,
    GiftViewState,
    InvitationViewState {
  gift: Gift;
  giftId: string;
  initialValues: any;
}

interface GiftDrawerCallback {
  onSubmit: (values: GiftFormData) => void;
}

const validate = (values: GiftFormData): FormErrors<GiftFormData> => {
  const errors: FormErrors<GiftFormData> = {};

  if (!values.fullName) {
    errors.fullName = errorMessages.fullName;
  }

  return errors;
};

@reduxForm({
  form: 'InviteDrawer',
  validate
})
class GiftDrawer extends Component<GiftDrawerProps & GiftDrawerCallback> {
  render() {
    const { gift, relations, paymentModes, foodPreference, status, giftSubmission } = this.props;

    const error = giftSubmission.error;
    const isBusy = giftSubmission.isBusy;

    return (
      <div className="compare-drawer">
        <div className="tabs-list">
          <span>
            <FormattedMessage id="drawer.giftTableTitle" />
          </span>
        </div>
        <div className="tab-body">
          <div className="">
            <form onSubmit={this.props.handleSubmit}>
              <Loader isVisible={isBusy} />
              <label>
                <FormattedMessage id="form.label.fullName" />
              </label>
              <Field
                component={InputField}
                label={null}
                name="fullName"
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
                <FormattedMessage id="form.label.numberOfGuestReached" />
              </label>
              <Field
                component={InputField}
                label={null}
                name="reachedCount"
                type="text"
                wrapperClassName="input-group"
                inputClassName="input-control"
                errorClassName="msg"
              />

              <label>
                <FormattedMessage id="form.label.paymentMode" />
              </label>
              <Field
                component={SelectField}
                label={null}
                name="paymentMode"
                type="text"
                wrapperClassName="input-group"
                inputClassName="input-control"
                errorClassName="msg"
              >
                <option value="">Payment Mode</option>
                {Object.keys(paymentModes).map((key) => (
                  <option key={key} value={key}>
                    {paymentModes[key]}
                  </option>
                ))}
              </Field>
              <label>
                <FormattedMessage id="form.label.amount" />
              </label>
              <Field
                component={InputField}
                label={null}
                name="amount"
                type="text"
                wrapperClassName="input-group"
                inputClassName="input-control"
                errorClassName="msg"
              />

              <div className="text-center">
                <button className="btn primary">
                  <FormattedMessage id="gift.submitButton" />
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
  { firebase: { gifts }, giftDrawer, giftView }: State,
  props: Partial<GiftDrawerProps>
): Partial<GiftDrawerProps> => {
  return {
    ...giftDrawer,
    ...giftView,
    gift: props.giftId ? gifts[props.giftId] : {},
    giftId: props.giftId || '',
    initialValues: props.giftId
      ? {
          fullName: gifts[props.giftId].fullName,
          invitedCount: gifts[props.giftId].invitedCount,
          reachedCount: gifts[props.giftId].reachedCount,
          paymentMode: gifts[props.giftId].paymentMode,
          amount: gifts[props.giftId].amount
        }
      : {}
  };
};

const mapDispatchToProps = (dispatch): GiftDrawerCallback => ({
  onSubmit: (values) => dispatch(saveGift.start(values))
});

export default connect(mapStateToProps, mapDispatchToProps)(GiftDrawer);
