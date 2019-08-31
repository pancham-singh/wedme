import { createDuck, createReducer, createAction } from 'yapreact/utils';
import { DuckStateNode } from 'yapreact/utils/createDuck';

export interface CompareViewState {
  selectVendorStatus: DuckStateNode<null>;
  selectedVendorId: string;
  removeFromComparisonStatus: DuckStateNode<null>;
  drawer: {
    isOpen: boolean;
  };
  bigPlusMenu: {
    isOpen: boolean;
  };
}

const selectVendorDuck = createDuck('SELECT_VENDOR', null);
const removeFromComparisonDuck = createDuck('REMOVE_VENDOR_FROM_COMPARISON', null);

const initialState: Partial<CompareViewState> = {
  drawer: {
    isOpen: false
  },
  bigPlusMenu: {
    isOpen: false
  }
};

const ducks = {
  selectVendorStatus: selectVendorDuck,
  removeFromComparisonStatus: removeFromComparisonDuck
};

export const toggleCompareDrawer = createAction('TOGGLE_COMPARE_DRAWER');
export const showCompareDrawer = createAction('SHOW_COMPARE_DRAWER');
export const changeSelectedVendorId = createAction('CHANGE_COMPARE_SELECTED_VENDOR_ID');
export const selectVendor = selectVendorDuck.actions;
export const removeFromComparison = removeFromComparisonDuck.actions;
export const toggleBigPlusMenu = createAction('TOGGLE_COMPARE_BIG_PLUS_MENU');

export default createReducer(
  {
    [toggleBigPlusMenu().type]: (state: CompareViewState) => ({
      ...state,
      bigPlusMenu: {
        ...state.bigPlusMenu,
        isOpen: !state.bigPlusMenu.isOpen
      }
    }),
    [toggleCompareDrawer().type]: (state: CompareViewState) => ({
      ...state,
      drawer: {
        ...state.drawer,
        isOpen: !state.drawer.isOpen
      }
    }),
    [showCompareDrawer().type]: (state: CompareViewState) => ({
      ...state,
      drawer: {
        ...state.drawer,
        isOpen: true
      }
    }),
    [changeSelectedVendorId().type]: (state: CompareViewState, { payload: selectedVendorId }) => ({
      ...state,
      selectedVendorId
    })
  },
  { initialState, ducks }
);
