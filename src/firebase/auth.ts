import { Observable } from 'rxjs/Observable';
import { app as firebase, FirebaseError } from 'firebase';
import logger from '@src/lib/logger';
import { login, User } from './ducks';
import { YapAction } from 'yapreact/utils/createAction';
import { Subscriber } from 'rxjs/Subscriber';

const log = logger('firebase:auth');

const fixFacebookPhotoUrl = (user: User): User => {
  if (!user.photoURL || !/facebook.com/.test(user.photoURL)) {
    return user;
  }

  if (/graph.facebook.com/.test(user.photoURL)) {
    return {
      ...user,
      photoURL: `${user.photoURL}?height=200`
    };
  }

  let newUser = user;
  try {
    const facebookId = user.photoURL.match(/asid=(\d*)/)[1];

    newUser = {
      ...user,
      photoURL: `https://graph.facebook.com/${facebookId}/picture?height=200`
    };
  } catch (err) {
    log('Error while trying to extract facebook id of url');
  }

  return newUser;
};

const makeAuth$ = (app: firebase.App): Observable<YapAction<User | void>> =>
  new Observable((observer: Subscriber<YapAction<User | null>>) => {
    app.auth().onAuthStateChanged(
      (fbUser) => {
        if (fbUser) {
          log('New user', fbUser);
          const user = fixFacebookPhotoUrl(fbUser.toJSON() as User);

          localStorage.setItem('isLoggedIn', '1');
          observer.next(login.success(user));
        } else {
          log('Firebase has no user');

          localStorage.removeItem('isLoggedIn');
          observer.next(login.fail());
        }
      },
      (err: FirebaseError) => {
        log('Auth error', err);
      }
    );

    return () => {
      // do nothing on completion
    };
  });

export default makeAuth$;
