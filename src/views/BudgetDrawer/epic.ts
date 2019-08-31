import { Observable } from 'rxjs/Observable';
import '@src/rxjs-imports';
import { savePaymentMilestones, saveBids } from './ducks';
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
      const refPath = `${firebaseApp.dbPaths.vendors(userId)}/${v.vendor.categoryId}/${
        v.vendor.id
      }/paymentMilestones`;
      const ref = firebaseApp.app.database().ref(refPath);

      const milestoneUpdate = {
        advance: { amount: Number(values.advance.amount || 0), isPaid: !!values.advance.isPaid },
        second: { amount: Number(values.second.amount || 0), isPaid: !!values.second.isPaid },
        final: { amount: Number(values.final.amount || 0), isPaid: !!values.final.isBusy }
      };

      return ref
        .update(milestoneUpdate)
        .then(() => savePaymentMilestones.success())
        .catch((err: FirebaseError) => savePaymentMilestones.fail(firebasErrorMsg(err)));
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

export default combineEpics(savePaymentMilestonesEpic, saveBidsEpic);
