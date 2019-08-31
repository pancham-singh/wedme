import { Observable } from 'rxjs/Observable';
import '@src/rxjs-imports';
import { Epic, combineEpics } from 'redux-observable';
import { YapAction } from 'yapreact/utils/createAction';

import { saveGift } from '@src/views/GiftDrawer/ducks';
import firebaseApp from '@src/firebase';
import { FirebaseError } from 'firebase';
import firebaseErrorMsg from '@src/lib/firebaseErrorMsg';
import { State } from '@src/ducks';

const saveGiftEpic: Epic<YapAction<any>, State> = (action$, { getState }) =>
  action$.ofType(saveGift.start().type).mergeMap(({ payload: values }) => {
    const userId = getState().firebase.user.uid;
    const giftId = getState().giftView.editingGiftId;
    const refPath = `${firebaseApp.dbPaths.gifts(userId)}/${giftId}`;

    let ref = firebaseApp.app.database().ref(refPath);

    if (!giftId) {
      ref = ref.push();
    } else {
      ref = ref.child(giftId);
    }
    return ref
      .update({
        fullName: values.fullName,
        invitedCount: values.invitedCount,
        reachedCount: values.reachedCount,
        paymentMode: values.paymentMode,
        amount: values.amount
      })
      .then(() => saveGift.success())
      .catch((err: FirebaseError) => saveGift.fail(firebaseErrorMsg(err)));
  });

export default combineEpics(saveGiftEpic);
