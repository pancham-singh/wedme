import * as React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { NavLink } from 'react-router-dom';
import { State } from '@src/ducks';

import {
  SendSmsViewState,
  changeSmsTemplate,
  changeRideTemplate,
  sendSms
} from '@src/views/Invitation/SendSms/ducks';

interface SmsConfirmationProps extends SendSmsViewState {}

interface SmsConfirmationCallbacks {
  changeSmsTemplate: (templateText) => void;
  changeRideTemplate: (rideText) => void;
  sendSms: () => void;
}

const SmsConfirmation = ({
  selectedLanguage,
  selectedMessageType,
  messageTypes,
  smsTemplate,
  sendSms,
  changeSmsTemplate,
  rideTemplate,
  changeRideTemplate
}: SmsConfirmationProps & SmsConfirmationCallbacks) => {
  return (
    <div style={{ height: '590px' }}>
      <label className="status-label">שלב #4</label>
      <label className="step-name">  אשרי את נוסח ההודעה, ניתן לערוך במידת הצורך</label>


      <div className="msg-listing">
        <div>
          <p>
            <FormattedMessage id="smsConfirmation.confirm_text" />
          </p>
          <textarea
            className="msg-item"
            onChange={(event) => changeSmsTemplate(event.target.value)}
            defaultValue={smsTemplate || ''}
            maxLength={200}
          />
          <label className="word-count">{smsTemplate.length}/200</label>
        </div>
        {selectedMessageType === messageTypes.invitation && (
          <div className="shuttle-alert">
            <p>
              <FormattedMessage id="smsConfirmation.automatic_message_alert" />
            </p>
            <textarea
              className="msg-item"
              onChange={(event) => changeRideTemplate(event.target.value)}
              defaultValue={rideTemplate}
              maxLength={200}
            />
            <label className="word-count">{rideTemplate.length}/200</label>
          </div>
        )}
        <div className="text-center">
          <button className="btn primary" onClick={() => sendSms()}>
            <FormattedMessage id="smsConfirmation.confirm_ready_button" />
          </button>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ sendSmsView }: State): SmsConfirmationProps => ({
  ...sendSmsView
});

const mapDispatchToProps = (dispatch): SmsConfirmationCallbacks => ({
  changeSmsTemplate: (template) => dispatch(changeSmsTemplate(template)),
  changeRideTemplate: (template) => dispatch(changeRideTemplate(template)),
  sendSms: () => dispatch(sendSms.start())
});

export default connect(mapStateToProps, mapDispatchToProps)(SmsConfirmation);
