import { createDuck, createReducer } from 'yapreact/utils';
import { DuckStateNode } from 'yapreact/utils/createDuck';
import { routerActions, LOCATION_CHANGE } from 'react-router-redux';

export interface LoginFormState {
  submission: DuckStateNode<null>;
  fbSubmission: DuckStateNode<null>;
}

const emailLoginDuck = createDuck('EMAIL_LOGIN', null);
const facebookDuck = createDuck('FACEBOOK_LOGIN', null);

const initialState = {};
const ducks = {
  submission: emailLoginDuck,
  fbSubmission: facebookDuck
};

export const emailLogin = emailLoginDuck.actions;
export const facebookLogin = facebookDuck.actions;

export default createReducer(
  {
    [LOCATION_CHANGE]: (state) => ({
      ...initialState,
      submission: emailLoginDuck.initialState,
      fbSubmission: facebookDuck.initialState
    })
  },
  { initialState, ducks }
);
