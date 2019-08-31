/*
  Select recipient - First step to send sms
*/

import * as React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { NavLink } from 'react-router-dom';
import { State } from '@src/ducks';
import { Invitation } from '@src/firebase/ducks';
import { SendSmsViewState } from '@src/views/Invitation/SendSms/ducks';

interface SelectRecipientsProps extends SendSmsViewState {
  invitations: { [id: string]: Invitation };
}


interface SelectRecipientsCallbacks {}

const cursorImg = require('@src/images/icons/cursor.png');
const cursorSvg = require('@src/images/icons/cursor.svg');

const SelectRecipients = ({ invitations }: SelectRecipientsProps & SelectRecipientsCallbacks) => {
  const selectedRecipients = Object.entries(invitations)
    .map(([id, invitation]) => ({ id, ...invitation }))
    .filter((invite) => invite.isSelected);

  return (
    <div>
      <label className="status-label"> #1 שלב</label>
      <div className="invite-stages">
        <div className="invite-form">
          <label className="icon-top">
            <object data={cursorSvg} type="image/svg+xml">
              <img src={cursorImg} />
            </object>
          </label>

          <p className="step-desc">

            <FormattedMessage id="selectRecipient.select_recipient" />
          </p>
          {(selectedRecipients.length && (
            <NavLink className="btn primary" to="/user/invitation/send-invite/select-message">
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
};

const mapStateToProps = ({
  firebase: { invitations },
  sendSmsView
}: State): SelectRecipientsProps => ({
  ...sendSmsView,
  invitations
});

const mapDispatchToProps = (dispatch): SelectRecipientsCallbacks => ({});

export default connect(mapStateToProps, mapDispatchToProps)(SelectRecipients);
