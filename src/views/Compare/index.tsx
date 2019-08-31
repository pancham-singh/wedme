import * as React from 'react';
import * as classnames from 'classnames';
import { Component, SyntheticEvent } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { State } from '@src/ducks';
import { User, Category, Vendor } from '@src/firebase/ducks';
import {
  CompareViewState,
  toggleCompareDrawer,
  changeSelectedVendorId,
  selectVendor,
  removeFromComparison,
  toggleBigPlusMenu,
  showCompareDrawer
} from './ducks';
import { locale } from '@src/config';
import slugify from '@src/lib/slugify';
import Loader from '@src/components/Loader';
import capitalize from '@src/lib/capitalize';
import Drawer from '@src/components/Drawer';
import CompareDrawer from '@src/views/CompareDrawer';
import BigPlusMenu from '@src/components/BigPlusMenu';
import { DuckStateNode } from 'yapreact/utils/createDuck';
import { FormattedMessage } from 'react-intl';
import { push } from 'react-router-redux';
import downloadStrAsCsv from '@src/lib/downloadStrAsCsv';
import addRowToCsv from '@src/lib/addRowToCsv';

const downloadImg = require('@src/images/icons/ic-excel@3x.png');
const downloadSvg = require('@src/images/icons/ic-excel.svg');
const deleteImg = require('@src/images/icons/ic-tresh@3x.png');
const deleteSvg = require('@src/images/icons/ic-tresh.svg');
const editImg = require('@src/images/icons/ic-edit@3x.png');
const editSvg = require('@src/images/icons/ic-edit.svg');

interface CompareProps extends CompareViewState {
  user: User;
  categories: Category[];
  activeCategory: Category;
  initialValues: any;
  vendors: Vendor[];
  allVendors: Vendor[];
  vendorsFetchStatus: DuckStateNode<null>;
  categoriesFetchStatus: DuckStateNode<null>;
}

interface CompareCallbacks {
  toggleDrawer: () => void;
  changeSelectedVendorId: (vendorId: string) => void;
  selectVendor: (v: Vendor) => void;
  removeFromComparison: (v: Vendor) => void;
  redirectToAllCategories: () => void;
  toggleBigPlusMenu: () => void;
  showCustomVendorDrawer: () => void;
}

interface VendorField {
  title: string;
  titleEnglish: string;
  path: string;
}

const vendorFields: VendorField[] = [
  { title: 'ספק', titleEnglish: 'Provider', path: 'businessName' },
  { title: 'מיקום', titleEnglish: 'Location', path: 'city' },
  { title: 'ציון', titleEnglish: 'Grade', path: 'rating' },
  { title: 'טלפון', titleEnglish: 'Phone', path: 'phone' }
];

class Compare extends Component<CompareProps & CompareCallbacks> {
  componentWillUpdate() {
    if (!this.props.vendors.length && this.props.allVendors.length) {
      this.props.redirectToAllCategories();
    }
  }

  csvHead = '';
  csvBody = '';

  categoryLinks = () => {
    const categories = this.props.categories;

    if (!categories.length) {
      return <a className="active">General</a>;
    }

    return categories.map((c) => (
      <Link
        to={`/user/comparison/${slugify(c.englishName)}`}
        key={c.id}
        className={
          this.props.activeCategory && this.props.activeCategory.id === c.id ? 'active' : ''
        }
      >
        {locale.name === 'en' ? c.englishName : c.name}
      </Link>
    ));
  };

  selectVendor = (vendor: Vendor) => (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    this.props.selectVendor(vendor);
  };

  tableHeads = () => {
    const category = this.props.activeCategory;
    const hasBidsForm = category && category.forms && category.forms.bids;

    let formHeads;
    let csvHead = '';
    const bidTitles = hasBidsForm
      ? Object.values((category.forms.bids || {}).properties).map(
          (x) => (locale.name === 'en' && x.titleEnglish ? x.titleEnglish : x.title) || ''
        )
      : [];

    formHeads = bidTitles.length
      ? bidTitles.map((bid) => <th key={bid}>{capitalize(bid)}</th>)
      : [];

    bidTitles.reverse().forEach((bt) => (csvHead += `${bt},`));
    vendorFields.forEach((f) => (csvHead = `${f.title},${csvHead}`));

    this.csvHead = csvHead;

    let vendorsHeads = vendorFields.map((f) => <th key={f.title}>{f.title}</th>);

    vendorsHeads = formHeads.concat(vendorsHeads);

    return vendorsHeads;
  };

  tableRows = () => {
    const category = this.props.activeCategory;
    let csvRows = '';

    const rows = this.props.vendors.map((v) => {
      const vendorTds = vendorFields.map((f) => (
        <td key={`${f.title}-${v.id}`}>{v.vendor[f.path]}</td>
      ));

      const hasBidsForm = category && category.forms && category.forms.bids;
      const bidKeys = hasBidsForm && Object.keys(category.forms.bids.properties);
      const bidValues = (hasBidsForm && v.bids) || {};

      let categoryTds = hasBidsForm
        ? bidKeys.map((bid) => <td key={`${bid}-${v.id}`}>{bidValues[bid] || ''}</td>)
        : [];

      const tds = categoryTds.concat(vendorTds);

      // remove last <td> so we can manually add one
      tds.shift();

      const firstTdValue = hasBidsForm ? bidValues[bidKeys[0]] : v.vendor[vendorFields[0].path];
      tds.unshift(
        <td className="actions" key={`${firstTdValue}-${v.id}`}>
          {firstTdValue}
          <span
            className={classnames('checkbox', { selected: v.isSelected })}
            onClick={this.selectVendor(v)}
          />
        </td>
      );

      // Add values to the csv
      let csvRow = '';
      vendorFields.forEach((f) => {
        csvRow = `${v.vendor[f.path] || ''},${csvRow}`;
      });
      if (hasBidsForm) {
        Object.values(bidValues)
          .reverse()
          .forEach((v) => {
            csvRow += `${v || ''},`;
          });
      }

      csvRows = addRowToCsv(csvRows, csvRow);

      return (
        <tr
          key={v.id}
          onClick={() => this.props.changeSelectedVendorId(v.id)}
          className={v.id === this.props.selectedVendorId ? 'active' : ''}
        >
          {tds}
        </tr>
      );
    });

    this.csvBody = csvRows;

    return rows;
  };

  tipsJsx = () => {
    const tips = Object.values((this.props.activeCategory && this.props.activeCategory.tips) || {});

    if (!tips.length) {
      return null;
    }

    return (
      <div className="text-right">
        <section title="Tips" className="tips-box">
          <h1>
            <label>{tips.length}</label>
            <span className="step1">
              <FormattedMessage id="compare.tips.step1" />
            </span>
            <span className="step2">
              <FormattedMessage id="compare.tips.step2" />
            </span>
            {locale.name === 'en'
              ? this.props.activeCategory.englishName
              : this.props.activeCategory.name}
          </h1>

          <ul>
            {tips.map((tip, index) => (
              <li key={index}>
                <span className="count">#{index + 1}</span> {tip}
              </li>
            ))}
          </ul>
        </section>
      </div>
    );
  };

  drawerJsx = () => {
    const selectedVendor = this.props.vendors.find(
      (v) => v.vendor.id === this.props.selectedVendorId
    );

    const vendor = selectedVendor || {
      isCustom: true,
      vendor: {}
    };
    const shallShowDrawer = this.props.drawer.isOpen || this.props.selectedVendorId;

    return (
      shallShowDrawer && (
        <Drawer {...this.props.drawer} onToggle={this.props.toggleDrawer}>
          <CompareDrawer vendor={vendor} />
        </Drawer>
      )
    );
  };

  render() {
    const { user, initialValues } = this.props;
    const selectedVendor = this.props.vendors.find(
      (v) => v.vendor.id === this.props.selectedVendorId
    );

    const isBusy =
      this.props.selectVendorStatus.isBusy ||
      this.props.vendorsFetchStatus.isBusy ||
      this.props.categoriesFetchStatus.isBusy;
    const error =
      this.props.selectVendorStatus.error ||
      this.props.vendorsFetchStatus.error ||
      this.props.categoriesFetchStatus.error;
    const vendors = this.props.vendors;

    return (
      <div className="container-with-drawer">
        <BigPlusMenu {...this.props.bigPlusMenu} onToggle={this.props.toggleBigPlusMenu}>
          <li className="big-plus-menu__list__item" onClick={this.props.toggleDrawer}>
            <FormattedMessage id="compare.bigPlusMenu.provider" />
          </li>
        </BigPlusMenu>

        {this.drawerJsx()}

        {!vendors.length && (
          <section id="compare">
            <Loader isVisible={isBusy} />
            {error && <div className="error">{error}</div>}

            <h1 className="title main">
              <FormattedMessage id="compare.title" />
            </h1>
            <h2 className="table">
              <FormattedMessage id="compare.noVendorMessage" />
            </h2>
          </section>
        )}

        {vendors.length && (
          <div id="compare">
            <Loader isVisible={isBusy} />

            <section id="compare">
              {error && <div className="error">{error}</div>}

              <h1 className="title main">
                <FormattedMessage id="compare.title" />
              </h1>
              <div className="table-links-wrapper">
                <div className="table-links">{this.categoryLinks()}</div>
              </div>
              <div className="table-controls">
                <div className="icons">
                  {selectedVendor && (
                    <a onClick={() => this.props.removeFromComparison(selectedVendor)}>
                      <img src={deleteSvg} />
                    </a>
                  )}
                  {
                    <a
                      onClick={() =>
                        downloadStrAsCsv(
                          addRowToCsv(this.csvHead, this.csvBody),
                          'comparing-vendors.csv'
                        )
                      }
                    >
                      <img src={downloadSvg} />
                    </a>
                  }
                </div>
              </div>
              <table className="table table-light">
                <thead>
                  <tr>{this.tableHeads()}</tr>
                </thead>
                <tbody>{this.tableRows()}</tbody>
              </table>

              {this.props.activeCategory && this.tipsJsx()}
            </section>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (
  { firebase: { ui, user, categories: allCategories, vendors: allVendors }, compareView }: State,
  props
): CompareProps => {
  const activeCategory = Object.values(allCategories).find(
    (c) => slugify(c.englishName) === props.match.params.activeCategory
  );

  const vendors = Object.values(allVendors).filter(
    (v) => !activeCategory || v.vendor.categoryId === activeCategory.id
  );
  // .filter((v) => !v.isCustom);

  const categories = Object.values(allVendors).reduce((accum, v) => {
    if (
      allCategories[v.vendor.categoryId] &&
      !accum.find((c: Category) => c.id === v.vendor.categoryId)
    ) {
      accum.push(allCategories[v.vendor.categoryId]);
    }

    return accum;
  }, []);

  return {
    ...compareView,
    categoriesFetchStatus: ui.categories,
    vendorsFetchStatus: ui.vendors,
    user,
    categories,
    activeCategory,
    initialValues: {
      email: user.email,
      phoneNumber: user.phoneNumber
    },
    allVendors: Object.values(allVendors),
    vendors
  };
};

const mapDispatchToProps = (dispatch): CompareCallbacks => ({
  toggleDrawer: () => dispatch(toggleCompareDrawer()),
  changeSelectedVendorId: (vendorId) => dispatch(changeSelectedVendorId(vendorId)),
  selectVendor: (vendor) => dispatch(selectVendor.start(vendor)),
  removeFromComparison: (vendor) => dispatch(removeFromComparison.start(vendor)),
  redirectToAllCategories: () => dispatch(push('/user/comparison')),
  toggleBigPlusMenu: () => dispatch(toggleBigPlusMenu()),
  showCustomVendorDrawer: () => {
    dispatch(changeSelectedVendorId(null));
    dispatch(showCompareDrawer());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Compare);
