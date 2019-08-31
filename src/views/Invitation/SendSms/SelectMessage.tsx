/*
  Select message type for sending sms
*/
import * as React from 'react';
import { connect } from 'react-redux';
import * as classnames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { NavLink } from 'react-router-dom';
import { State } from '@src/ducks';
import { selectMessage, SendSmsViewState } from '@src/views/Invitation/SendSms/ducks';

interface SelectMessageProps extends SendSmsViewState {}

interface SelectMessageCallbacks {
  selectMessage: (type) => void;
}

const icInvitationAlertSvg = require('@src/images/icons/ic-invitation-alert.svg');
const icInvitationAlertImg = require('@src/images/icons/ic-invitation-alert.png');
const icInvitationSvg = require('@src/images/icons/ic-invitation.svg');
const icInvitationImg = require('@src/images/icons/ic-invitation.png');
const icThankYouSvg = require('@src/images/icons/ic-happy.svg');
const icThankYouImg = require('@src/images/icons/ic-happy.png');
const icBusAlertSvg = require('@src/images/icons/ic-bus-alert.svg');
const icBusAlertImg = require('@src/images/icons/ic-bus-alert.png');

const SelectMessage = ({
  messageTypes,
  selectMessage,
  selectedMessageType
}: SelectMessageProps & SelectMessageCallbacks) => (
    <div>
    <label className="status-label">#2 שלב </label>
      <label className="step-name">  בחרי הודעה לשליחה</label>

      <div className="invite-stages">
      <div className="invite-form icons">
        <div className="invitation-message">
          <span className="msg-icon" onClick={() => selectMessage(messageTypes.reminder)}>
            <label
              className={classnames('step-btn', {
                active: selectedMessageType === messageTypes.reminder
              })}
            >
              <object data={icInvitationAlertSvg} type="image/svg+xml">
                <img src={icInvitationAlertImg} />
              </object>
            </label>
            <br />
            <FormattedMessage id="selectMessage.event_reminder" />
          </span>
          <span className="msg-icon" onClick={() => selectMessage(messageTypes.invitation)}>
            <label
              className={classnames('step-btn', {
                active: selectedMessageType === messageTypes.invitation
              })}
            >
              <object data={icInvitationSvg} type="image/svg+xml">
                <img src={icInvitationImg} />
              </object>
            </label>
            <br />
            <FormattedMessage id="selectMessage.wedding_invitation" />
          </span>
          <span className="msg-icon" onClick={() => selectMessage(messageTypes.thankYou)}>
            <label
              className={classnames('step-btn', {
                active: selectedMessageType === messageTypes.thankYou
              })}
            >
              <object data={icThankYouSvg} type="image/svg+xml">
                <img src={icThankYouImg} />
              </object>
            </label>
            <br />
            <FormattedMessage id="selectMessage.thank_you" />
          </span>
          <span className="msg-icon" onClick={() => selectMessage(messageTypes.shuttleReminder)}>
            <label
              className={classnames('step-btn', {
                active: selectedMessageType === messageTypes.shuttleReminder
              })}
            >
              <object data={icBusAlertSvg} type="image/svg+xml">
                <img src={icBusAlertSvg} />
              </object>
            </label>
            <br />
            <FormattedMessage id="selectMessage.shuttle_reminder" />
          </span>
        </div>
        {(selectedMessageType && (
          <NavLink className="btn primary" to="/user/invitation/send-invite/select-language">
            <FormattedMessage id="sendSms.continue_button" />
          </NavLink>
        )) || (
          <button className="btn outline">
            <FormattedMessage id="sendSms.continue_button" />
          </button>
        )}
      </div>
    </div>
  </div>
);

const mapStateToProps = ({ firebase: { user }, sendSmsView }: State): SelectMessageProps => ({
  ...sendSmsView
});

const mapDispatchToProps = (dispatch): SelectMessageCallbacks => ({
  selectMessage: (type) => dispatch(selectMessage(type))
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectMessage);
