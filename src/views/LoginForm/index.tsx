import * as React from 'react';
import { Component } from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import {
  reduxForm,
  Field,
  FormProps,
  FormSubmitProp,
  FormErrors,
  InjectedFormProps
} from 'redux-form';
import { validateEmail } from 'yapreact/utils';
import { connect } from 'react-redux';
import InputField from 'yapreact/components/Field/Input';
import { LoginFormState, emailLogin, facebookLogin } from './ducks';
import { State } from '@src/ducks';
import Loader from '@src/components/Loader';
import { locale } from '@src/config';

const logoImg = require('@src/images/logo.png');
const logoImgSvg = require('@src/images/logo.svg');
const profileImg = require('@src/images/profile-image.png');
const wedmeImg = require('@src/images/wedme.png');
const wedmeImgSvg = require('@src/images/wedme.svg');

const translations = require(`@src/translations`);
const errorMessages = translations[locale.name].errors;

interface LoginFormData {
  password: string;
  confirmPassword: string;
  email: string;
}

interface LoginFormCallbacks {
  startFbLogin: () => void;
  onSubmit: (values: LoginFormData) => void;
}

interface LoginFormProps extends InjectedFormProps<LoginFormData, {}>, LoginFormState {}

const validate = (values: LoginFormData): FormErrors<LoginFormData> => {
  const errors: FormErrors<LoginFormData> = {};

  if (!values.email) {
    errors.email = errorMessages.requiredEmail;
  }

  if (values.email && !validateEmail(values.email)) {
    errors.email = errorMessages.invalidEmail;
  }

  if (!values.password) {
    errors.password = errorMessages.requiredPassword;
  }

  return errors;
};

@reduxForm({
  form: 'LoginForm',
  validate
})
class LoginForm extends Component<LoginFormProps & LoginFormCallbacks> {
  componentWillMount() {}
  render() {
    const { submission, fbSubmission } = this.props;
    const error = submission.error || fbSubmission.error;
    const isBusy = submission.isBusy || fbSubmission.isBusy;

    return (
      <div className="left-section">
        <nav className="top">
          <div className="profile-block">
            <Link to="/signup">
              <FormattedMessage id="login.signupLink" />
            </Link>
            <label>
              <FormattedMessage id="login.signupGreet" />
            </label>
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
              <FormattedMessage id="login.title" />
            </h1>
            <p className="tagline">
              <FormattedMessage id="login.subtitle" />
            </p>

            {error && <div className="error">{error}</div>}

            <div className="form-container">
              <button onClick={this.props.startFbLogin} className="btn facebook">
                <FormattedMessage id="login.facebookButton" />
              </button>

              <form onSubmit={this.props.handleSubmit}>
                <Loader isVisible={isBusy} />

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

                <div className="input-group forgot-password-container">
                  <Link to="/login/forgot-password" className="txt-link forgot-password">
                    <FormattedMessage id="login.forgotPassword" />
                  </Link>
                </div>

                <div className="text-center">
                  <button className="btn primary login">
                    <FormattedMessage id="login.submitButton" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ loginForm }: State) => ({ ...loginForm });
const mapDispatchToProps = (dispatch): LoginFormCallbacks => ({
  onSubmit: (values) => dispatch(emailLogin.start(values)),
  startFbLogin: () => dispatch(facebookLogin.start())
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
