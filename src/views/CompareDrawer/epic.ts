import { Observable } from 'rxjs/Observable';
import '@src/rxjs-imports';
import { savePaymentMilestones, saveBids, saveCustomCompareVendor } from './ducks';
import { pathOr } from 'ramda';
import firebaseApp from '@src/firebase';
import { Epic, combineEpics } from 'redux-observable';
import { YapAction } from 'yapreact/utils/createAction';
import { State } from '@src/ducks';
import { FirebaseError } from 'firebase';
import firebaseErrorMsg from '@src/lib/firebaseErrorMsg';

const savePaymentMilestonesEpic: Epic<YapAction<any>, State> = (action$, { getState }) =>
  action$
    .ofType(savePaymentMilestones.start().type)
    .mergeMap(({ payload: { vendor: v, values } }) => {
      const userId = getState().firebase.user.uid;
      const vendorId = v.vendor.id;
      const refPath = `${firebaseApp.dbPaths.vendors(userId)}/${
        v.vendor.categoryId
      }/${vendorId}/paymentMilestones`;
      const ref = firebaseApp.app.database().ref(refPath);

      return ref
        .update({
          advance: { amount: Number(values.advance || 0) },
          second: { amount: Number(values.second || 0) },
          final: { amount: Number(values.final || 0) }
        })
        .then(() => savePaymentMilestones.success())
        .catch((err: FirebaseError) => savePaymentMilestones.fail(firebaseErrorMsg(err)));
    });

const saveBidsEpic: Epic<YapAction<any>, State> = (action$, { getState }) =>
  action$.ofType(saveBids.start().type).mergeMap(({ payload: { vendor: v, values } }) => {
    const userId = getState().firebase.user.uid;
    const refPath = `${firebaseApp.dbPaths.vendors(userId)}/${v.vendor.categoryId}/${
      v.vendor.id
    }/bids`;
    const ref = firebaseApp.app.database().ref(refPath);

    return ref
      .update(values)
      .then(() => saveBids.success())
      .catch((err: FirebaseError) => saveBids.fail(firebaseErrorMsg(err)));
  });

const saveCustomVendorEpic: Epic<YapAction<any>, State> = (action$, { getState }) =>
  action$.ofType(saveCustomCompareVendor.start().type).mergeMap(() => {
    const state: State = getState();
    const userId = state.firebase.user.uid;
    const paymentTerms = pathOr({}, ['PaymentTerms', 'values'], state.form);
    const bids = pathOr({}, ['BidsForm', 'values'], state.form);
    const vendor = pathOr({}, ['NewCompareProvider', 'values', 'vendor'], state.form);
    const category = state.firebase.categories[vendor.categoryId];

    const path = `${firebaseApp.dbPaths.vendors(userId)}/${category.id}`;
    const userRef = firebaseApp.app.database().ref(path);
    let userVendorsRef;

    if (vendor.id) {
      userVendorsRef = userRef.child(vendor.id);
    } else {
      userVendorsRef = userRef.push();
      vendor.id = userVendorsRef.key;
      vendor.categoryName = category.name;
    }

    return userVendorsRef
      .update({
        id: vendor.id,
        isCustom: true,
        vendor,
        paymentTerms,
        bids
      })
      .then(() => saveCustomCompareVendor.success())
      .catch((err) => saveCustomCompareVendor.fail(firebaseErrorMsg(err)));
  });

export default combineEpics(savePaymentMilestonesEpic, saveBidsEpic, saveCustomVendorEpic);
