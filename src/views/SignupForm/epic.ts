import { YapAction } from 'yapreact/utils/createAction';
import { Epic, combineEpics } from 'redux-observable';
import { Observable } from 'rxjs/Observable';
import { FirebaseError } from 'firebase';

import { signup, updateDisplayName } from './ducks';
import logger from '@src/lib/logger';
import { State } from '@src/ducks';
import { emailLogin } from '@src/views/LoginForm/ducks';
import firebaseApp from '@src/firebase';
import firebaseErrorMsg from '@src/lib/firebaseErrorMsg';
import { locale } from '@src/config';
import { updateProfile } from '@src/views/Profile/ducks';

const log = logger('SignupEpic');

const signupEpic: Epic<YapAction<any>, State> = (action$) =>
  action$
    .ofType(signup.start().type)
    .mergeMap(({ payload: values }) => {
      return firebaseApp
        .createUserWithEmail(values.email, values.password)
        .then(() => [signup.success(values)])
        .catch((err: FirebaseError) => {
          return [signup.fail(firebaseErrorMsg(err))];
        });
    })
    .mergeMap((actions) => Observable.from(actions));

const updateNameEpic = (action$) =>
  action$.ofType(signup.success().type).mergeMap(({ payload: { displayName } }) => {
    const fbUser = firebaseApp.app.auth().currentUser;

    if (!fbUser) {
      log('No firebase user to update profile of. May be wait a little?');
      return Observable.of({ type: 'NO_OP' });
    }

    return fbUser
      .updateProfile({ displayName })
      .then(() => updateDisplayName.success())
      .catch((err: FirebaseError) => updateDisplayName.fail(firebaseErrorMsg(err)));
  });

const updateSignupUserTypeEpic: Epic<YapAction<any>, State> = (action$, { getState }) =>
  action$.ofType(signup.success().type).mergeMap(() => {
    const fbUser = firebaseApp.app.auth().currentUser;
    const signupBy = getState().form['SignupForm']
      ? getState().form['SignupForm'].values.signupBy
      : 'groom';

    if (!fbUser) {
      log('No firebase user to update profile of. May be wait a little?');
      return Observable.of({ type: 'NO_OP' });
    }

    const refPath = `${firebaseApp.dbPaths.profile(fbUser.uid)}`;
    const ref = firebaseApp.app.database().ref(refPath);

    return ref
      .update({
        locale: locale.name,
        signupBy
      })
      .then(() => updateProfile.success())
      .catch((err: FirebaseError) => updateProfile.fail(firebaseErrorMsg(err)));
  });

export default combineEpics(signupEpic, updateNameEpic, updateSignupUserTypeEpic);
