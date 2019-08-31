import { createReducer, createAction, createDuck } from 'yapreact/utils';
import { DuckStateNode } from 'yapreact/utils/createDuck';

export interface CompareDrawerState {
  activeTab: 'bids' | 'paymentTerms';
  savePaymentStatus: DuckStateNode<null>;
  saveBidsStatus: DuckStateNode<null>;
  saveCustomVendorStatus: DuckStateNode<null>;
  customVendorCategoryId: string;
}

const savePaymentMilestonesDuck = createDuck('SAVE_PAYMENT_MILESTONES');
const saveBidsDuck = createDuck('SAVE_BIDS');
const saveCustomVendorDuck = createDuck('SAVE_COMPARE_VENDOR');

const initialState: Partial<CompareDrawerState> = {
  activeTab: 'bids'
};
const ducks = {
  savePaymentStatus: savePaymentMilestonesDuck,
  saveBidsStatus: saveBidsDuck,
  saveCustomVendorStatus: saveCustomVendorDuck
};

export const switchTab = createAction('COMPARE_DRAWER_SWITCH_TAB');
export const changeCustomVendorCategoryId = createAction('SET_COMPARE_VENDOR_CATEGORY_ID');
export const savePaymentMilestones = savePaymentMilestonesDuck.actions;
export const saveBids = saveBidsDuck.actions;
export const saveCustomCompareVendor = saveCustomVendorDuck.actions;

export default createReducer(
  {
    [switchTab().type]: (state: CompareDrawerState, { payload }) => ({
      ...state,
      activeTab: payload
    }),
    [changeCustomVendorCategoryId().type]: (state: CompareDrawerState, { payload: id }) => ({
      ...state,
      customVendorCategoryId: id
    })
  },
  { initialState, ducks }
);
