/*
   This component only contain invitation listing
   this component is used in invitation
*/

import * as React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import * as classnames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { State } from '@src/ducks';
import { Invitation } from '@src/firebase/ducks';

import { InvitationViewState, changeSelectedInvite } from '@src/views/Invitation/ducks';
interface InvitationListingProps extends InvitationViewState {
  invitations: { [id: string]: Invitation };
}

interface InvitationListingCallbacks {
  changeSelectedInvite: (id) => void;
}

class InvitationListing extends Component<InvitationListingCallbacks & InvitationListingProps> {
  render() {
    const {
      invitations,
      editingInviteId,
      searchText,
      foodPreference,
      changeSelectedInvite,
      relationFilter,
      relations,
      status
    } = this.props;

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
    if (records.length === 0) {
      return (
        <div className="section">
          <FormattedMessage id="invitation.noInvitationMsg" />
        </div>
      );
    }

    return (
      <div className="section">
        <table className="table nine table-light">
          <thead>
            <tr>
              <th scope="col">
                <FormattedMessage id="invitation.table.headers.name" />
              </th>
              <th scope="col">
                <FormattedMessage id="invitation.table.headers.invited" />
              </th>
              <th scope="col">
                <FormattedMessage id="invitation.table.headers.phone" />
              </th>
              <th scope="col">
                <FormattedMessage id="invitation.table.headers.relation" />
              </th>
              <th scope="col">
                <FormattedMessage id="invitation.table.headers.address" />
              </th>
              <th scope="col">
                <FormattedMessage id="invitation.table.headers.city" />
              </th>
              <th scope="col">
                <FormattedMessage id="invitation.table.headers.arrivalConfirmed" />
              </th>
              <th scope="col">
                <FormattedMessage id="invitation.table.headers.prefrerences" />
              </th>
              <th scope="col">
                <FormattedMessage id="invitation.table.headers.transportation" />
              </th>
            </tr>
          </thead>
          <tbody>
            {records &&
              records.length !== 0 &&
              records.map((record, index) => {
                return (
                  <tr
                    onClick={() => changeSelectedInvite({ editingInviteId, newId: record.id })}
                    className={classnames({ active: record.isEditing })}
                    key={index}
                  >
                    <td>{record.name}</td>
                    <td>{record.invitedCount}</td>
                    <td>{record.phone}</td>
                    <td>{record.relation && relations[record.relation]}</td>
                    <td>{record.location && record.location.address}</td>
                    <td>{record.location && record.location.city}</td>
                    <td>{record.status && status[record.status]}</td>
                    <td>{record.foodPreference && foodPreference[record.foodPreference]}</td>
                    <td>
                      {record.transportation && record.transportation.required ? 'Yes' : 'No'}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    );
  }
}

const mapStateToProps = ({
  firebase: { user, invitations },
  invitationView
}: State): InvitationListingProps => ({
  ...invitationView,
  invitations
});

const mapDispatchToProps = (dispatch): InvitationListingCallbacks => ({
  changeSelectedInvite: (id) => dispatch(changeSelectedInvite(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(InvitationListing);
