import * as React from 'react';
import { pathOr } from 'ramda';
import { Component } from 'react';
import { connect } from 'react-redux';
import * as classnames from 'classnames';
import { reduxForm } from 'redux-form';
import { State } from '@src/ducks';
import { FormattedMessage } from 'react-intl';
import {
  BudgetDrawerState,
  switchTab,
  savePaymentMilestones,
  saveBids
} from '@src/views/BudgetDrawer/ducks';
import PaymentTermsTab, { PaymentTermsFormData } from './PaymentTerms';
import BidsForm from '@src/views/DrawerBidsForm';
import Loader from '@src/components/Loader';
import { Vendor, Category } from '@src/firebase/ducks';

interface BudgetDrawerProps extends BudgetDrawerState {
  vendor: Vendor;
  paymentTermsFormValues: any;
  category: Category;
}
interface BudgetDrawerCallbacks {
  switchTab: (tab: 'bids' | 'paymentTerms') => void;
  savePaymentMilestones: (vendor: Vendor) => (values: PaymentTermsFormData) => void;
  saveBids: (vendor: Vendor) => (values: any) => void;
}

class BudgetDrawer extends Component<BudgetDrawerProps & BudgetDrawerCallbacks> {
  render() {
    const isBusy = this.props.savePaymentStatus.isBusy || this.props.saveBidsStatus.isBusy;
    const { activeTab, vendor, category } = this.props;

    if (!vendor) {
      return null;
    }

    return (
      <div className="budget-drawer">
        <Loader isVisible={isBusy} />

        <div className="tabs-list">
          {this.props.category &&
            this.props.category.forms &&
            this.props.category.forms.bids && (
              <span
                onClick={() => this.props.switchTab('bids')}
                className={classnames('tab-link', { active: activeTab === 'bids' })}
              >
                <FormattedMessage id="drawer.bidsTabTitle" />
              </span>
            )}
          <span
            onClick={() => this.props.switchTab('paymentTerms')}
            className={classnames('tab-link', { active: activeTab === 'paymentTerms' })}
          >
            <FormattedMessage id="drawer.paymentTermsTabTitle" />
          </span>
        </div>
        <div className="tab-body">
          <div className="drawer-tab-body-heading">
            <h3>{category.name}</h3>
            <span className="phone">
              {vendor.vendor.phone}:<FormattedMessage id="drawer.phoneTitle" />{' '}
            </span>
          </div>

          {this.props.activeTab === 'bids' && (
            <BidsForm
              vendor={this.props.vendor}
              category={this.props.category}
              onSubmit={this.props.saveBids(vendor)}
            />
          )}
          {this.props.activeTab === 'paymentTerms' && (
            <PaymentTermsTab
              initialValues={{
                advance: pathOr(
                  { amount: 0, isPaid: false },
                  ['paymentMilestones', 'advance'],
                  vendor
                ),
                second: pathOr(
                  { amount: 0, isPaid: false },
                  ['paymentMilestones', 'second'],
                  vendor
                ),
                final: pathOr({ amount: 0, isPaid: false }, ['paymentMilestones', 'final'], vendor)
              }}
              formValues={this.props.paymentTermsFormValues}
              onSubmit={this.props.savePaymentMilestones(vendor)}
            />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (
  state: State,
  props: Partial<BudgetDrawerProps>
): Partial<BudgetDrawerProps> => ({
  ...state.budgetDrawer,
  paymentTermsFormValues: state.form['PaymentTerms'] && state.form['PaymentTerms'].values,
  category: state.firebase.categories[props.vendor.vendor.categoryId]
});
const mapDispatchToProps = (dispatch): BudgetDrawerCallbacks => ({
  switchTab: (tab) => dispatch(switchTab(tab)),
  savePaymentMilestones: (vendor: Vendor) => (values) =>
    dispatch(savePaymentMilestones.start({ vendor, values })),
  saveBids: (vendor: Vendor) => (values) => dispatch(saveBids.start({ vendor, values }))
});

export default connect(mapStateToProps, mapDispatchToProps)(BudgetDrawer);
