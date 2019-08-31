import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer, FormReducer } from 'redux-form';
import { createReducer, createDuck, createAction } from 'yapreact/utils';

import signupForm, { SignupFormState } from './views/SignupForm/ducks';

import loginForm, { LoginFormState } from './views/LoginForm/ducks';
import forgotPasswordForm, { ForgotPasswordFormState } from '@src/views/ForgotPassword/ducks';
import { User } from '@src/firebase/ducks';
import firebase, { FirebaseState } from '@src/firebase/ducks';
import popups, { PopupState } from '@src/components/Popup/ducks';
import profileForm, { ProfileFormState } from '@src/views/Profile/ducks';
import compareView, { CompareViewState } from '@src/views/Compare/ducks';
import budgetView, { BudgetViewState } from '@src/views/Budget/ducks';
import compareDrawer, { CompareDrawerState } from '@src/views/CompareDrawer/ducks';
import budgetDrawer, { BudgetDrawerState } from '@src/views/BudgetDrawer/ducks';
import invitationView, { InvitationViewState } from '@src/views/Invitation/ducks';
import giftView, { GiftViewState } from '@src/views/Gift/ducks';
import giftDrawer, { GiftDrawerState } from '@src/views/GiftDrawer/ducks';
import sendSmsView, { SendSmsViewState } from '@src/views/Invitation/SendSms/ducks';
import inviteDrawer, { InviteDrawerState } from '@src/views/InviteDrawer/ducks';
import shuttleDrawer, { ShuttleDrawerState } from '@src/views/ShuttleDrawer/ducks';

const ducks = {};

export const isLoggedIn = (state: State): boolean =>
  Boolean(state.firebase.user && state.firebase.user.uid) ||
  Boolean(localStorage.getItem('isLoggedIn') !== null);

export interface State {
  signupForm: SignupFormState;
  loginForm: LoginFormState;
  forgotPasswordForm: ForgotPasswordFormState;
  firebase: FirebaseState;
  popups: PopupState;
  profileForm: ProfileFormState;
  compareView: CompareViewState;
  compareDrawer: CompareDrawerState;
  budgetView: BudgetViewState;
  budgetDrawer: BudgetDrawerState;
  invitationView: InvitationViewState;
  sendSmsView: SendSmsViewState;
  giftView: GiftViewState;
  giftDrawer: GiftDrawerState;
  inviteDrawer: InviteDrawerState;
  form: FormReducer;
  shuttleDrawer: ShuttleDrawerState;
}

const initialAuthState = {};

export default combineReducers({
  firebase,
  routing: routerReducer,
  form: formReducer,
  signupForm,
  loginForm,
  forgotPasswordForm,
  popups,
  profileForm,
  compareView,
  compareDrawer,
  budgetView,
  budgetDrawer,
  invitationView,
  sendSmsView,
  giftView,
  giftDrawer,
  inviteDrawer,
  shuttleDrawer
});
