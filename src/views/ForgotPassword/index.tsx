import * as React from 'react';
import { Switch, Route, Redirect, Link } from 'react-router-dom';
import ProtectedRoute from 'yapreact/components/ProtectedRoute';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Loader from '@src/components/Loader';
import OtpEmailForm from './OtpEmailForm';

import { State } from '@src/ducks';
import { sendOtpEmail, ForgotPasswordFormState } from '@src/views/ForgotPassword/ducks';

const logoImg = require('@src/images/logo.png');
const logoImgSvg = require('@src/images/logo.svg');

interface ForgotPasswordFormProps extends ForgotPasswordFormState {
  form: 'OtpEmailForm' | 'ResetPasswordForm';
}

interface ForgotPasswordFormCallbacks {
  sendOtpEmail: (values: any) => void;
}

const ForgotPasswordForm = (props: ForgotPasswordFormProps & ForgotPasswordFormCallbacks) => {
  const error = props.otpEmailSubmission.error;
  const isBusy = props.otpEmailSubmission.isBusy;

  return (
    <div className="left-section">
      <nav className="top">
        <div className="profile-block">
          <Link to="/signup">
            <FormattedMessage id="login.signupLink" />
          </Link>

          <Link to="/login">
            <FormattedMessage id="signup.loginLink" />
          </Link>
        </div>
      </nav>

      <div className="sign in">
        <div className="content">
          <div className="text-center">
            <object data={logoImgSvg} type="image/svg+xml">
              <img src={logoImg} />
            </object>
          </div>

          <h1 className="title main">
            <FormattedMessage id="forgotPassword.title" />
          </h1>
          <p className="tagline">
            <FormattedMessage id="forgotPassword.subtitle" />
          </p>

          <Loader isVisible={isBusy} />

          {error && <div className="error">{error}</div>}

          <OtpEmailForm onSubmit={props.sendOtpEmail} />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: State, params) => ({
  ...state.forgotPasswordForm
});

const mapDispatchToProps = (dispatch): ForgotPasswordFormCallbacks => ({
  sendOtpEmail: (values) => dispatch(sendOtpEmail.start(values))
});

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordForm);
