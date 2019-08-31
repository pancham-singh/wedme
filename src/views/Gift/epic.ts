import '@src/rxjs-imports';

import { Observable } from 'rxjs/Observable';
import { Epic, combineEpics } from 'redux-observable';
import { State } from '@src/ducks';
import { YapAction } from 'yapreact/utils/createAction';

import firebaseApp from '@src/firebase';
import { FirebaseError } from 'firebase';
import firebaseErrorMsg from '@src/lib/firebaseErrorMsg';

import { deleteGift, unselectAllSelected } from '@src/views/Gift/ducks';

import logger from '@src/lib/logger';
import { Gift } from '@src/firebase/ducks';

import { LOCATION_CHANGE } from 'react-router-redux';

const log = logger('giftEpic');

const deleteGiftEpic: Epic<YapAction<any>, State> = (action$, { getState }) =>
  action$.ofType(deleteGift.start().type).mergeMap(() => {
    const userId = getState().firebase.user.uid;
    const giftId = getState().giftView.editingGiftId;
    if (!giftId) {
      return Observable.of(deleteGift.fail('Please Select Gift!'));
    }

    const path = `${firebaseApp.dbPaths.gifts(userId)}/${giftId}`;
    const ref = firebaseApp.app.database().ref(path);

    return ref
      .remove()
      .then((records) => {
        return { type: 'FETCH_GIFT_HERE', userId };
      })
      .catch((err) => deleteGift.fail(firebaseErrorMsg(err)));
  });

const toggleGiftEpic: Epic<YapAction<any>, State> = (action$, { getState }) =>
  action$.ofType(LOCATION_CHANGE).map(() => {
    return unselectAllSelected();
  });
export default combineEpics(deleteGiftEpic, toggleGiftEpic);
