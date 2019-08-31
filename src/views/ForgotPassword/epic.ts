import { YapAction } from 'yapreact/utils/createAction';
import { Epic, combineEpics } from 'redux-observable';
import { Observable } from 'rxjs/Observable';
import { FirebaseError } from 'firebase';
import { sendOtpEmail } from './ducks';

import '@src/rxjs-imports';
import logger from '@src/lib/logger';
import { State } from '@src/ducks';
import { push } from 'react-router-redux';
import firebase from '@src/firebase';
import { makePopup, closePopup, showPopup } from '@src/components/Popup/ducks';
import { guid } from 'yapreact/utils';
import firebaseErrorMsg from '@src/lib/firebaseErrorMsg';

const sendOtpEmailEpic: Epic<YapAction<any>, State> = (action$, { getState }) =>
  action$
    .ofType(sendOtpEmail.start().type)
    .mergeMap(({ payload: { email } }) => {
      return firebase.app
        .auth()
        .sendPasswordResetEmail(email)
        .then(() => {
          const popupId = guid();
          const closePopupAction = closePopup({ id: popupId });
          const popup = makePopup({
            id: popupId,
            title: 'Email sent!',
            subtitle: 'Please check your inbox for resetting your password.',
            successButton: 'Log In',
            cancelButton: 'Cancel',
            successAction: [push('/login'), closePopupAction],
            cancelAction: closePopupAction,
            closeAction: closePopupAction
          });

          return [sendOtpEmail.success(), showPopup(popup)];
        })
        .catch((err: FirebaseError) => [sendOtpEmail.fail(firebaseErrorMsg(err))]);
    })
    .mergeMap((actions) => Observable.from(actions));

export default sendOtpEmailEpic;
