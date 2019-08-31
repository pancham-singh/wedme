import { createReducer, createAction, createDuck } from 'yapreact/utils';
import { DuckStateNode } from 'yapreact/utils/createDuck';

export interface BudgetDrawerState {
  activeTab: 'bids' | 'paymentTerms' | 'additionalExpenses';
  savePaymentStatus: DuckStateNode<null>;
  saveBidsStatus: DuckStateNode<null>;
}

const savePaymentMilestonesDuck = createDuck('SAVE_BUDGET_PAYMENT_MILESTONES');
const saveBidsDuck = createDuck('SAVE_BUDGET_BIDS');

const initialState: Partial<BudgetDrawerState> = {
  activeTab: 'paymentTerms'
};
const ducks = {
  savePaymentStatus: savePaymentMilestonesDuck,
  saveBidsStatus: saveBidsDuck
};

export const switchTab = createAction('BUDGET_DRAWER_SWITCH_TAB');
export const savePaymentMilestones = savePaymentMilestonesDuck.actions;
export const saveBids = saveBidsDuck.actions;

export default createReducer(
  {
    [switchTab().type]: (state: BudgetDrawerState, { payload }) => ({
      ...state,
      activeTab: payload
    })
  },
  { initialState, ducks }
);
