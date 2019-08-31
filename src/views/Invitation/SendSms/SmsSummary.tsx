import * as React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { SendSmsViewState } from '@src/views/Invitation/SendSms/ducks';
import { User, UserProfile, Invitation } from '@src/firebase/ducks';

import { State } from '@src/ducks';
interface SmsSummaryProps extends SendSmsViewState {
  user: User;
  profile: UserProfile;
  invitations: Invitation;
}

interface SmsSummaryCallbacks {}

const icSentSmsSvg = require('@src/images/icons/ic-sent-sms.svg');
const icSentSmsImg = require('@src/images/icons/ic-sent-sms.png');

const SmsSummary = ({ user, profile, invitations }: SmsSummaryProps & SmsSummaryCallbacks) => {
  console.log('user summary', user, profile);

  const selectedRecipients = Object.entries(invitations)
    .map(([id, invitation]) => ({ id, ...invitation }))
    .filter((invite) => invite.isSelected);

  return (
    <div>
      <label className="status-label"> שלב #5</label>

      <div className="remaining-messages">
        <object data={icSentSmsSvg} type="image/svg+xml">
          <img src={icSentSmsImg} />
        </object>
        <div className="sms-box">
          <span className="msg remaining">
            <label>{selectedRecipients.length}</label>
            <p className="sms-summary"> <FormattedMessage id="smsSummary.success_message" /></p>
          </span>
          <span className="msg used">
            <label>{profile.sms && profile.sms.used}</label>
            <p className="sms-summary">  <FormattedMessage id="smsSummary.total_sms" /></p>
          </span>
        </div>
        {/* <div className="notification"> */}
        {/* <span className="close">X</span> */}
        {/* Pay attention<br /> */}
        {/* Double sms is sent to guests with you should make sure to reach the shuttle */}
        {/* </div> */}
        <div className="text-center buttons">
          <NavLink className="btn outline" to="/user/invitation/send-invite/select-recipient">
            <FormattedMessage id="invitation.send_another_sms_button" />
          </NavLink>
          <NavLink className="btn primary" to="/user/invitation">
            <FormattedMessage id="invitation.finish_sending_sms_button" />
          </NavLink>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({
  firebase: { user, invitations, profile },
  sendSmsView
}: State): SmsSummaryProps => ({
  ...sendSmsView,
  user,
  profile,
  invitations
});

const mapDispatchToProps = (dispatch): SmsSummaryCallbacks => ({});

export default connect(mapStateToProps, mapDispatchToProps)(SmsSummary);
