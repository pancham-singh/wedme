/*
  actions and reducers for invitations are here
*/

import { createDuck, createReducer, createAction } from 'yapreact/utils';
import { DuckStateNode } from 'yapreact/utils/createDuck';
import { LOCATION_CHANGE } from 'react-router-redux';

const uploadRecordsDuck = createDuck('UPLOAD_RECORDS', null);

export const selectReleation = createAction('SELECT_RELATION');
export const changeSearchText = createAction('CHANGE_SEARCH_TEXT');

export const toggleInviteDrawer = createAction('TOGGLE_INVITE_DRAWER');
export const changeSelectedInvite = createAction('CHANGE_SELECTED_INVITE');

export const toggleBigPlusMenu = createAction('TOGGLE_INVITE_BIG_PLUS_MENU');
export const unselectAllSelected = createAction('UNSELECT_INVITE_SELECTED');

export const showInviteDrawer = createAction('SHOW_INVITE_DRAWER');
export const showShuttleDrawer = createAction('SHOW_SHUTTLE_DRAWER');

const deleteInviteDuck = createDuck('DELETE_INVITE', null);

export interface InvitationViewState {
  uploadRecordsDuck: DuckStateNode<null>;
  deleteInviteDuck: DuckStateNode<null>;
  searchText: string;
  relationFilter: string;
  status: {
    confirmed: string;
    notComing: string;
    waitingForShuttle: string;
    notAnswered: string;
  };
  relations: {
    groomFriend: string;
    brideFriend: string;
    groomFamily: string;
    brideFamily: string;
    nobelPersonality: string;
    other: string;
  };
  foodPreference: {
    veg: string;
    nonVeg: string;
    kidsDishes: string;
    chinese: string;
    thaiFood: string;
    asian: string;
    italian: string;
    sweets: string;
  };
  drawer: {
    isOpen: boolean;
  };
  bigPlusMenu: {
    isOpen: boolean;
  };
  editingInviteId: string;
  isShowingInviteForm: boolean;
  isShowingShuttleForm: boolean;
}
const initialState = {
  searchText: '',
  relationFilter: '',
  status: {
    confirmed: 'Confirmed',
    notComing: 'Not Coming',
    waitingForShuttle: 'Waiting For Shuttle',
    notAnswered: 'Not Answered'
  },
  relations: {
    groomFriend: 'Groom Friend',
    brideFriend: 'Bride Friend',
    groomFamily: 'Groom Family',
    brideFamily: 'Bride Family',
    nobelPersonality: 'Nobel Personality',
    other: 'Other'
  },
  foodPreference: {
    veg: 'Veg',
    nonVeg: 'Non Veg',
    kidsDishes: 'Kids Dishes',
    chinese: 'Chinese',
    thaiFood: 'ThaiFood',
    asian: 'Asian',
    italian: 'Italian',
    sweets: 'Sweets'
  },
  drawer: {
    isOpen: false
  },
  bigPlusMenu: {
    isOpen: false
  },
  editingInviteId: '',
  isShowingInviteForm: false,
  isShowingShuttleForm: false
};

export const uploadRecords = uploadRecordsDuck.actions;
export const deleteInvite = deleteInviteDuck.actions;

const ducks = {
  uploadRecords: uploadRecordsDuck,
  deleteInvite: deleteInviteDuck
};

export default createReducer(
  {
    [LOCATION_CHANGE]: (state: InvitationViewState): InvitationViewState => ({
      ...state,
      bigPlusMenu: {
        ...state.bigPlusMenu,
        isOpen: false
      },
      drawer: {
        ...state.drawer,
        isOpen: false
      },
      editingInviteId: '',
      isShowingInviteForm: false,
      isShowingShuttleForm: false
    }),
    [toggleBigPlusMenu().type]: (state: InvitationViewState): InvitationViewState => ({
      ...state,
      bigPlusMenu: {
        ...state.bigPlusMenu,
        isOpen: !state.bigPlusMenu.isOpen
      }
    }),
    [selectReleation().type]: (state, { payload: relation }) => ({
      ...state,
      relationFilter: relation
    }),

    [changeSearchText().type]: (state, { payload: searchText }) => ({
      ...state,
      searchText
    }),
    [toggleInviteDrawer().type]: (state: InvitationViewState) => ({
      ...state,
      drawer: {
        ...state.drawer,
        isOpen: !state.drawer.isOpen
      }
    }),
    [changeSelectedInvite().type]: (state: InvitationViewState, { payload }) => {
      let { editingInviteId, newId } = payload;
      if (editingInviteId === newId) {
        newId = '';
      }
      return {
        ...state,
        editingInviteId: newId,
        isShowingInviteForm: false,
        isShowingShuttleForm: false
      };
    },
    [unselectAllSelected().type]: (state: InvitationViewState) => ({
      ...state,
      editingInviteId: ''
    }),
    [showInviteDrawer().type]: (state: InvitationViewState) => ({
      ...state,
      drawer: {
        ...state.drawer,
        isOpen: true
      },
      isShowingInviteForm: true
    }),
    [showShuttleDrawer().type]: (state: InvitationViewState) => ({
      ...state,
      drawer: {
        ...state.drawer,
        isOpen: true
      },
      isShowingInviteForm: false,
      isShowingShuttleForm: true
    })
  },
  { initialState, ducks }
);
