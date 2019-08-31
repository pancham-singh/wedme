import '@src/rxjs-imports';
import * as firebase from 'firebase';
import {
  updateProfile,
  changePassword,
  uploadProfilePic,
  actuallySaveProfile,
  clearPasswordForm,
  togglePassword,
  selectWelcomeOption
} from '@src/views/Profile/ducks';
import { isNil } from 'ramda';
import { Observable } from 'rxjs/Observable';
import { Epic, combineEpics } from 'redux-observable';
import { State } from '@src/ducks';
import { YapAction } from 'yapreact/utils/createAction';
import { ProfileFormData } from './index';
import { parse } from 'fecha';
import { UserProfile } from '@src/firebase/ducks';
import firebaseApp from '@src/firebase';
import { FirebaseError } from 'firebase';
import logger from '@src/lib/logger';
import { showPopup, closePopup } from '@src/components/Popup/ducks';
import firebaseErrorMsg from '@src/lib/firebaseErrorMsg';

const log = logger('updateProfileEpic');

const actuallyUpdateProfileEpic: Epic<YapAction<any>, State> = (action$, { getState }) =>
  action$
    .ofType(updateProfile.start().type)
    .debounceTime(800)
    .map(({ payload }) => actuallySaveProfile(payload));

const updateProfileEpic: Epic<YapAction<any>, State> = (action$, { getState }) =>
  action$
    .ofType(actuallySaveProfile().type)
    .map(({ payload: values }: YapAction<ProfileFormData>) => {
      const profile = getState().firebase.profile;

      const profileUpdate: Partial<UserProfile> = {
        ...profile
      };

      profileUpdate.event = { ...(profileUpdate.event || {}) };

      if (!isNil(values.eventDate)) {
        profileUpdate.event.date = values.eventDate.getTime();
      }

      if (!isNil(values.brideName)) {
        profileUpdate.event.brideName = values.brideName;
      }

      if (!isNil(values.groomName)) {
        profileUpdate.event.groomName = values.groomName;
      }

      if (!isNil(values.location)) {
        profileUpdate.event.location = profileUpdate.event.location || {
          address: '',
          coordinates: { latitude: 0, longitude: 0 }
        };
        profileUpdate.event.location.address = values.location;
      }

      if (!isNil(values.phoneNumber) && values.phoneNumber !== profile.phone) {
        profileUpdate.phone = values.phoneNumber;
        profileUpdate.countryCode = values.countryCode;
      }

      return profileUpdate;
    })
    .mergeMap((profileUpdate) => {
      const userId = getState().firebase.user.uid;

      const ref = firebaseApp.app.database().ref(firebaseApp.dbPaths.profile(userId));

      return ref
        .update(profileUpdate)
        .then((res) => updateProfile.success(res))
        .catch((err: FirebaseError) => {
          return updateProfile.fail(firebaseErrorMsg(err));
        });
    });

const changePasswordEpic: Epic<YapAction<any>, State> = (action$, { getState }) =>
  action$
    .ofType(changePassword.start().type)
    .mergeMap(() => {
      const state = getState();
      const user = state.firebase.user;

      const credential = firebase.auth.EmailAuthProvider.credential(
        user.email,
        state.profileForm.oldPassword
      );

      return firebaseApp.app
        .auth()
        .currentUser.reauthenticateWithCredential(credential)
        .catch((err: FirebaseError) => changePassword.fail(firebaseErrorMsg(err)));
    })
    .mergeMap((action) => {
      if (action && action.type) {
        return Observable.of([action]);
      }

      const newPassword = getState().profileForm.newPassword;
      const confirmPassword = getState().profileForm.confirmPassword;

      if (newPassword.trim() === '') {
        return Observable.of([changePassword.fail('Please enter password!')]);
      }

      if (newPassword !== confirmPassword) {
        return Observable.of([changePassword.fail('Password did not match!')]);
      }

      const popupId = String(new Date().getTime());

      return firebaseApp.app
        .auth()
        .currentUser.updatePassword(newPassword)
        .then(() => [
          changePassword.success(),
          showPopup({
            id: popupId,
            title: 'Password Change',
            subtitle: 'Password changed successfully',
            successButton: 'Ok',
            successAction: [
              clearPasswordForm(),
              togglePassword.start(),
              closePopup({ id: popupId })
            ],
            cancelButton: 'Cancel',
            cancelAction: [
              clearPasswordForm(),
              togglePassword.start(),
              closePopup({ id: popupId })
            ],
            closeAction: [clearPasswordForm(), togglePassword.start(), closePopup({ id: popupId })]
          })
        ])
        .catch((err: FirebaseError) => [changePassword.fail(firebaseErrorMsg(err))]);
    })
    .mergeMap((xs) => Observable.from(xs));

const uploadProfilePicEpic: Epic<YapAction<any>, State> = (action$, { getState }) =>
  action$
    .ofType(uploadProfilePic.start().type)
    .mergeMap(({ payload: file }) => {
      const userId = getState().firebase.user.uid;

      let ext = file.name.split('.').pop();
      ext = ext.toLowerCase();
      const storageRef = firebaseApp.app.storage().ref(`/images/${userId}.${ext}`);

      return storageRef
        .put(file)
        .then((snapshot) => {
          return snapshot.downloadURL;
        })
        .catch((err: FirebaseError) => err);
    })
    .mergeMap((url) => {
      if (typeof url !== 'string') {
        return Observable.of(uploadProfilePic.fail(url.message));
      }

      return firebaseApp.app
        .auth()
        .currentUser.updateProfile({ photoURL: url })
        .then(() => uploadProfilePic.success(url))
        .catch((err: FirebaseError) => uploadProfilePic.fail(firebaseErrorMsg(err)));
    });

const welcomePopupEpic = (action$, { getState }) =>
  action$.ofType(selectWelcomeOption.start().type).mergeMap(({ payload: choice }) => {
    const userId = getState().firebase.user.uid;

    const ref = firebaseApp.app.database().ref(firebaseApp.dbPaths.profile(userId));

    return ref
      .update({
        planningStatusOnSignup: choice
      })
      .then((res) => selectWelcomeOption.success())
      .catch((err: FirebaseError) => {
        return selectWelcomeOption.fail(firebaseErrorMsg(err));
      });
  });

export default combineEpics(
  updateProfileEpic,
  changePasswordEpic,
  uploadProfilePicEpic,
  actuallyUpdateProfileEpic,
  welcomePopupEpic
);
