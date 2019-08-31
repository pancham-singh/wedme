import * as React from 'react';
import { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import {
  reduxForm,
  Field,
  FormProps,
  FormSubmitProp,
  FormErrors,
  InjectedFormProps
} from 'redux-form';
import { connect } from 'react-redux';
import InputField from 'yapreact/components/Field/Input';
import SignupByField from '@src/components/SignupByField';

import { facebookLogin } from '@src/views/LoginForm/ducks';
import { signup, SignupFormState } from './ducks';
import { State } from '@src/ducks';
import { DuckStateNode } from 'yapreact/utils/createDuck';
import Loader from '@src/components/Loader';
import { locale } from '@src/config';

const logoImg = require('@src/images/logo.png');
const logoImgSvg = require('@src/images/logo.svg');
const profileImg = require('@src/images/profile-image.png');
const wedmeImg = require('@src/images/wedme.png');
const wedmeImgSvg = require('@src/images/wedme.svg');

const translations = require(`@src/translations`);
const errorMessages = translations[locale.name].errors;

interface SignupFormData {
  password: string;
  displayName: string;
  confirmPassword: string;
  email: string;
  signupBy: 'bride' | 'groom';
}

interface SignupFormProps extends InjectedFormProps<SignupFormData, {}>, SignupFormState {
  fbSubmission: DuckStateNode<null>;
}

interface SignupFormCallbacks {
  startFbLogin: (e: any) => void;
  onSubmit: (values: SignupFormData) => void;
}

const validate = (values: SignupFormData): FormErrors<SignupFormData> => {
  const errors: FormErrors<SignupFormData> = {};

  if (!values.email || !values.email.trim()) {
    errors.email = errorMessages.requiredEmail;
  }

  if (!values.password || values.password.length < 6) {
    errors.password = errorMessages.weakPassword;
  }

  if (!values.displayName) {
    errors.displayName = errorMessages.displayName;
  }

  if (values.password && values.confirmPassword && values.password !== values.confirmPassword) {
    errors.confirmPassword = errorMessages.invalidConfirmPassword;
  }

  return errors;
};

@reduxForm({
  form: 'SignupForm',
  validate
})
class SignupForm extends Component<SignupFormProps & SignupFormCallbacks> {
  render() {
    const { submission, fbSubmission } = this.props;
    const error = submission.error || fbSubmission.error;
    const isBusy = submission.isBusy || fbSubmission.isBusy;

    return (
      <div className="left-section">
        <Loader isVisible={isBusy} />

        <nav className="top">
          <div className="profile-block">
            <Link to="/login">
              <FormattedMessage id="signup.loginLink" />
            </Link>
            <label>
              <FormattedMessage id="signup.loginGreet" />
            </label>
          </div>
        </nav>

        <div className="sign in up">
          <div className="content">
            <div className="text-center">
              <object data={logoImgSvg} type="image/svg+xml">
                <img src={logoImg} />
              </object>
            </div>

            <h1 className="title main">
              <FormattedMessage id="signup.title" />
            </h1>
            <p className="tagline">
              <FormattedMessage id="signup.subtitle" />
            </p>

            {error && <div className="error">{error}</div>}

            <div className="form-container">
              <button onClick={this.props.startFbLogin} className="btn facebook signup-facebook">
                <FormattedMessage id="signup.facebookButton" />
              </button>

              <form onSubmit={this.props.handleSubmit}>
                <label>
                  <FormattedMessage id="form.label.email" />
                </label>
                <Field
                  component={InputField}
                  label={null}
                  name="email"
                  type="email"
                  wrapperClassName="input-group"
                  inputClassName="input-control"
                  errorClassName="msg"
                />

                <label>
                  <FormattedMessage id="form.label.displayName" />
                </label>
                <Field
                  component={InputField}
                  label={null}
                  name="displayName"
                  type="text"
                  wrapperClassName="input-group"
                  inputClassName="input-control"
                  errorClassName="msg"
                />
                <label>
                  <FormattedMessage id="form.label.password" />
                </label>
                <Field
                  component={InputField}
                  label={null}
                  name="password"
                  type="password"
                  wrapperClassName="input-group"
                  inputClassName="input-control"
                  errorClassName="msg"
                />

                <Field name="signupBy" component={SignupByField} />

                <div className="text-center">
                  <button className="btn primary signup">
                    <FormattedMessage id="signup.submitButton" />
                  </button>
                </div>
              </form>

              <div className="terms-and-privacy-link">
                <FormattedMessage id="signup.tosandprivacy" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ signupForm, loginForm }: State) => ({
  ...signupForm,
  fbSubmission: loginForm.fbSubmission,
  initialValues: {
    signupBy: 'groom'
  }
});
const mapDispatchToProps = (dispatch): SignupFormCallbacks => ({
  onSubmit: (values) => dispatch(signup.start(values)),
  startFbLogin: (e) => {
    e.preventDefault();

    return dispatch(facebookLogin.start());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SignupForm);
