import { createDuck, createReducer, createAction } from 'yapreact/utils';
import { DuckStateNode } from 'yapreact/utils/createDuck';
import { newProfileValue } from '@src/firebase/ducks';
import { YapActionCreator } from 'yapreact/utils/createAction';

export type BudgetDrawerForms = 'BID-N-TERMS' | 'ADDITIONAL_EXPENSES' | 'ADD_PROVIDER';

export interface BudgetViewState {
  deleteStatus: DuckStateNode<null>;
  selectedVendorId: string;
  selectedExpenseId: string;
  toggleAdditionalExpenseStatus: DuckStateNode<null>;
  toggleMilestoneStatus: DuckStateNode<null>;
  changeBudgetStatus: DuckStateNode<null>;
  isEditingBudget: boolean;
  createExpenseStatus: DuckStateNode<null>;
  addProviderStatus: DuckStateNode<null>;
  drawer: {
    isOpen: boolean;
    form: BudgetDrawerForms;
  };
  bigPlusMenu: {
    isOpen: boolean;
  };
  deleteExpenseStatus: DuckStateNode<null>;
}

const createExpenseDuck = createDuck('CREATE_ADDITIONAL_EXPENSE');
const deleteVendorDuck = createDuck('DELETE_VENDOR_FROM_BUDGET', null);
const togglePaidAdditionalExpenseDuck = createDuck('TOGGLE_PAID_ADDITIONAL_EXPENSE', null);
const togglePaidMilestoneDuck = createDuck('TOGGLE_PAID_PAYMENT_MILESTONE', null);
const changeBudgetDuck = createDuck('CHANGE_BUDGET');
const addProviderDuck = createDuck('ADD_BUDGET_CUSTOM_PROVIDER');
const deleteExpenseDuck = createDuck('DELETE_ADDITIONAL_EXPENSE');

const initialState = {
  selectedVendorId: null,
  selectedExpenseId: null,
  isEditingBudget: false,
  drawer: {
    isOpen: false
  },
  bigPlusMenu: {
    isOpen: false
  }
};

const ducks = {
  deleteStatus: deleteVendorDuck,
  toggleAdditionalExpenseStatus: togglePaidAdditionalExpenseDuck,
  toggleMilestoneStatus: togglePaidMilestoneDuck,
  changeBudgetStatus: changeBudgetDuck,
  createExpenseStatus: createExpenseDuck,
  addProviderStatus: addProviderDuck,
  deleteExpenseStatus: deleteExpenseDuck
};

export const deleteBudget = deleteVendorDuck.actions;
export const toggleBudgetDrawer = createAction('TOGGLE_BUDGET_DRAWER');
export const showBudgetDrawer = createAction('SHOW_BUDGET_DRAWER');
export const hideBudgetDrawer = createAction('HIDE_BUDGET_DRAWER');
export const setBudgetDrawerForm: YapActionCreator<BudgetDrawerForms> = createAction(
  'SET_BUDGET_DRAWER_FORM'
);
export const changeSelectedVendor = createAction('CHANGE_BUDGET_SELECTED_VENDOR');
export const changeSelectedExpense = createAction('CHANGE_BUDGET_SELECTED_EXPENSE');
export const unselectAllSelected = createAction('UNSELECT_BUDGET_SELECTED');
export const togglePaidAdditionalExpense = togglePaidAdditionalExpenseDuck.actions;
export const togglePaidMilestone = togglePaidMilestoneDuck.actions;
export const changeBudget = changeBudgetDuck.actions;
export const startEditingBudget = createAction('START_EDITING_BUDGET');
export const stopEditingBudget = createAction('STOP_EDITING_BUDGET');
export const toggleBigPlusMenu = createAction('TOGGLE_BUDGET_BIG_PLUS_MENU');
export const createAdditionalExpense = createExpenseDuck.actions;
export const addProvider = addProviderDuck.actions;
export const deleteAdditionalExpense = deleteExpenseDuck.actions;

export default createReducer(
  {
    [toggleBigPlusMenu().type]: (state: BudgetViewState): BudgetViewState => ({
      ...state,
      bigPlusMenu: {
        ...state.bigPlusMenu,
        isOpen: !state.bigPlusMenu.isOpen
      }
    }),
    [toggleBudgetDrawer().type]: (state: BudgetViewState) => ({
      ...state,
      drawer: {
        ...state.drawer,
        isOpen: !state.drawer.isOpen
      }
    }),
    [showBudgetDrawer().type]: (state: BudgetViewState) => ({
      ...state,
      drawer: {
        ...state.drawer,
        isOpen: true
      }
    }),
    [hideBudgetDrawer().type]: (state: BudgetViewState) => ({
      ...state,
      drawer: {
        ...state.drawer,
        isOpen: false
      }
    }),
    [setBudgetDrawerForm().type]: (state: BudgetViewState, { payload: form }) => ({
      ...state,
      selectedVendorId: form === 'BID-N-TERMS' ? state.selectedVendorId : null,
      drawer: {
        ...state.drawer,
        form
      }
    }),
    [unselectAllSelected().type]: (state) => ({
      ...state,
      selectedVendorId: null,
      selectedExpenseId: null
    }),
    [changeSelectedVendor().type]: (state: BudgetViewState, { payload: v }) => ({
      ...state,
      selectedExpenseId: null,
      selectedVendorId: v.vendor.id
    }),
    [changeSelectedExpense().type]: (state: BudgetViewState, { payload: exp }) => ({
      ...state,
      selectedVendorId: null,
      selectedExpenseId: exp.id
    }),
    [startEditingBudget().type]: (state: BudgetViewState) => ({
      ...state,
      isEditingBudget: true
    }),
    [stopEditingBudget().type]: (state: BudgetViewState) => ({
      ...state,
      isEditingBudget: false
    })
  },
  { initialState, ducks }
);
