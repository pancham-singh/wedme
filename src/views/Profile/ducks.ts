import { createDuck, createReducer, createAction } from 'yapreact/utils';
import { DuckStateNode } from 'yapreact/utils/createDuck';
import { Reducer } from 'redux';
import { LOCATION_CHANGE } from 'react-router-redux';

const updateProfileDuck = createDuck('UPDATE_PROFILE');
const togglePasswordDuck = createDuck('TOGGLE_PASSWORD');
const uploadProfilePicDuck = createDuck('UPLOAD_PROFILE_PIC');
const changePasswordDuck = createDuck('CHANGE_PASSWORD');
const welcomPopupDuck = createDuck('WELCOME_POPUP_CLOSE');

export const newPasswordValueChange = createAction('NEW_PASSORD_VALUE');
export const oldPasswordValueChange = createAction('OLD_PASSORD_VALUE');
export const confirmPasswordValueChange = createAction('CONFIRM_PASSWORD_VALUE');

export interface ProfileFormState {
  isUpdatingProfile: boolean;
  updateStatus: DuckStateNode<null>;
  togglePassword: DuckStateNode<null>;
  uploadProfilePicStatus: DuckStateNode<null>;
  changePasswordStatus: DuckStateNode<null>;
  welcomePopupStatus: DuckStateNode<null>;
  showChangePassword: boolean;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
  servicePacksPopup: {
    isVisible: boolean;
  };
}

const ducks = {
  updateStatus: updateProfileDuck,
  togglePassword: togglePasswordDuck,
  uploadProfilePicStatus: uploadProfilePicDuck,
  changePasswordStatus: changePasswordDuck,
  welcomePopupStatus: welcomPopupDuck
};
const initialState: Partial<ProfileFormState> = {
  isUpdatingProfile: false,
  showChangePassword: false,
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
  servicePacksPopup: {
    isVisible: false
  }
};

export const updateProfile = updateProfileDuck.actions;
export const togglePassword = togglePasswordDuck.actions;
export const uploadProfilePic = uploadProfilePicDuck.actions;
export const changePassword = changePasswordDuck.actions;
export const actuallySaveProfile = createAction('ACTUALLY_SAVE_PROFILE');
export const clearPasswordForm = createAction('CLEAR_PASSWORD_FORM');
export const toggleServicePacksPopup = createAction('TOGGLE_PLANS_POPUP');
export const selectWelcomeOption = welcomPopupDuck.actions;

export default createReducer(
  {
    [toggleServicePacksPopup().type]: (state: ProfileFormState) => ({
      ...state,
      servicePacksPopup: {
        ...state.servicePacksPopup,
        isVisible: !state.servicePacksPopup.isVisible
      }
    }),
    [actuallySaveProfile().type]: (state: ProfileFormState) => ({
      ...state,
      isUpdatingProfile: true
    }),
    [updateProfile.fail().type]: (state: ProfileFormState) => ({
      ...state,
      isUpdatingProfile: false
    }),
    [updateProfile.success().type]: (state: ProfileFormState) => ({
      ...state,
      isUpdatingProfile: false
    }),
    [togglePassword.start().type]: (state: ProfileFormState) => {
      const showChangePassword = !state.showChangePassword;
      return {
        ...state,
        showChangePassword
      };
    },

    [oldPasswordValueChange().type]: (state: ProfileFormState, { payload: oldPassword }) => {
      return {
        ...state,
        oldPassword
      };
    },

    [newPasswordValueChange().type]: (state: ProfileFormState, { payload: newPassword }) => {
      return {
        ...state,
        newPassword
      };
    },

    [clearPasswordForm().type]: (state: ProfileFormState) => ({
      ...state,
      newPassword: '',
      oldPassword: '',
      confirmPassword: '',
      changePasswordStatus: changePasswordDuck.initialState
    }),

    [confirmPasswordValueChange().type]: (
      state: ProfileFormState,
      { payload: confirmPassword }
    ) => {
      return {
        ...state,
        confirmPassword
      };
    },
    [LOCATION_CHANGE]: (state) => ({
      ...state,
      servicePacksPopup: {
        ...state.servicePacksPopup,
        isVisible: false
      }
    })
  },
  { initialState, ducks }
) as Reducer<ProfileFormState>;
