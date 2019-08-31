import { createDuck, createReducer, createAction } from 'yapreact/utils';
import { DuckStateNode } from 'yapreact/utils/createDuck';
import { LOCATION_CHANGE } from 'react-router-redux';

export const selectPaymentMode = createAction('SELECT_PAYMENT_MODE');
export const changeGuestSearchText = createAction('CHANGE_GUEST_SEARCH_TEXT');

export const toggleGiftDrawer = createAction('TOGGLE_GUEST_DRAWER');
export const changeSelectedGift = createAction('CHANGE_SELECTED_GIFT');

export const toggleBigPlusMenu = createAction('TOGGLE_GIFT_BIG_PLUS_MENU');
export const unselectAllSelected = createAction('UNSELECT_GIFT_SELECTED');

export const showGiftDrawer = createAction('SHOW_GIFT_DRAWER');

const deleteGiftDuck = createDuck('DELETE_GIFT', null);

export interface GiftViewState {
  deleteGiftDuck: DuckStateNode<null>;
  searchText: string;
  paymentModeFilter: string;
  paymentModes: {
    bankTransfer: string;
    cash: string;
    credit: string;
    check: string;
  };
  drawer: {
    isOpen: boolean;
  };
  bigPlusMenu: {
    isOpen: boolean;
  };
  editingGiftId: string;
  isShowingGiftForm: boolean;
}

const initialState = {
  searchText: '',
  paymentModeFilter: '',
  paymentModes: {
    bankTransfer: 'Bank Transfer',
    cash: 'Cash',
    credit: 'Credit',
    cheque: 'Cheque'
  },
  drawer: {
    isOpen: false
  },
  bigPlusMenu: {
    isOpen: false
  },
  editingGiftId: '',
  isShowingGiftForm: false
};

export const deleteGift = deleteGiftDuck.actions;

const ducks = {
  deleteGift: deleteGiftDuck
};

export default createReducer(
  {
    [LOCATION_CHANGE]: (state: GiftViewState): GiftViewState => ({
      ...state,
      bigPlusMenu: {
        ...state.bigPlusMenu,
        isOpen: false
      },
      drawer: {
        ...state.drawer,
        isOpen: false
      },
      isShowingGiftForm: false
    }),
    [toggleBigPlusMenu().type]: (state: GiftViewState): GiftViewState => ({
      ...state,
      bigPlusMenu: {
        ...state.bigPlusMenu,
        isOpen: !state.bigPlusMenu.isOpen
      }
    }),
    [selectPaymentMode().type]: (state, { payload: paymentMode }) => ({
      ...state,
      paymentModeFilter: paymentMode
    }),

    [changeGuestSearchText().type]: (state, { payload: searchText }) => ({
      ...state,
      searchText
    }),
    [toggleGiftDrawer().type]: (state: GiftViewState) => ({
      ...state,
      drawer: {
        ...state.drawer,
        isOpen: !state.drawer.isOpen
      }
    }),
    [changeSelectedGift().type]: (state: GiftViewState, { payload }) => {
      let { editingGiftId, newId } = payload;
      if (editingGiftId === newId) {
        newId = '';
      }
      return {
        ...state,
        editingGiftId: newId,
        isShowingGiftForm: false
      };
    },
    [unselectAllSelected().type]: (state: GiftViewState) => ({
      ...state,
      editingGiftId: ''
    }),
    [showGiftDrawer().type]: (state: GiftViewState) => ({
      ...state,
      drawer: {
        ...state.drawer,
        isOpen: true
      },
      isShowingGiftForm: true
    })
  },
  { initialState, ducks }
);
