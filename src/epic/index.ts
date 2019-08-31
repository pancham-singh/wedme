import { combineEpics } from 'redux-observable';

import '@src/rxjs-imports';
import signupFormEpic from '@src/views/SignupForm/epic';
import loginFormEpic from '@src/views/LoginForm/epic';
import forgotPasswordEpic from '@src/views/ForgotPassword/epic';
import firebaseEpic from '@src/firebase/epic';
import profileFormEpic from '@src/views/Profile/epic';
import compareViewEpic from '@src/views/Compare/epic';
import compareDrawerEpic from '@src/views/CompareDrawer/epic';
import budgetViewEpic from '@src/views/Budget/epic';
import budgetDrawerEpic from '@src/views/BudgetDrawer/epic';
import invitationEpic from '@src/views/Invitation/epic';
import sendSmsEpic from '@src/views/Invitation/SendSms/epic';
import deleteGiftEpic from '@src/views/Gift/epic';
import saveGiftEpic from '@src/views/GiftDrawer/epic';
import saveInviteEpic from '@src/views/InviteDrawer/epic';
import saveShuttleEpic from '@src/views/ShuttleDrawer/epic';

export default combineEpics(
  firebaseEpic,
  signupFormEpic,
  loginFormEpic,
  forgotPasswordEpic,
  profileFormEpic,
  compareViewEpic,
  compareDrawerEpic,
  budgetViewEpic,
  budgetDrawerEpic,
  invitationEpic,
  sendSmsEpic,
  deleteGiftEpic,
  saveGiftEpic,
  saveInviteEpic,
  saveShuttleEpic
);
