import { Observable } from 'rxjs/Observable';
import '@src/rxjs-imports';
import { Epic, combineEpics } from 'redux-observable';
import { YapAction } from 'yapreact/utils/createAction';

import { saveInvitation } from '@src/views/InviteDrawer/ducks';
import firebaseApp from '@src/firebase';
import { FirebaseError } from 'firebase';
import firebaseErrorMsg from '@src/lib/firebaseErrorMsg';
import { State } from '@src/ducks';

const saveInviteEpic: Epic<YapAction<any>, State> = (action$, { getState }) =>
  action$.ofType(saveInvitation.start().type).mergeMap(({ payload: values }) => {
    const userId = getState().firebase.user.uid;
    const inviteId = getState().invitationView.editingInviteId || values.phone;
    const refPath = `${firebaseApp.dbPaths.invites(userId)}/${inviteId}`;

    let ref = firebaseApp.app.database().ref(refPath);

    return ref
      .update({
        name: values.name,
        phone: values.phone,
        relation: values.relation,
        invitedCount: values.invitedCount,
        location: { city: values.city, address: values.address },
        transportation: { required: values.transportation ? true : false },
        status: values.status,
        foodPreference: values.foodPreference,
        addedBy: values.addedBy
      })
      .then(() => saveInvitation.success())
      .catch((err: FirebaseError) => saveInvitation.fail(firebaseErrorMsg(err)));
  });

export default combineEpics(saveInviteEpic);
