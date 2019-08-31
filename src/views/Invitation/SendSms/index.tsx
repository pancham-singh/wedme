/*
  Send sms steps are handled here
   - it contain other child components for sending sms
*/

import * as React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Component } from 'react';
import * as classnames from 'classnames';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import { State } from '@src/ducks';
import { toggleSelectedRecipient, SendSmsViewState } from '@src/views/Invitation/SendSms/ducks';
import SelectRecipients from '@src/views/Invitation/SendSms/SelectRecipients';
import SelectMessage from '@src/views/Invitation/SendSms/SelectMessage';
import SelectLanguage from '@src/views/Invitation/SendSms/SelectLanguage';
import SmsConfirmation from '@src/views/Invitation/SendSms/SmsConfirmation';
import SmsSummary from '@src/views/Invitation/SendSms/SmsSummary';
import { Invitation } from '@src/firebase/ducks';
import { InvitationViewState } from '@src/views/Invitation/ducks';

interface SendSmsProps extends SendSmsViewState, InvitationViewState {
  invitations: { [id: string]: Invitation };
}

interface SendSmsCallbacks {
  toggleSelectedRecipient: (id) => void;
}

const icbusSvg = require('@src/images/icons/ic-bus.svg');
const icbusImg = require('@src/images/icons/ic-bus.png');

class SendSms extends Component<SendSmsCallbacks & SendSmsProps> {
  render() {
    const {
      toggleSelectedRecipient,
      invitations,
      selectedMessageType,
      selectedLanguage,
      relations,
      searchText,
      relationFilter
    } = this.props;


    const { pathname } = window.location;
    const selectRecipentUrl = '/user/invitation/send-invite/select-recipient';
    const selectMessageUrl = '/user/invitation/send-invite/select-message';
    const selectLanguageUrl = '/user/invitation/send-invite/select-language';
    const smsConfirmationUrl = '/user/invitation/send-invite/sms-confirmation';
    const smsSummaryUrl = '/user/invitation/send-invite/sms-summary';
    const enableSelection = pathname === selectRecipentUrl || false;

    const records =
      invitations &&
      Object.entries(invitations)
        .map(([id, invitation]) => ({ ...invitation, id }))
        .filter((a) => {
          return searchText
            ? a.name && a.name.toLowerCase().indexOf(searchText.toLowerCase()) != -1
            : true;
        })
        .filter((b) => {
          return relationFilter ? b.relation && relationFilter.toString() == b.relation : true;
        });
    console.log(records)

    if (records.length === 0) {
      return (
        <div className="section">
          <FormattedMessage id="invitation.sms.noRecord" />
        </div>
      );
    }

    return (
      <div className="table-two-section">
        <div className="section">
          <div className="links-header">
            <span className="link-btn active">
              <FormattedMessage id="invitation.sms.buttons.recipients" />
            </span>
            <span
              className={classnames('link-btn', {
                active:
                  pathname === selectMessageUrl ||
                  pathname === selectLanguageUrl ||
                  pathname === smsConfirmationUrl ||
                  pathname === smsSummaryUrl
              })}
            >
              <FormattedMessage id="invitation.sms.buttons.message" />
            </span>
            <span
              className={classnames('link-btn', {
                active:
                  pathname === selectLanguageUrl ||
                  pathname === smsConfirmationUrl ||
                  pathname === smsSummaryUrl
              })}
            >
              <FormattedMessage id="invitation.sms.buttons.language" />
            </span>
            <span
              className={classnames('link-btn', {
                active: pathname === smsConfirmationUrl || pathname === smsSummaryUrl
              })}
            >
              <FormattedMessage id="invitation.sms.buttons.confirmation" />
            </span>
            <span
              className={classnames('link-btn', {
                active: pathname === smsSummaryUrl
              })}
            >
              <FormattedMessage id="invitation.sms.buttons.summary" />
            </span>
            <span className="bus">
              <object data={icbusSvg} type="image/svg+xml">
                <img src={icbusImg} />
              </object>
            </span>
          </div>
          <div className="box">
            <Switch>
              <Route path={selectRecipentUrl} exact component={SelectRecipients} />
              <Route path={selectMessageUrl} exact component={SelectMessage} />
              <Route path={selectLanguageUrl} exact component={SelectLanguage} />
              <Route path={smsConfirmationUrl} exact component={SmsConfirmation} />
              <Route path={smsSummaryUrl} exact component={SmsSummary} />
            </Switch>
          </div>
        </div>
        <div className="section">
          <table className="table table-light">
            <thead>
              <tr>
                <th scope="col">
                  <FormattedMessage id="invitation.table.headers.transportation" />{' '}
                </th>
                <th scope="col">
                  <FormattedMessage id="invitation.table.headers.arrivalConfirmed" />
                </th>
                <th scope="col">
                  <FormattedMessage id="invitation.table.headers.relation" />
                </th>
                <th scope="col">
                  <FormattedMessage id="invitation.table.headers.name" />
                </th>
              </tr>
            </thead>
            <tbody>
              {records &&
                records.length !== 0 &&
                records.map((record, index) => {
                  return (
                       <tr
                      onClick={() => enableSelection && record.phone ? toggleSelectedRecipient(record.id) : false}
                      className={classnames({ active: record.phone ? record.isSelected : false})}
                      key={index}
                    >

                      <td>
                        {record.transportation && record.transportation.required ? 'Yes' : 'No'}
                      </td>
                      <td>{record.status}</td>
                      <td>{record.relation && relations[record.relation]}</td>
                      <td>{record.name}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({
  firebase: { user, invitations },
  invitationView,
  sendSmsView
}: State): SendSmsProps => ({
  ...invitationView,
  ...sendSmsView,
  invitations
});

const mapDispatchToProps = (dispatch): SendSmsCallbacks => ({
  toggleSelectedRecipient: (id) => dispatch(toggleSelectedRecipient(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(SendSms);
