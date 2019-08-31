/*
  Following things are handled here:
   - Uploading invitations to firebase
   - Deleting  invitation from firebase
   - Toggle selected invite
*/

import '@src/rxjs-imports';

import { Observable } from 'rxjs/Observable';
import { Epic, combineEpics } from 'redux-observable';
import { State } from '@src/ducks';
import { YapAction } from 'yapreact/utils/createAction';

import firebaseApp from '@src/firebase';
import { FirebaseError } from 'firebase';
import firebaseErrorMsg from '@src/lib/firebaseErrorMsg';

import { uploadRecords, deleteInvite, unselectAllSelected } from '@src/views/Invitation/ducks';

import logger from '@src/lib/logger';
import { Invitation } from '@src/firebase/ducks';
import { LOCATION_CHANGE } from 'react-router-redux';

const csvToJson = require('csvtojson');

const log = logger('invitationEpic');

const uploadRecordsEpic: Epic<YapAction<any>, State> = (action$, { getState }) =>
  action$
    .ofType(uploadRecords.start().type)
    .mergeMap(({ payload: records }) => {
      return convertCsvToJson(records);
    })
    .mergeMap((finalRecords) => {
      const userId = getState().firebase.user.uid;

      const path = `${firebaseApp.dbPaths.invites(userId)}`;
      const ref = firebaseApp.app.database().ref(path);

      return ref
        .update(finalRecords)
        .then((records) => {
          return { type: 'FETCH_INVITATION_HERE', userId };
          // return uploadRecords.success(records);
        })
        .catch((err) => uploadRecords.fail(firebaseErrorMsg(err)));
    });

const convertCsvToJson = (records): Promise<{ [phone: string]: Invitation }> =>
  new Promise((resolve, reject) => {
    const reg = /^\d+$/;
    let finalRecords = {};

    csvToJson()
      .fromString(records)
      .on('json', (jsonInvite) => {
        const invite = jsonInvite as Invitation;
        if (
          invite.phone &&
          reg.test(invite.phone) &&
          invite.countryCode &&
          reg.test(invite.countryCode)
        ) {
          finalRecords[`${invite.countryCode}${invite.phone}`] = invite;
        }
      })
      .on('done', () => {
        return resolve(finalRecords as { [phone: string]: Invitation });
      });
  });

const deleteInviteEpic: Epic<YapAction<any>, State> = (action$, { getState }) =>
  action$.ofType(deleteInvite.start().type).mergeMap(() => {
    const userId = getState().firebase.user.uid;
    const inviteId = getState().invitationView.editingInviteId;
    if (!inviteId) {
      return Observable.of(deleteInvite.fail('Please Select Invite!'));
    }
    const path = `${firebaseApp.dbPaths.invites(userId)}/${inviteId}`;
    const ref = firebaseApp.app.database().ref(path);

    return ref
      .remove()
      .then((records) => {
        return { type: 'FETCH_INVITATION_HERE', userId };
      })
      .catch((err) => uploadRecords.fail(firebaseErrorMsg(err)));
  });

const toggleInviteEpic: Epic<YapAction<any>, State> = (action$, { getState }) =>
  action$.ofType(LOCATION_CHANGE).map(() => {
    return unselectAllSelected();
  });

export default combineEpics(uploadRecordsEpic, deleteInviteEpic, toggleInviteEpic);
