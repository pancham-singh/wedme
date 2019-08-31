import { YapAction } from 'yapreact/utils/createAction';
import { Epic, combineEpics } from 'redux-observable';
import { Observable } from 'rxjs/Observable';
import { FirebaseError } from 'firebase';
import firebase from '@src/firebase';

import { emailLogin, facebookLogin } from './ducks';
import logger from '@src/lib/logger';
import { State } from '@src/ducks';
import { login } from '@src/firebase/ducks';
import firebaseErrorMsg from '@src/lib/firebaseErrorMsg';

const log = logger('LoginEpic');

const emailLoginEpic: Epic<YapAction<any>, State> = (action$) =>
  action$
    .ofType(emailLogin.start().type)
    .mergeMap(({ payload: values }) => {
      return firebase.app
        .auth()
        .signInWithEmailAndPassword(values.email, values.password)
        .then(() => [emailLogin.success()])
        .catch((err: FirebaseError) => {
          return [emailLogin.fail(firebaseErrorMsg(err)), login.fail(firebaseErrorMsg(err))];
        });
    })
    .mergeMap((actions) => Observable.from(actions));

const facebookLoginEpic: Epic<YapAction<any>, State> = (action$, { getState }) =>
  action$.ofType(facebookLogin.start().type).mergeMap(() => {
    return firebase
      .facebookLogin()
      .then(facebookLogin.success)
      .catch((err: FirebaseError) => {
        return facebookLogin.fail(firebaseErrorMsg(err));
      });
  });

export default combineEpics(emailLoginEpic, facebookLoginEpic);
