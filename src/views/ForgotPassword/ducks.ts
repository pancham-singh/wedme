import { createDuck, createReducer } from 'yapreact/utils';
import { DuckStateNode } from 'yapreact/utils/createDuck';
import { LOCATION_CHANGE } from 'react-router-redux';

export interface ForgotPasswordFormState {
  otpEmailSubmission: DuckStateNode<null>;
}

const otpEmailDuck = createDuck('SEND_PASSWORD_RESET_OTP_EMAIL', null);

const initialState = {};
const ducks = {
  otpEmailSubmission: otpEmailDuck
};

export const sendOtpEmail = otpEmailDuck.actions;

export default createReducer(
  {
    [LOCATION_CHANGE]: (state) => ({
      ...initialState,
      otpEmailSubmission: otpEmailDuck.initialState
    })
  },
  { initialState, ducks }
);
