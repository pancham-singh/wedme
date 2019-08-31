/*
   Invitation screen with its stats and invitation listing
   This component have other child components which includes
   InvitationListing and all send sms steps
 */
import * as React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { State } from '@src/ducks';
import { User, Invitation } from '@src/firebase/ducks';
import { FormattedMessage } from 'react-intl';

import {
  InvitationViewState,
  uploadRecords,
  selectReleation,
  changeSearchText,
  toggleInviteDrawer,
  deleteInvite,
  toggleBigPlusMenu,
  unselectAllSelected,
  showInviteDrawer,
  showShuttleDrawer
} from '@src/views/Invitation/ducks';

import BigPlusMenu from '@src/components/BigPlusMenu';
import InvitationListing from '@src/views/Invitation/InvitationListing';
import SendSms from '@src/views/Invitation/SendSms';
import Drawer from '@src/components/Drawer';
import InviteDrawer from '@src/views/InviteDrawer';
import ShuttleDrawer from '@src/views/ShuttleDrawer';

const downloadImg = require('@src/images/icons/ic-excel@3x.png');
const downloadSvg = require('@src/images/icons/ic-excel.svg');
const deleteImg = require('@src/images/icons/ic-tresh@3x.png');
const deleteSvg = require('@src/images/icons/ic-tresh.svg');
const busSvg = require('@src/images/icons/ic-bus.svg');
const busImg = require('@src/images/icons/ic-bus.png');

interface InvitationProps extends InvitationViewState {
  invitations: { [id: string]: Invitation };
}

interface InvitationCallbacks {
  uploadRecords: (file) => void;
  selectReleation: (relation) => void;
  changeSearchText: (searchText) => void;
  toggleDrawer: () => void;
  deleteInvite: () => void;
  toggleBigPlusMenu: () => void;
  showAddInviteForm: () => void;
  showAddShuttleForm: () => void;
}

let Invitation = ({
  relations,
  searchText,
  drawer,
  toggleDrawer,
  bigPlusMenu,
  invitations,
  uploadRecords,
  selectReleation,
  editingInviteId,
  relationFilter,
  changeSearchText,
  deleteInvite,
  showAddInviteForm,
  isShowingInviteForm,
  isShowingShuttleForm,
  showAddShuttleForm,
  toggleBigPlusMenu
}: InvitationProps & InvitationCallbacks) => {
  const { pathname } = window.location;

  const handleUploadFile = (file) => {
    var reader = new FileReader();
    reader.onload = (e) => {
      uploadRecords(reader.result);
    };
    reader.readAsText(file);
  };

  const confirmed = Object.entries(invitations)
    .map(([id, invitation]) => ({ id, ...invitation }))
    .filter((i) => {
      return i.status == 'confirmed' || false;
    });

  const notAnswered = Object.entries(invitations)
    .map(([id, invitation]) => ({ id, ...invitation }))
    .filter((i) => {
      return i.status == 'notAnswered' || false;
    });
  const waitingForShuttle = Object.entries(invitations)
    .map(([id, invitation]) => ({ id, ...invitation }))
    .filter((i) => {
      return i.status == 'waitingForShuttle' || false;
    });

  return (
    <div className="container-with-drawer">
      <BigPlusMenu {...bigPlusMenu} onToggle={toggleBigPlusMenu}>
        <li className="big-plus-menu__list__item" onClick={showAddInviteForm}>
          <FormattedMessage id="budget.bigPlusMenu.invite" />
        </li>
        <li className="big-plus-menu__list__item--seperator" />
        <li className="big-plus-menu__list__item" onClick={showAddShuttleForm}>
          <FormattedMessage id="budget.bigPlusMenu.shuttle" />
        </li>
      </BigPlusMenu>

      {(editingInviteId || isShowingShuttleForm || isShowingInviteForm) && (
        <Drawer {...drawer} onToggle={toggleDrawer}>
          {(editingInviteId || isShowingInviteForm) && <InviteDrawer inviteId={editingInviteId} />}
          {isShowingShuttleForm && <ShuttleDrawer />}
        </Drawer>
      )}

      <section id="invite">
        <h1 className="title main">
          <FormattedMessage id="invitation.heading_invite" />
        </h1>
        <div className="table-links">
          <NavLink className="active" to="/user/invitation">
            <FormattedMessage id="invitation.heading_invite" />
          </NavLink>
          <NavLink to="/user/gift">
            <FormattedMessage id="invitation.heading_gift" />
          </NavLink>
        </div>
        <div className="invite-status">
          <h2 className="title main">
            {Object.keys(invitations).length} <FormattedMessage id="invitation.total_invites" />
          </h2>
          <div className="status-bar">
            <ul>
              <li>
                <span className="count">{confirmed.length}</span>
                <FormattedMessage id="invitation.invites_confirmed" />
              </li>
              <li>
                <span className="count">{notAnswered.length}</span>
                <FormattedMessage id="invitation.invites_without_response" />
              </li>
              <li>
                <span className="count">{waitingForShuttle.length}</span>
                <FormattedMessage id="invitation.invites_with_shuttle" />
              </li>
            </ul>
          </div>
        </div>

        <div className="table-controls">
          <form>
            <div className="input-group">
              <select
                className="input-control outline"
                defaultValue={relationFilter}
                onChange={(event) => selectReleation(event.target.value)}
              >
                <option value="">Select Relation</option>
                {relations &&
                  Object.keys(relations).map((key) => (
                    <option value={key} key={key}>
                      {relations[key]}
                    </option>
                  ))}
              </select>
            </div>
            <div className="input-group">
              <input
                type="text"
                value={searchText}
                onChange={(event) => changeSearchText(event.target.value)}
                className="input-control search"
                placeholder="Search by guest name"
              />
            </div>
          </form>

          <div className="icons">
            {pathname === '/user/invitation' && (
              <a>
                <object data={downloadSvg} type="image/svg+xml">
                  <img src={downloadImg} />
                </object>
              </a>
            )}
            {pathname === '/user/invitation' && (
              <a onClick={() => deleteInvite()}>
                <object data={deleteSvg} type="image/svg+xml">
                  <img src={deleteImg} />
                </object>
              </a>
            )}
            <NavLink
              className="btn outline chat"
              to="/user/invitation/send-invite/select-recipient"
            >
              <FormattedMessage id="invitation.send_sms_button" />
            </NavLink>
            <button className="btn outline docs">
              <input
                type="file"
                name="records"
                className="upload-records"
                onChange={(event) =>
                  event.target.files[0] && handleUploadFile(event.target.files[0])
                }
              />
              <FormattedMessage id="invitation.upload_record_button" />
            </button>
          </div>
        </div>
        <Switch>
          <Route path="/user/invitation" exact component={InvitationListing} />
          <Route path="/user/invitation/send-invite" component={SendSms} />
        </Switch>
      </section>
    </div>
  );
};

const mapStateToProps = ({
  firebase: { user, invitations },
  invitationView
}: State): InvitationProps => ({
  ...invitationView,
  invitations
});
const mapDispatchToProps = (dispatch): InvitationCallbacks => ({
  uploadRecords: (file) => dispatch(uploadRecords.start(file)),
  selectReleation: (relation) => dispatch(selectReleation(relation)),
  changeSearchText: (searchText) => dispatch(changeSearchText(searchText)),
  toggleDrawer: () => dispatch(toggleInviteDrawer()),
  deleteInvite: () => dispatch(deleteInvite.start()),
  toggleBigPlusMenu: () => dispatch(toggleBigPlusMenu()),
  showAddInviteForm: () => {
    dispatch(unselectAllSelected());
    dispatch(showInviteDrawer());
  },
  showAddShuttleForm: () => {
    dispatch(unselectAllSelected());
    dispatch(showShuttleDrawer());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Invitation);
