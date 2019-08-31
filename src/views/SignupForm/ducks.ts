import { createDuck, createReducer } from 'yapreact/utils';
import { DuckStateNode } from 'yapreact/utils/createDuck';
import { LOCATION_CHANGE } from 'react-router-redux';

export interface SignupFormState {
  submission: DuckStateNode<null>;
}

const signupDuck = createDuck('EMAIL_SIGNUP', null);
const updateDisplayNameDuck = createDuck('UPDATE_DISPLAY_NAME', null);

const initialState = {};
const ducks = {
  submission: signupDuck,
  updateDisplayName: updateDisplayNameDuck
};

export const signup = signupDuck.actions;
export const updateDisplayName = updateDisplayNameDuck.actions;

export default createReducer(
  {
    [LOCATION_CHANGE]: (state) => ({
      ...initialState,
      submission: signupDuck.initialState
    })
  },
  { initialState, ducks }
);
