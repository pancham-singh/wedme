import * as React from 'react';
import * as classnames from 'classnames';
import { connect } from 'react-redux';
import { flatten, compose, filter, map, sum, pathOr } from 'ramda';

import { State } from '@src/ducks';
import { AdditionalExpense, Vendor, UserProfile, Category } from '@src/firebase/ducks';
import AdditionalExpensesTable from '@src/components/AdditionalExpensesTable';
import AdditionalExpensesDrawer from '@src/components/AdditionalExpensesDrawer';
import AddProviderForm from '@src/components/AddProviderForm';
import BudgetProgress from '@src/components/BudgetProgress';
import { FormattedMessage } from 'react-intl';
import {
  changeSelectedVendor,
  BudgetViewState,
  toggleBudgetDrawer,
  deleteBudget,
  togglePaidAdditionalExpense,
  togglePaidMilestone,
  changeBudget,
  startEditingBudget,
  stopEditingBudget,
  toggleBigPlusMenu,
  BudgetDrawerForms,
  setBudgetDrawerForm,
  createAdditionalExpense,
  showBudgetDrawer,
  changeSelectedExpense,
  unselectAllSelected,
  addProvider,
  deleteAdditionalExpense
} from '@src/views/Budget/ducks';
import Drawer from '@src/components/Drawer';
import BudgetDrawer from '@src/views/BudgetDrawer';
import Loader from '@src/components/Loader';
import { DuckStateNode } from 'yapreact/utils/createDuck';
import BigPlusMenu from '@src/components/BigPlusMenu';
import downloadStrAsCsv from '@src/lib/downloadStrAsCsv';

const printSvg = require('@src/images/icons/ic-printer.svg');
const downloadSvg = require('@src/images/icons/ic-excel.svg');
const deleteSvg = require('@src/images/icons/ic-tresh.svg');
const editSvg = require('@src/images/icons/ic-edit.svg');

interface BudgetProps extends BudgetViewState {
  additionalExpenses: AdditionalExpense[];
  userProfile: UserProfile;
  vendors: Vendor[];
  vendorsFetchStatus: DuckStateNode<null>;
  additionalExpensesFetchStatus: DuckStateNode<null>;
  categories: Category[];
  newVendorFormValues: any;
}

interface BudgetCallbacks {
  selectVendor: (v: Vendor) => void;
  selectAdditionalExpense: (e: AdditionalExpense) => void;
  toggleDrawer: (form: BudgetDrawerForms) => () => void;
  showDrawer: (form: BudgetDrawerForms) => () => void;
  hideDrawer: (form: BudgetDrawerForms) => () => void;
  removeFromBudget: (v: Vendor) => void;
  togglePaidMilestone: (v: Vendor, milestone: 'advance' | 'second' | 'final') => void;
  togglePaidAdditionalExpense: (exp: AdditionalExpense) => void;
  changeBudget: (budget: number) => void;
  startEditingBudget: () => void;
  stopEditingBudget: () => void;
  toggleBigPlusMenu: () => void;
  createAdditionalExpense: (values: any) => void;
  showNewExpenseForm: () => void;
  showAddProviderForm: () => void;
  addProvider: (values: any) => void;
  deleteSelectedExpense: (id: string) => void;
  editSelectedExpense: (id: string) => void;
  downloadVendors: (str) => void;
  printVendors: (vs: Vendor[]) => void;
}

const getVendorMilestones = (vendor: Vendor) => {
  return {
    advance: pathOr({ amount: 0, isPaid: false }, ['paymentMilestones', 'advance'], vendor),
    second: pathOr({ amount: 0, isPaid: false }, ['paymentMilestones', 'second'], vendor),
    final: pathOr({ amount: 0, isPaid: false }, ['paymentMilestones', 'final'], vendor)
  };
};

const getMilestoneTotal = (isPaid: boolean) =>
  compose(
    sum,
    map((m) => m.amount),
    filter((m) => isPaid === !!m.isPaid),
    flatten,
    map((v) => Object.values(v)),
    map(getVendorMilestones)
  );

let Budget = (props: BudgetProps & BudgetCallbacks) => {
  const {
    vendors,
    userProfile,
    selectVendor,
    selectedVendorId,
    drawer,
    toggleDrawer,
    removeFromBudget,
    togglePaidAdditionalExpense,
    togglePaidMilestone,
    toggleAdditionalExpenseStatus,
    toggleMilestoneStatus,
    vendorsFetchStatus,
    additionalExpensesFetchStatus,
    changeBudget,
    changeBudgetStatus,
    startEditingBudget,
    stopEditingBudget,
    isEditingBudget
  } = props;
  const userBudget = pathOr(0, ['budget', 'amount'], userProfile);
  let csvContent = 'סוג ספק,שם ספק,סכום,מקדמה,תשלום שני,תשלום אחרון'
    .split(',')
    .reverse()
    .join(',');

  const addRowToCsv = (csv: string, row: string): string => `${csv}\r\n${row}`;

  const isBusy =
    toggleMilestoneStatus.isBusy ||
    toggleAdditionalExpenseStatus.isBusy ||
    vendorsFetchStatus.isBusy ||
    additionalExpensesFetchStatus.isBusy ||
    props.deleteExpenseStatus.isBusy ||
    changeBudgetStatus.isBusy;
  const error =
    toggleMilestoneStatus.error ||
    toggleAdditionalExpenseStatus.error ||
    vendorsFetchStatus.error ||
    additionalExpensesFetchStatus.error;

  const paidTotal = getMilestoneTotal(true)(vendors);
  const unpaidTotal = getMilestoneTotal(false)(vendors);
  const additionalTotal = compose(sum, map((ae) => (ae as AdditionalExpense).amount))(
    props.additionalExpenses
  );
  const total = paidTotal + unpaidTotal;

  const selectedVendor = vendors.find((v) => v.vendor.id === selectedVendorId);

  const BudgetTable = () => (
    <div>
      <div className="table-controls no-print">
        <h2 className="title table">
          <FormattedMessage id="budget.budgetTable.title" />{' '}
        </h2>
        <div className="icons">
          {selectedVendor && (
            <a onClick={() => removeFromBudget(selectedVendor)}>
              <img src={deleteSvg} />
            </a>
          )}
          {selectedVendor &&
            !props.drawer.isOpen && (
              <a onClick={props.toggleDrawer('BID-N-TERMS')}>
                <img src={editSvg} />
              </a>
            )}
          <a onClick={() => props.printVendors(vendors)}>
            <img src={printSvg} />
          </a>
          <a onClick={() => props.downloadVendors(csvContent)}>
            <img src={downloadSvg} />
          </a>
        </div>
      </div>

      {error && <div className="table error">{error}</div>}
      <table className="table table-light budget-table">
        <thead>
          <tr className="budget-row">
            <th scope="col">
              <FormattedMessage id="budget.budgetTable.lastPayment" />{' '}
            </th>
            <th scope="col">
              <FormattedMessage id="budget.budgetTable.secondPayment" />
            </th>
            <th scope="col">
              <FormattedMessage id="budget.budgetTable.advancePayment" />
            </th>
            <th scope="col">
              <FormattedMessage id="budget.budgetTable.amount" />
            </th>
            <th scope="col">
              <FormattedMessage id="budget.budgetTable.providerName" />
            </th>
            <th scope="col">
              <FormattedMessage id="budget.budgetTable.vendorType" />
            </th>
          </tr>
        </thead>

        <tbody>
          {vendors.map((v) => {
            const milestones = {
              advance: pathOr({ amount: 0, isPaid: false }, ['paymentMilestones', 'advance'], v),
              second: pathOr({ amount: 0, isPaid: false }, ['paymentMilestones', 'second'], v),
              final: pathOr({ amount: 0, isPaid: false }, ['paymentMilestones', 'final'], v)
            };
            const totalAmount = Object.values(milestones || {}).reduce(
              (accum, v) => accum + v.amount,
              0
            );
            csvContent = addRowToCsv(
              csvContent,
              `${v.vendor.categoryName || ''},${v.vendor.businessName || ''},${totalAmount},${
                milestones.advance.amount
              },${milestones.second.amount},${milestones.final.amount}`
                .split(',')
                .reverse()
                .join(',')
            );

            return (
              <tr
                className={classnames('budget-row', { active: selectedVendorId === v.vendor.id })}
                key={v.vendor.id}
                onClick={() => selectVendor(v)}
              >
                <td>
                  {milestones.final.amount} ₪
                  <span
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      togglePaidMilestone(v, 'final');
                    }}
                    className={classnames({
                      status: !!milestones.final.amount,
                      success: milestones.final.isPaid
                    })}
                  />
                </td>
                <td>
                  {milestones.second.amount} ₪
                  <span
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      togglePaidMilestone(v, 'second');
                    }}
                    className={classnames({
                      status: !!milestones.second.amount,
                      success: milestones.second.isPaid
                    })}
                  />
                </td>

                <td>
                  {milestones.advance.amount} ₪
                  <span
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      togglePaidMilestone(v, 'advance');
                    }}
                    className={classnames({
                      status: !!milestones.advance.amount,
                      success: milestones.advance.isPaid
                    })}
                  />
                </td>
                <td>{totalAmount} ₪</td>
                <td>{v.vendor.businessName}</td>
                <td>{v.vendor.categoryName}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="budget-row">
            <th className="not-paid">
              <FormattedMessage id="budget.budgetTable.unpaid" />
              <span className="amount"> {unpaidTotal} ₪ </span>
            </th>
            <th>
              <FormattedMessage id="budget.budgetTable.paidUp" />
              <span className="amount"> {paidTotal} ₪ </span>{' '}
            </th>
            <th colSpan={4}>
              <FormattedMessage id="budget.budgetTable.total" />
              {/* <span className="amount"> {total} ₪ </span>{' '} */}
            </th>
          </tr>
        </tfoot>
      </table>
    </div>
  );

  const drawerJsx = () => {
    const drawerFormType = props.drawer.form;
    const selectedExpense =
      props.selectedExpenseId &&
      props.additionalExpenses.find((e) => e.id === props.selectedExpenseId);
    return (
      drawerFormType && (
        <Drawer isOpen={props.drawer.isOpen} onToggle={props.toggleDrawer(drawerFormType)}>
          {drawerFormType === 'BID-N-TERMS' &&
            selectedVendor && <BudgetDrawer vendor={selectedVendor} />}
          {drawerFormType === 'ADD_PROVIDER' && (
            <AddProviderForm
              status={props.addProviderStatus}
              formValues={props.newVendorFormValues}
              provider={selectedVendor}
              onAddProvider={props.addProvider}
              categories={props.categories}
            />
          )}
          {drawerFormType === 'ADDITIONAL_EXPENSES' && (
            <AdditionalExpensesDrawer
              status={props.createExpenseStatus}
              expense={selectedExpense}
              onCreateExpense={props.createAdditionalExpense}
            />
          )}
        </Drawer>
      )
    );
  };

  return (
    <div className="container-with-drawer">
      <BigPlusMenu {...props.bigPlusMenu} onToggle={props.toggleBigPlusMenu}>
        <li className="big-plus-menu__list__item" onClick={props.showAddProviderForm}>
          <FormattedMessage id="budget.bigPlusMenu.provider" />
        </li>
        <li className="big-plus-menu__list__item--seperator" />
        <li className="big-plus-menu__list__item" onClick={props.showNewExpenseForm}>
          <FormattedMessage id="budget.bigPlusMenu.additionalExpense" />
        </li>
      </BigPlusMenu>

      {drawerJsx()}
      <section id="budget">
        <Loader isVisible={isBusy} />

        <h1 className="title main">
          <FormattedMessage id="budget.title" />
        </h1>
        <BudgetProgress
          spent={total + additionalTotal}
          budget={userBudget}
          onBudgetChange={changeBudget}
          onStartEditingBudget={startEditingBudget}
          onStopEditingBudget={stopEditingBudget}
          isEditingBudget={isEditingBudget}
        />

        {vendors.length ? (
          <BudgetTable />
        ) : (
          <h2 className="table no-print">
            <FormattedMessage id="budget.noBudgetMsg" />
          </h2>
        )}

        <AdditionalExpensesTable
          selectedId={props.selectedExpenseId}
          additionalExpenses={props.additionalExpenses}
          onTogglePaid={props.togglePaidAdditionalExpense}
          onSelectExpense={props.selectAdditionalExpense}
          onDeleteSelected={props.deleteSelectedExpense}
          onEditSelected={props.editSelectedExpense}
        />
      </section>
    </div>
  );
};

const mapStateToProps = ({
  firebase: { user, additionalExpense, ui, vendors, profile, categories },
  budgetView,
  form
}: State): Partial<BudgetProps> => ({
  ...budgetView,
  userProfile: profile,
  additionalExpensesFetchStatus: ui.additionalExpenses,
  vendorsFetchStatus: ui.vendors,
  additionalExpenses: Object.keys(additionalExpense).map((key) => ({
    ...additionalExpense[key],
    id: key
  })),
  vendors: Object.values(vendors).filter((v) => v.isSelected),
  categories: Object.values(categories),
  newVendorFormValues: form['AddProviderForm']
    ? form['AddProviderForm'].values
    : {
        vendor: {
          categoryId: Object.keys(categories)[0]
        }
      }
});

const mapDispatchToProps = (dispatch): BudgetCallbacks => ({
  selectVendor: (vendor) => {
    dispatch(changeSelectedVendor(vendor));
    dispatch(setBudgetDrawerForm('BID-N-TERMS'));
  },
  selectAdditionalExpense: (exp) => {
    dispatch(changeSelectedExpense(exp));
    dispatch(setBudgetDrawerForm('ADDITIONAL_EXPENSES'));
  },
  toggleDrawer: (form: BudgetDrawerForms) => () => {
    dispatch(setBudgetDrawerForm(form));
    dispatch(toggleBudgetDrawer());
  },
  showNewExpenseForm: () => {
    dispatch(unselectAllSelected());
    dispatch(setBudgetDrawerForm('ADDITIONAL_EXPENSES'));
    dispatch(showBudgetDrawer());
  },
  showAddProviderForm: () => {
    dispatch(unselectAllSelected());
    dispatch(setBudgetDrawerForm('ADD_PROVIDER'));
    dispatch(showBudgetDrawer());
  },
  showDrawer: (form: BudgetDrawerForms) => () => {
    dispatch(setBudgetDrawerForm(form));
    dispatch(showBudgetDrawer());
  },
  hideDrawer: (form: BudgetDrawerForms) => () => {
    dispatch(setBudgetDrawerForm(form));
    dispatch(showBudgetDrawer());
  },
  removeFromBudget: (vendor) => dispatch(deleteBudget.start(vendor)),
  togglePaidAdditionalExpense: (exp) => dispatch(togglePaidAdditionalExpense.start(exp)),
  togglePaidMilestone: (vendor, milestone) =>
    dispatch(togglePaidMilestone.start({ vendor, milestone })),
  changeBudget: (budget) => dispatch(changeBudget.start(budget)),
  startEditingBudget: () => dispatch(startEditingBudget()),
  stopEditingBudget: () => dispatch(stopEditingBudget()),
  toggleBigPlusMenu: () => dispatch(toggleBigPlusMenu()),
  createAdditionalExpense: (values) => dispatch(createAdditionalExpense.start(values)),
  addProvider: (values) => dispatch(addProvider.start(values)),
  editSelectedExpense: (exp) => {
    dispatch(setBudgetDrawerForm('ADDITIONAL_EXPENSES'));
    dispatch(showBudgetDrawer());
  },
  deleteSelectedExpense: (exp) => dispatch(deleteAdditionalExpense.start(exp)),
  downloadVendors: (csv) => downloadStrAsCsv(csv, 'vendors.csv'),
  printVendors: (vendors) => {
    print();
    console.warn('Printing', vendors);
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Budget);
