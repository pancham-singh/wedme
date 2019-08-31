import * as React from 'react';
import { pathOr, equals } from 'ramda';
import { Component } from 'react';
import { connect } from 'react-redux';
import * as classnames from 'classnames';
import { reduxForm } from 'redux-form';
import { State } from '@src/ducks';
import {
  CompareDrawerState,
  switchTab,
  savePaymentMilestones,
  saveBids,
  saveCustomCompareVendor,
  changeCustomVendorCategoryId
} from '@src/views/CompareDrawer/ducks';
import PaymentTermsTab, { PaymentTermsFormData } from './PaymentTerms';
import NewVendorForm from './NewProvider';
import BidsForm from '@src/views/DrawerBidsForm';
import Loader from '@src/components/Loader';
import { Vendor, Category } from '@src/firebase/ducks';
import { FormattedMessage } from 'react-intl';

interface CompareDrawerProps extends CompareDrawerState {
  vendor: Vendor;
  category: Category;
  categories: Category[];
}
interface CompareDrawerCallbacks {
  switchTab: (tab: 'bids' | 'paymentTerms') => void;
  savePaymentMilestones: (vendor: Vendor) => (values: PaymentTermsFormData) => void;
  saveBids: (vendor: Vendor) => (values: any) => void;
  saveCustomVendor: () => void;
  changeCustomVendorCategory: (id: string) => void;
}

class CompareDrawer extends Component<CompareDrawerProps & CompareDrawerCallbacks> {
  shouldComponentUpdate(nextProps) {
    return !equals(this.props, nextProps);
  }

  render() {
    const isBusy =
      this.props.savePaymentStatus.isBusy ||
      this.props.saveBidsStatus.isBusy ||
      this.props.saveCustomVendorStatus.isBusy;
    const { activeTab, vendor, category } = this.props;

    if (!vendor) {
      return null;
    }

    return (
      <div className="compare-drawer">
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
          {vendor.isCustom && (
            <NewVendorForm
              categories={this.props.categories}
              onChangeCategory={this.props.changeCustomVendorCategory}
              initialValues={vendor || {}}
            />
          )}
          {!vendor.isCustom && (
            <div className="drawer-tab-body-heading">
              <h3>{category.name}</h3>
              <span className="phone">
                <FormattedMessage id="drawer.phoneTitle" />:{vendor.vendor.phone}
              </span>
            </div>
          )}

          {this.props.activeTab === 'bids' && (
            <BidsForm
              vendor={this.props.vendor}
              category={this.props.category}
              onSubmit={
                !vendor.isCustom ? this.props.saveBids(vendor) : this.props.saveCustomVendor
              }
            />
          )}
          {this.props.activeTab === 'paymentTerms' && (
            <PaymentTermsTab
              initialValues={{
                advance: Number(pathOr(0, ['paymentMilestones', 'advance', 'amount'], vendor)),
                second: Number(pathOr(0, ['paymentMilestones', 'second', 'amount'], vendor)),
                final: Number(pathOr(0, ['paymentMilestones', 'final', 'amount'], vendor))
              }}
              onSubmit={
                !vendor.isCustom
                  ? this.props.savePaymentMilestones(vendor)
                  : this.props.saveCustomVendor
              }
            />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (
  state: State,
  props: Partial<CompareDrawerProps>
): Partial<CompareDrawerProps> => {
  const vendor = props.vendor;
  let category = Object.values(state.firebase.categories)[0];

  if (vendor.vendor && vendor.vendor.categoryId) {
    category = state.firebase.categories[props.vendor.vendor.categoryId];
  }

  if (state.compareDrawer.customVendorCategoryId) {
    category = state.firebase.categories[state.compareDrawer.customVendorCategoryId];
  }

  return {
    ...state.compareDrawer,
    categories: Object.values(state.firebase.categories),
    category
  };
};

const mapDispatchToProps = (dispatch): CompareDrawerCallbacks => ({
  switchTab: (tab) => dispatch(switchTab(tab)),
  savePaymentMilestones: (vendor: Vendor) => (values) =>
    dispatch(savePaymentMilestones.start({ vendor, values })),
  saveBids: (vendor: Vendor) => (values) => dispatch(saveBids.start({ vendor, values })),
  saveCustomVendor: () => dispatch(saveCustomCompareVendor.start()),
  changeCustomVendorCategory: (id: string) => dispatch(changeCustomVendorCategoryId(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(CompareDrawer);
