import { firebase as fbConfig } from '../config';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';
import { YapAction } from 'yapreact/utils/createAction';
import logger from '@src/lib/logger';
import makeAuth$ from '@src/firebase/auth';
import { firebase as config } from '@src/config';
import { User } from 'firebase';

interface FirebaseConfig {
  name?: string;
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
}

const log = logger('firebase');

class Firebase {
  app: firebase.app.App;
  dbPaths = {
    profile: (userId: string) => `/users/${userId}`,
    categories: () => `/categories`,
    additionalExpenses: (userId: string) => `/additionalExpenses/${userId}`,
    vendors: (userId: string) => `/vendors/${userId}`,
    invites: (userId: string) => `/invites/${userId}`,
    gifts: (userId: string) => `/gifts/${userId}`,
    shuttles: (userId: string) => `/shuttles/${userId}`
  };

  constructor(config: FirebaseConfig) {
    log('Creating new firebase app');

    this.app = firebase.initializeApp(config, config.name || 'FirebaseApp');
    this.app.auth().useDeviceLanguage();
  }

  createUserWithEmail(email: string, password: string): Promise<void> {
    return this.app.auth().createUserAndRetrieveDataWithEmailAndPassword(email, password);
  }

  facebookLogin(): Promise<void> {
    const provider = new firebase.auth.FacebookAuthProvider();

    return this.app.auth().signInWithPopup(provider);
  }

  makeDbRef$(path: string, event = 'value'): Observable<Object> {
    return new Observable((observer) => {
      const listener = (snap) => {
        const data = snap.toJSON();

        log(`Firebase ${path} > ${event} : `, data);
        observer.next(data);
      };

      const ref = this.app.database().ref(path);
      ref.on(event, listener);

      return () => {
        ref.off(event, listener);
      };
    });
  }

  get auth$() {
    return makeAuth$(this.app);
  }
}

const firebaseApp = new Firebase(config);

export default firebaseApp;
