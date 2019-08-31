import {
  createAction as createYapAction,
  createDuck as createYapDuck,
  createReducer
} from 'yapreact/utils';
import { combineReducers } from 'redux';
import { DuckStateNode } from 'yapreact/utils/createDuck';
import { locale } from '@src/config';
import * as camelize from 'camelize';
import { userInfo } from 'os';
import { signup } from '@src/views/SignupForm/ducks';
import { uploadProfilePic } from '@src/views/Profile/ducks';

import {
  uploadRecords,
  changeSelectedInvite,
  unselectAllSelected as unselectInvite
} from '@src/views/Invitation/ducks';
import { changeSelectedGift, unselectAllSelected as unselectGift } from '@src/views/Gift/ducks';
import { toggleSelectedRecipient } from '@src/views/Invitation/SendSms/ducks';

const createAction = (type) => createYapAction(`FIREBASE_${type}`);
const createDuck = (type, initialData = null) => createYapDuck(`FIREBASE_${type}`, initialData);

export interface User {
  uid: string;
  displayName: string;
  photoURL: string | void;
  email: string;
  emailVerified: boolean;
  phoneNumber: number | void;
  isAnonymous: boolean;
  providerData: Array<{
    uid: string;
    displayName: string;
    photoURL: string;
    email: string;
    phoneNumber: string | void;
    providerId: string;
  }>;
  apiKey: string;
  redirectEventId: string | void;
  lastLoginAt: string;
  createdAt: string;
}

export interface UserProfile {
  locale: string;
  signupBy: 'groom' | 'bride' | 'other';
  planningStatusOnSignup: 'started' | 'starting' | 'none';
  phone: string;
  countryCode: string;
  event: {
    date: number;
    brideName: string;
    groomName: string;
    location: {
      address: string;
      coordinates: {
        latitude: number;
        longitude: number;
      };
    };
  };
  budget: {
    amount: number;
    currency: string;
  };
  sms: {
    used: number;
    available: number;
  };
  createdAt: number;
  updatedAt: number;
}

export interface Category {
  id: string;
  name: string;
  englishName: string;
  icon?: string;
  bannerImage?: string;
  tips?: string[];
  forms?: any;
}

export interface AdditionalExpense {
  id: string;
  expenditure: string;
  whatToBuy: string;
  whereToBuy: string;
  responsible: 'groom' | 'bride';
  isPaid: boolean;
  amount: number;
  currency: string;
}

export interface Invitation {
  id: string;
  name: string;
  phone: string;
  countryCode: string;
  relation: string;
  status: string;
  location: {
    city: string;
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  foodPreference: string;
  addedBy: string;
  isSelected: boolean;
  isEditing: boolean;
  invitedCount: number;
  transportation: {
    required: boolean;
    shuttle: string;
  };
}
export interface Gift {
  id: string;
  fullName: string;
  invitedCount: number;
  reachedCount: number;
  paymentMode: string;
  amount: number;
  currency: string;
  isSelected: boolean;
  isEditing: boolean;
}

export interface Shuttle {
  id: string;
  city: string;
  gatheringPlace: string;
  pickupDateTime: string;
}

export interface AuthState {
  login: DuckStateNode<null>;
  logout: DuckStateNode<null>;
}

export interface ApiVendor {
  id: string;
  email: string;
  categoryId: string;
  categoryName: string;
  subcategoryId: string;
  logoFilename: string;
  businessName: string;
  businessEmail: string;
  contactName: string;
  contactPhone: string;
  contactPhone2: string;
  website: string;
  city: string;
  street: string;
  zipcode: string;
  phone: string;
  phone2: string;
  promotionalText: string;
  profileViews: string;
  facebookPageId: string;
  facebookPageUrl: string;
  wedReviewsFacebookPageUrl: string;
  facebookAppId: string;
  bottomTextLine: string;
  aboutText: string;
  backgroundImageFilename: string;
  wazeUrl: string;
}

export interface Vendor {
  id: string;
  vendor: ApiVendor;
  isSelected: boolean;
  isCustom: boolean;
  bookingDate: string;
  bids: any; // Structure of a bid is determined by the forms defined in Category
  paymentMilestones: {
    advance: {
      amount: number;
      currency: string;
      isPaid: boolean;
    };
    second: {
      amount: number;
      currency: string;
      isPaid: boolean;
    };
    final: {
      amount: number;
      currency: string;
      isPaid: boolean;
    };
  };
}

export interface FirebaseUIState {
  user: DuckStateNode<null>;
  profile: DuckStateNode<null>;
  categories: DuckStateNode<null>;
  vendors: DuckStateNode<null>;
  additionalExpenses: DuckStateNode<null>;
}

export interface FirebaseState {
  auth: AuthState;
  ui: FirebaseUIState;
  user: User;
  profile: UserProfile;
  categories: { [id: string]: Category };
  vendors: { [id: string]: Vendor };
  additionalExpense: { [id: string]: AdditionalExpense };
  invitations: { [id: string]: Invitation };
  gifts: { [id: string]: Gift };
}

const loginDuck = createDuck('LOGIN', null);
const logoutDuck = createDuck('LOGOUT', null);
const authDucks = { login: loginDuck, logout: logoutDuck };

const profileDuck = createDuck('PROFILE');
const vendorDuck = createDuck('VENDOR');
const categoriesDuck = createDuck('CATEGORIES');
const additionalExpensesDuck = createDuck('ADDITIONAL_EXPENSES');
const uiDucks = {
  profile: profileDuck,
  categories: categoriesDuck,
  vendors: vendorDuck,
  additionalExpenses: additionalExpensesDuck
};

export const login = loginDuck.actions;
export const logout = logoutDuck.actions;

export const fetchInvitations = createAction('FETCH_INVITATIONS');
export const fetchGifts = createAction('FETCH_GIFTS');

export const newProfileValue = profileDuck.actions;
export const newVendorValue = vendorDuck.actions;
export const newCategories = categoriesDuck.actions;
export const newAdditionalExpenses = additionalExpensesDuck.actions;

export default combineReducers({
  auth: createReducer({}, { ducks: authDucks }),
  ui: createReducer({}, { ducks: uiDucks }),
  user: createReducer(
    {
      [login.success().type]: (state, { payload }) => ({
        ...payload,
        // signup needs to set display name manually
        displayName: payload.displayName || state.displayName
      }),
      [signup.success().type]: (state, { payload: values }) => ({
        ...state,
        displayName: values.displayName
      }),
      [uploadProfilePic.success().type]: (state, { payload: photoURL }) => ({
        ...state,
        photoURL
      }),
      [logout.success().type]: () => ({})
    },
    {}
  ),
  profile: createReducer(
    {
      [newProfileValue.success().type]: (state, { payload: profile }) => ({ ...(profile || {}) })
    },
    { initialState: {} }
  ),
  vendors: createReducer(
    {
      [newVendorValue.success().type]: (state, { payload: vendors }) => ({
        ...camelize(vendors || {})
      })
    },
    { initialState: {} }
  ),
  additionalExpense: createReducer(
    {
      [newAdditionalExpenses.success().type]: (state, { payload: additionalExpenses }) => ({
        ...(additionalExpenses || {})
      })
    },
    { initialState: {} }
  ),
  categories: createReducer(
    {
      [newCategories.success().type]: (state, { payload: categories }) => ({
        ...(categories || {})
      })
    },
    { initialState: {} }
  ),
  invitations: createReducer(
    {
      [fetchInvitations().type]: (state, { payload: invitations }) => {
        let oldInvitations = { ...state };
        Object.keys(oldInvitations).map((key) => {
          if (oldInvitations[key].isEditing) {
            invitations[key].isEditing = true;
          }
        });
        return {
          ...(invitations || {})
        };
      },
      [uploadRecords.success().type]: (state, { payload: invitations }) => ({
        ...(invitations || {})
      }),
      [toggleSelectedRecipient().type]: (state: { [id: string]: Invitation }, { payload: id }) => {
        let invitations = { ...state };
        invitations[id].isSelected = !invitations[id].isSelected;
        return {
          ...invitations
        };
      },
      [changeSelectedInvite().type]: (state: { [id: string]: Invitation }, { payload }) => {
        const { editingInviteId, newId } = payload;
        let invitations = { ...state };

        if (newId === editingInviteId) {
          invitations[newId].isEditing = !invitations[newId].isEditing;
        } else {
          invitations[newId].isEditing = true;
          if (editingInviteId) {
            invitations[editingInviteId].isEditing = false;
          }
        }
        return {
          ...invitations
        };
      },
      [unselectInvite().type]: (state: { [id: string]: Invitation }, {}) => {
        let invitations = { ...state };
        Object.keys(invitations).map((key) => {
          if (invitations[key].isEditing) {
            invitations[key].isEditing = false;
          }
        });
        return {
          ...(invitations || {})
        };
      }
    },
    { initialState: {} }
  ),
  gifts: createReducer(
    {
      [fetchGifts().type]: (state, { payload: gifts }) => {
        let oldGifts = { ...state };
        Object.keys(oldGifts).map((key) => {
          if (oldGifts[key].isEditing) {
            gifts[key].isEditing = true;
          }
        });
        return {
          ...(gifts || {})
        };
      },
      [changeSelectedGift().type]: (state: { [id: string]: Gift }, { payload }) => {
        const { editingGiftId, newId } = payload;
        let gifts = { ...state };

        if (newId === editingGiftId) {
          gifts[newId].isEditing = !gifts[newId].isEditing;
        } else {
          gifts[newId].isEditing = true;
          if (editingGiftId) {
            gifts[editingGiftId].isEditing = false;
          }
        }
        return {
          ...gifts
        };
      },
      [unselectGift().type]: (state: { [id: string]: Gift }, {}) => {
        let gifts = { ...state };

        Object.keys(gifts).map((key) => {
          if (gifts[key].isEditing) {
            gifts[key].isEditing = false;
          }
        });
        return {
          ...(gifts || {})
        };
      }
    },
    { initialState: {} }
  )
});
