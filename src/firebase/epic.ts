import { Observable } from 'rxjs/Observable';
import '@src/rxjs-imports';
import { flatten } from 'ramda';
import {
  login,
  logout,
  newProfileValue,
  newVendorValue,
  newAdditionalExpenses,
  Vendor,
  newCategories,
  fetchInvitations,
  fetchGifts
} from './ducks';
import firebase from './index';
import { combineEpics, Epic } from 'redux-observable';
import { FirebaseError } from 'firebase';
import { YapAction } from 'yapreact/utils/createAction';
import { State } from '@src/ducks';
import firebaseErrorMsg from '@src/lib/firebaseErrorMsg';
import logger from '@src/lib/logger';

const log = logger('FirebaseEpic');

const loginEpic = () => firebase.auth$;
const logoutEpic = (action$) =>
  action$.ofType(logout.start().type).mergeMap(() => {
    return firebase.app
      .auth()
      .signOut()
      .then(logout.success)
      .catch((err: FirebaseError) => logout.fail(firebaseErrorMsg(err)));
  });

const fetchOnLoginEpic = (action$) =>
  action$
    .ofType(login.success().type)
    .mergeMap(({ payload }) =>
      Observable.from([
        newProfileValue.start(payload),
        newCategories.start(payload),
        newAdditionalExpenses.start(payload),
        newVendorValue.start(payload)
      ])
    );

const profileEpic = (action$) =>
  action$.ofType(newProfileValue.start().type).mergeMap(({ payload: { uid } }) => {
    return firebase
      .makeDbRef$(firebase.dbPaths.profile(uid))
      .map(newProfileValue.success)
      .takeUntil(action$.ofType(logout.start().type));
  });

const vendorsEpic = (action$) =>
  action$.ofType(newVendorValue.start().type).mergeMap(({ payload: { uid } }) => {
    return firebase
      .makeDbRef$(firebase.dbPaths.vendors(uid))
      .map((vendorsByCategory: { [categoryId: string]: { [vendorId: string]: Vendor } }): {
        [vendorId: string]: Vendor;
      } => {
        const vendors = {};

        Object.values(vendorsByCategory || {}).forEach((cv) => {
          Object.values(cv).forEach((v) => {
            try {
              vendors[v.vendor.id] = v;
            } catch (err) {
              log('Invalid vendor found. Ignoring', err, v);
            }
          });
        });

        return vendors;
      })
      .map(newVendorValue.success)
      .takeUntil(action$.ofType(logout.success().type));
  });

const additionalExpensesEpic = (action$) =>
  action$.ofType(newAdditionalExpenses.start().type).mergeMap(({ payload: { uid } }) => {
    return firebase
      .makeDbRef$(firebase.dbPaths.additionalExpenses(uid))
      .map(newAdditionalExpenses.success)
      .takeUntil(action$.ofType(logout.success().type));
  });

const fetchCategoriesEpic: Epic<YapAction<any>, State> = (action$) =>
  action$.ofType(newCategories.start().type).mergeMap(() => {
    return firebase
      .makeDbRef$(firebase.dbPaths.categories())
      .map(newCategories.success)
      .takeUntil(action$.ofType(logout.success().type));
  });

const fetchInvitationsEpic: Epic<YapAction<any>, State> = (action$) =>
  action$.ofType(login.success().type, 'FETCH_INVITATION').mergeMap(({ payload: { uid } }) => {
    return firebase
      .makeDbRef$(firebase.dbPaths.invites(uid))
      .map(fetchInvitations)
      .takeUntil(action$.ofType(logout.success().type));
  });

const fetchGiftsEpic: Epic<YapAction<any>, State> = (action$) =>
  action$.ofType(login.success().type, 'FETCH_GIFT').mergeMap(({ payload: { uid } }) => {
    return firebase
      .makeDbRef$(firebase.dbPaths.gifts(uid))
      .map(fetchGifts)
      .takeUntil(action$.ofType(logout.success().type));
  });

export default combineEpics(
  fetchOnLoginEpic,
  loginEpic,
  logoutEpic,
  profileEpic,
  vendorsEpic,
  additionalExpensesEpic,
  fetchCategoriesEpic,
  fetchInvitationsEpic,
  fetchGiftsEpic
);
