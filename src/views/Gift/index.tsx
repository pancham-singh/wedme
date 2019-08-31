import * as React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import * as classnames from 'classnames';
import { State } from '@src/ducks';
import { User, Gift, Invitation } from '@src/firebase/ducks';
import { FormattedMessage } from 'react-intl';
import Drawer from '@src/components/Drawer';
import GiftDrawer from '@src/views/GiftDrawer';
import BigPlusMenu from '@src/components/BigPlusMenu';

import {
  GiftViewState,
  changeSelectedGift,
  toggleGiftDrawer,
  selectPaymentMode,
  deleteGift,
  changeGuestSearchText,
  unselectAllSelected,
  showGiftDrawer,
  toggleBigPlusMenu
} from '@src/views/Gift/ducks';

const downloadImg = require('@src/images/icons/ic-excel@3x.png');
const downloadSvg = require('@src/images/icons/ic-excel.svg');
const deleteImg = require('@src/images/icons/ic-tresh@3x.png');
const deleteSvg = require('@src/images/icons/ic-tresh.svg');
const busSvg = require('@src/images/icons/ic-bus.svg');
const busImg = require('@src/images/icons/ic-bus.png');
const loversSvg = require('@src/images/lovers.svg');
const loversImg = require('@src/images/lovers@3x.png');

interface GiftProps extends GiftViewState {
  gifts: { [id: string]: Gift };
  invitations: { [id: string]: Invitation };
}

interface GiftCallbacks {
  selectPaymentMode: (relation) => void;
  changeSearchText: (searchText) => void;
  toggleDrawer: () => void;
  changeSelectedGift: (id) => void;
  deleteGift: () => void;
  showAddGiftForm: () => void;
  toggleBigPlusMenu: () => void;
}

let Gift = ({
  paymentModes,
  invitations,
  editingGiftId,
  searchText,
  drawer,
  paymentModeFilter,
  changeSearchText,
  selectPaymentMode,
  toggleDrawer,
  deleteGift,
  changeSelectedGift,
  gifts,
  showAddGiftForm,
  bigPlusMenu,
  isShowingGiftForm,
  toggleBigPlusMenu
}: GiftProps & GiftCallbacks) => {
  const records =
    gifts &&
    Object.entries(gifts)
      .map(([id, invitation]) => ({ ...invitation, id }))
      .filter((a) => {
        return searchText
          ? a.fullName && a.fullName.toLowerCase().indexOf(searchText.toLowerCase()) != -1
          : true;
      })
      .filter((b) => {
        return paymentModeFilter
          ? b.paymentMode && paymentModeFilter.toString() == b.paymentMode
          : true;
      });

  const bankTransfer = Object.entries(gifts)
    .map(([id, invitation]) => ({ id, ...invitation }))
    .filter((i) => {
      return i.paymentMode == 'bankTransfer' || false;
    })
    .reduce((sum, chk) => chk.amount + sum, 0);

  const cash = Object.entries(gifts)
    .map(([id, invitation]) => ({ id, ...invitation }))
    .filter((i) => {
      return i.paymentMode == 'cash' || false;
    })
    .reduce((sum, chk) => chk.amount + sum, 0);

  const credit = Object.entries(gifts)
    .map(([id, invitation]) => ({ id, ...invitation }))
    .filter((i) => {
      return i.paymentMode == 'credit' || false;
    })
    .reduce((sum, chk) => chk.amount + sum, 0);

  const check = Object.entries(gifts)
    .map(([id, invitation]) => ({ id, ...invitation }))
    .filter((i) => {
      return i.paymentMode == 'check' || false;
    })
    .reduce((sum, chk) => chk.amount + sum, 0);

  const total = bankTransfer + credit + cash + check;

  return (
    <div className="container-with-drawer">
      <BigPlusMenu {...bigPlusMenu} onToggle={toggleBigPlusMenu}>
        <li className="big-plus-menu__list__item" onClick={showAddGiftForm}>
          <FormattedMessage id="gift.bigPlusMenu.gift" />
        </li>
      </BigPlusMenu>

      {(editingGiftId || isShowingGiftForm) && (
        <Drawer {...drawer} onToggle={toggleDrawer}>
          <GiftDrawer giftId={editingGiftId} />
        </Drawer>
      )}

      <section id="invite">
        <h1 className="title main">
          <FormattedMessage id="gift.title" />{' '}
        </h1>
        <div className="table-links">
          <NavLink to="/user/invitation">
            <FormattedMessage id="invitation.heading_invite" />
          </NavLink>
          <NavLink className="active" to="/user/gift">
            <FormattedMessage id="invitation.heading_gift" />
          </NavLink>
        </div>
        <div className="invite-status gift-status">
          <span className="lovers-icon">
            <object data={loversSvg} type="image/svg+xml">
              <img src={loversImg} />
            </object>
          </span>
          <h2 className="title main">
            {total} <FormattedMessage id="gift.amount_credit" />
            | {Object.keys(invitations).length} <FormattedMessage id="invitation.total_invites" />
          </h2>
          <div className="status-bar">
            <ul>
              <li>
                <span className="count">{bankTransfer}</span>
                <FormattedMessage id="gift.bank_transfer" />
              </li>
              <li>
                <span className="count">{credit}</span>
                <FormattedMessage id="gift.credited" />
              </li>
              <li>
                <span className="count">{cash}</span>
                <FormattedMessage id="gift.cash" />
              </li>
              <li>
                <span className="count">{check}</span>
                <FormattedMessage id="gift.check" />
              </li>
              <li>
                <span className="count">{records.length}</span>
                <FormattedMessage id="gift.gift_given" />
              </li>
            </ul>
          </div>
        </div>
        <div className="table-controls">
          <form>
            <div className="input-group">
              <select
                className="input-control outline"
                defaultValue={paymentModeFilter}
                onChange={(event) => selectPaymentMode(event.target.value)}
              >
                <option value="">Payment Type</option>
                {paymentModes &&
                  Object.keys(paymentModes).map((key) => (
                    <option value={key} key={key}>
                      {paymentModes[key]}
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
            <a href="#">
              <object data={downloadSvg} type="image/svg+xml">
                <img src={downloadImg} />
              </object>
            </a>
            <a onClick={() => deleteGift()}>
              <object data={deleteSvg} type="image/svg+xml">
                <img src={deleteImg} />
              </object>
            </a>
          </div>
        </div>
        {records && records.length ? (
          <div className="section">
            <table className="table six table-light">
              <thead>
                <tr>
                  <th scope="col">
                    <FormattedMessage id="gift.table.headers.invitedName" />
                  </th>
                  <th scope="col">
                    <FormattedMessage id="gift.table.headers.invitedCount" />
                  </th>
                  <th scope="col">
                    <FormattedMessage id="gift.table.headers.reached" />
                  </th>
                  <th scope="col">
                    <FormattedMessage id="gift.table.headers.amount" />
                  </th>
                  <th scope="col">
                    <FormattedMessage id="gift.table.headers.currency" />
                  </th>
                  <th scope="col">
                    <FormattedMessage id="gift.table.headers.paymentType" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {records &&
                  records.length !== 0 &&
                  records.map((record, index) => {
                    return (
                      <tr
                        onClick={() => changeSelectedGift({ editingGiftId, newId: record.id })}
                        className={classnames({ active: record.isEditing })}
                        key={index}
                      >
                        <td>{record.fullName}</td>
                        <td>{record.invitedCount}</td>
                        <td>{record.reachedCount}</td>
                        <td>{record.amount}</td>
                        <td>{record.currency}</td>
                        <td>{record.paymentMode && paymentModes[record.paymentMode]}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="section">
            <FormattedMessage id="gift.noGiftsMsg" />{' '}
          </div>
        )}
      </section>
    </div>
  );
};

const mapStateToProps = ({ firebase: { gifts, invitations }, giftView }: State): GiftProps => ({
  ...giftView,
  gifts,
  invitations
});
const mapDispatchToProps = (dispatch): GiftCallbacks => ({
  selectPaymentMode: (paymentMode) => dispatch(selectPaymentMode(paymentMode)),
  changeSearchText: (searchText) => dispatch(changeGuestSearchText(searchText)),
  toggleDrawer: () => dispatch(toggleGiftDrawer()),
  changeSelectedGift: (id) => dispatch(changeSelectedGift(id)),
  deleteGift: () => dispatch(deleteGift.start()),
  toggleBigPlusMenu: () => dispatch(toggleBigPlusMenu()),
  showAddGiftForm: () => {
    dispatch(unselectAllSelected());
    dispatch(showGiftDrawer());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Gift);
