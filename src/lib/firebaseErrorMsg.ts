import { FirebaseError } from 'firebase';
import logger from './logger';

const log = logger('FirebaseErrorMsg');

export default (err: FirebaseError): string => {
  log(JSON.stringify(err, null, 2));

  switch (err.code) {
    case 'auth/wrong-password':
      return 'Incorrect Password';
    case 'auth/user-not-found':
      return 'There is no user with given email. Please Sign up.';
    default:
      return err.message;
  }
};
