import { Observable } from 'rxjs/Observable';
import '@src/rxjs-imports';
import { Epic, combineEpics } from 'redux-observable';
import { YapAction } from 'yapreact/utils/createAction';

import { saveShuttle } from '@src/views/ShuttleDrawer/ducks';
import firebaseApp from '@src/firebase';
import { FirebaseError } from 'firebase';
import firebaseErrorMsg from '@src/lib/firebaseErrorMsg';
import { State } from '@src/ducks';

const saveShuttleEpic: Epic<YapAction<any>, State> = (action$, { getState }) =>
  action$.ofType(saveShuttle.start().type).mergeMap(({ payload: values }) => {
    const userId = getState().firebase.user.uid;
    const refPath = `${firebaseApp.dbPaths.shuttles(userId)}`;

    const ref = firebaseApp.app.database().ref(refPath);

    return ref
      .update({
        city: values.city,
        gatheringPlace: values.gatheringPlace,
        pickupDateTime: values.pickupDateTime
      })
      .then(() => saveShuttle.success())
      .catch((err: FirebaseError) => saveShuttle.fail(firebaseErrorMsg(err)));
  });
export default combineEpics(saveShuttleEpic);
