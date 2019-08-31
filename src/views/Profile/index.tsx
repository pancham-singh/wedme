import * as React from 'react';
import * as classnames from 'classnames';
import { pathOr } from 'ramda';
import { Component } from 'react';
import { connect } from 'react-redux';
import { State } from '@src/ducks';
import { format, parse } from 'fecha';
import InputField from 'yapreact/components/Field/Input';
import SelectField from 'yapreact/components/Field/Select';
import DayPickerField from 'yapreact/components/Field/DayPicker';
import { FormattedMessage } from 'react-intl';
import Loader from '@src/components/Loader';
import WelcomePopup from '@src/components/WelcomePopup';
import { locale } from '@src/config';

const translations = require(`@src/translations`);
const errorMessages = translations[locale.name].errors;
const placeholders = translations[locale.name].placeholders;
const maxSmsAvailable = 1000;

import './styles.scss';
import {
  reduxForm,
  Field,
  FormProps,
  FormSubmitProp,
  FormErrors,
  InjectedFormProps
} from 'redux-form';
import { User, UserProfile, AuthState } from '@src/firebase/ducks';
import { logout } from '@src/firebase/ducks';
import {
  updateProfile,
  togglePassword,
  uploadProfilePic,
  ProfileFormState,
  changePassword,
  newPasswordValueChange,
  confirmPasswordValueChange,
  oldPasswordValueChange,
  clearPasswordForm,
  toggleServicePacksPopup,
  selectWelcomeOption
} from '@src/views/Profile/ducks';
import { DuckStateNode } from 'yapreact/utils/createDuck';
import ServicePacksPopup from '@src/components/ServicePacksPopup';
// import { locale } from '@src/config';

const profileImg = require('@src/images/profile-image.png');
const brideImg = require('@src/images/bride-to-be.png');
const sentSmsImg = require('@src/images/ic-sent-sms.png');
const sentSmsImgSvg = require('@src/images/ic-sent-sms.svg');

export interface ProfileFormData {
  brideName: string;
  groomName: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  eventDate: Date;
  location: string;
}

interface ProfileProps extends InjectedFormProps, ProfileFormState {
  user: User;
  profile: UserProfile;
  auth: AuthState;
  profileFetchStatus: DuckStateNode<null>;
  signupBy: 'bride' | 'groom' | 'other';
}

interface ProfileCallbacks {
  logout: () => void;
  updateProfile: (data: ProfileFormData) => void;
  togglePassword: () => void;
  uploadProfilePic: (file) => void;
  newPasswordValue: (newPassword) => void;
  oldPasswordValue: (oldPassword) => void;
  confirmPasswordValue: (confirmfPassword) => void;
  startChangePassword: () => void;
  resetPasswordForm: () => void;
  toggleServicePacksPopup: () => void;
  selectWelcomeOption: (option: string) => void;
}

const validate = (values: ProfileFormData) => {
  const errors: FormErrors<ProfileFormData> = {};

  if (values.phoneNumber && String(values.phoneNumber).length < 8) {
    errors.phoneNumber = errorMessages.invalidPhone;
  }

  return errors;
};

@reduxForm({
  form: 'ProfileForm',
  enableReinitialize: true,
  validate
})
class ProfileForm extends Component<ProfileCallbacks & ProfileProps> {
  fileInputRef = null;

  render() {
    const {
      logout,
      user,
      newPasswordValue,
      oldPasswordValue,
      confirmPasswordValue,
      uploadProfilePic,
      togglePassword,
      initialValues,
      handleSubmit,
      updateProfile,
      updateStatus,
      isUpdatingProfile,
      showChangePassword,
      changePasswordStatus,
      profileFetchStatus,
      signupBy
    } = this.props;

    const isBusy =
      profileFetchStatus.isBusy ||
      changePasswordStatus.isBusy ||
      this.props.uploadProfilePicStatus.isBusy ||
      this.props.welcomePopupStatus.isBusy;
    const inlineIsBusy = isUpdatingProfile;
    const inlineError = updateStatus.error;

    const canChangePassword = Boolean(
      user.providerData && user.providerData.filter((p) => p.providerId === 'password').length
    );

    return (
      <section id="profile">
        <Loader isVisible={isBusy} />

        {!this.props.auth.login.isBusy &&
          !profileFetchStatus.isBusy &&
          !this.props.profile.planningStatusOnSignup && (
            <WelcomePopup onSelect={this.props.selectWelcomeOption} />
          )}

        <ServicePacksPopup
          {...this.props.servicePacksPopup}
          onClose={this.props.toggleServicePacksPopup}
        />

        <h1 className="title main">
          <FormattedMessage id="profile.title" />
        </h1>

        <div className="profile-block">
          <div
            className="profile-image"
            onClick={() => this.fileInputRef && this.fileInputRef.click()}
          >
            <img src={user.photoURL ? user.photoURL : profileImg} alt="profile image" />
            <div className="change-image-input">
              <input
                type="file"
                ref={(ref) => (this.fileInputRef = ref)}
                onChange={(event) => uploadProfilePic(event.target.files[0])}
                className="profile-pic-change"
                title={placeholders.profileChangePic}
              />
            </div>
          </div>
          <br />
          <span className="meant-to-be">
            <img src={brideImg} />
          </span>
        </div>

        <div className="profile">
          <div className="profile-column sms-block">
            <div className="content">
              <label className="package">
                <FormattedMessage id="profile.sms_package" values={{ maxSmsAvailable }} />
              </label>

              <div className="text-center">
                <object data={sentSmsImgSvg} type="image/svg+xml">
                  <img src={sentSmsImg} />
                </object>

                <h2 className="title main">
                  {pathOr(maxSmsAvailable, ['sms', 'available'], this.props.profile)}
                </h2>
                <label className="title sub">
                  <FormattedMessage id="profile.sms_remainig" />
                </label>

                <p className="note">
                  <FormattedMessage id="profile.sms_note" />
                </p>
                <div className="primary">
                  <FormattedMessage id="profile.smsTopupFromMobileMsg" />
                </div>
              </div>
            </div>
          </div>

          <div className="profile-column tab-section-profile">
            <div className="content">
              <form onChange={() => setTimeout(handleSubmit(updateProfile))}>
                <div className="tab-heading">
                  <span className={classnames('tab one', { active: signupBy === 'bride' })}>
                    <Field
                      component={InputField}
                      name="brideName"
                      placeholder={placeholders.profileBrideName}
                      label={null}
                      wrapperClassName=""
                      inputClassName={classnames('btn-input', {
                        outline: signupBy !== 'bride',
                        primary: signupBy === 'bride'
                      })}
                    />
                  </span>
                  <span className={classnames('tab two', { active: signupBy === 'groom' })}>
                    <Field
                      component={InputField}
                      name="groomName"
                      placeholder={placeholders.profileGroomName}
                      label={null}
                      wrapperClassName=""
                      inputClassName={classnames('btn-input', {
                        outline: signupBy !== 'groom',
                        primary: signupBy === 'groom'
                      })}
                    />
                  </span>
                </div>

                <div className="form-shadow">
                  <div className="input-group">
                    <input
                      readOnly
                      type="email"
                      className="input-control outline email"
                      placeholder={placeholders.profileEmail}
                      value={user.email || ''}
                    />
                  </div>

                  <div
                    className={classnames('change-password-group', {
                      'is-expanded': showChangePassword,
                      'not-displayed': !canChangePassword,
                      disabled: changePasswordStatus.isBusy,
                      'has-error': changePasswordStatus.error
                    })}
                  >
                    <div className="input-group">
                      <input
                        name="oldPassword"
                        value={this.props.oldPassword}
                        onChange={(event) => {
                          event.stopPropagation();
                          oldPasswordValue(event.target.value);
                        }}
                        type="password"
                        className="input-control outline pass"
                        readOnly={!showChangePassword}
                        placeholder={
                          showChangePassword ? placeholders.profileEnterPassword : '*****'
                        }
                      />

                      <a className="change-password" onClick={togglePassword}>
                        <FormattedMessage id="profile.changePassword" />
                      </a>
                    </div>

                    <div className="input-group">
                      <input
                        name="newPassword"
                        disabled={!showChangePassword}
                        value={this.props.newPassword}
                        onChange={(event) => {
                          event.stopPropagation();
                          newPasswordValue(event.target.value);
                        }}
                        type="password"
                        className="input-control outline pass"
                        placeholder={placeholders.profileNewPassword}
                      />
                    </div>
                    <div className="input-group">
                      <input
                        name="confirmPassword"
                        disabled={!showChangePassword}
                        value={this.props.confirmPassword}
                        onChange={(event) => {
                          event.stopPropagation();
                          confirmPasswordValue(event.target.value);
                        }}
                        placeholder={placeholders.profileConfirmPassword}
                        type="password"
                        className="input-control outline pass"
                      />
                    </div>

                    {changePasswordStatus.error && (
                      <div className="form-error">{changePasswordStatus.error}</div>
                    )}

                    <div className="input-group">
                      <button
                        className="btn outline"
                        disabled={!showChangePassword}
                        type="button"
                        onClick={() => {
                          this.props.resetPasswordForm();
                          togglePassword();
                        }}
                      >
                        <FormattedMessage id="profile.cancelPasswordButton" />
                      </button>
                      <button
                        className="btn primary"
                        disabled={!showChangePassword}
                        type="button"
                        onClick={() => this.props.startChangePassword()}
                      >
                        <FormattedMessage id="profile.changePasswordButton" />
                      </button>
                    </div>
                  </div>

                  <div className="input-group two-elem">
                    <Field
                      component={SelectField}
                      name="countryCode"
                      label={null}
                      wrapperClassName="two-elem-first-child"
                      inputClassName="input-control outline"
                      defaultValue="972"
                    >
                      <option value="972">+972</option>
                    </Field>

                    <Field
                      component={InputField}
                      name="phoneNumber"
                      placeholder={placeholders.profilePhoneNumber}
                      pattern={/^\d{1,9}$/}
                      label={null}
                      wrapperClassName="two-elem-second-child"
                      inputClassName="input-control outline phone"
                      errorClassName="msg msg-phone"
                    />
                  </div>

                  <Field
                    component={DayPickerField}
                    onChange={() => setTimeout(handleSubmit(updateProfile))}
                    name="eventDate"
                    placeholder={placeholders.profileEventDate}
                    type="text"
                    label={null}
                    wrapperClassName="input-group"
                    inputClassName="DayPickerInput input-control outline date"
                    dayPickerProps={{
                      format: 'DD/MM/YY',
                      inputProps: { readOnly: true },
                      formatDate: (date, dateFormat) => {
                        return format(date, dateFormat);
                      },
                      parseDate: (date: string, format: string) => {
                        return parse(date, 'DD/MM/YY');
                      }
                    }}
                  />

                  <Field
                    component={InputField}
                    name="location"
                    placeholder={placeholders.profilePlace}
                    type="text"
                    label={null}
                    wrapperClassName="input-group"
                    inputClassName="input-control outline location"
                  />
                </div>

                {inlineIsBusy && (
                  <div className="inline-isbusy">
                    <FormattedMessage id="profile.savingStatusMsg" />
                  </div>
                )}
                {inlineError && <div className="inline-error">{inlineError}</div>}
              </form>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

const mapStateToProps = ({
  firebase: { auth, user, profile, ui },
  profileForm
}: State): Partial<ProfileProps> => ({
  user,
  ...profileForm,
  profileFetchStatus: ui.profile,
  signupBy: profile.signupBy || 'groom',
  auth,
  profile,
  initialValues: {
    phoneNumber: profile.phone || '',
    countryCode: profile.countryCode || '972',
    brideName: (profile.event && profile.event.brideName) || '',
    groomName: (profile.event && profile.event.groomName) || '',
    eventDate: profile.event && profile.event.date ? new Date(profile.event.date) : null,
    location: profile.event && profile.event.location ? profile.event.location.address : ''
  }
});

const mapDispatchToProps = (dispatch): ProfileCallbacks => ({
  logout: () => dispatch(logout.start()),
  togglePassword: () => {
    dispatch(togglePassword.start());
    dispatch(clearPasswordForm());
  },
  oldPasswordValue: (oldPassword) => dispatch(oldPasswordValueChange(oldPassword)),
  newPasswordValue: (newPassword) => dispatch(newPasswordValueChange(newPassword)),
  confirmPasswordValue: (confirmPassword) => dispatch(confirmPasswordValueChange(confirmPassword)),
  uploadProfilePic: (file) => dispatch(uploadProfilePic.start(file)),
  updateProfile: (values: ProfileFormData) => dispatch(updateProfile.start(values)),
  startChangePassword: () => dispatch(changePassword.start()),
  resetPasswordForm: () => dispatch(clearPasswordForm()),
  toggleServicePacksPopup: () => dispatch(toggleServicePacksPopup()),
  selectWelcomeOption: (option: string) => dispatch(selectWelcomeOption.start(option))
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileForm);
