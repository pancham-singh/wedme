import * as React from 'react';
import * as classnames from 'classnames';
import he from 'fecha-locales/locales/he';
import { format } from 'fecha';
import { Switch, Route, Redirect } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { pathOr } from 'ramda';
import ProtectedRoute from 'yapreact/components/ProtectedRoute';
import { connect } from 'react-redux';

import ProfileForm from '@src/views/Profile';
import Budget from '@src/views/Budget';
import Compare from '@src/views/Compare';
import Invitation from '@src/views/Invitation';
import BillingForm from '@src/views/BillingForm';
import Gift from '@src/views/Gift';
import { isLoggedIn, State } from '@src/ducks';
import { User } from '@src/firebase/ducks';
import { logout } from '@src/firebase/ducks';
import { FormattedMessage } from 'react-intl';

const profileImg = require('@src/images/profile-image.png');

const wedmeImg = require('@src/images/wedme.png');
const wedmeImgSvg = require('@src/images/wedme.svg');

interface UserLayoutProps {
  user?: User;
  isLoggedIn: boolean;
  eventDate: Date;
  eventDateStr: string;
}

interface UserLayoutCallbacks {
  logout: () => void;
}

const UserLayout = (props: UserLayoutProps & UserLayoutCallbacks) => {
  const numDays = Math.round(
    (props.eventDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div id="mainContainer">
      <div className="page">
        <div className="left-section">
          <nav className="top no-print">
            <div className="profile-block">
              <label>{props.user.displayName}</label>
              <span className="profile">
                <img
                  src={props.user.photoURL ? props.user.photoURL : profileImg}
                  alt="profile image"
                />
              </span>
              <label>
                <FormattedMessage id="download.linkText" />
              </label>
            </div>
          </nav>

          <div className="content">
            <Switch>
              <Route path="/user/profile" exact component={ProfileForm} />
              <Route path="/user/invitation" component={Invitation} />
              <Route path="/user/gift" component={Gift} />
              <Route path="/user/budget" exact component={Budget} />
              <Route path="/user/comparison" exact component={Compare} />
              <Route path="/user/comparison/:activeCategory" exact component={Compare} />
              <Route path="/user/billing/:planName" exact component={BillingForm} />

              <Redirect to="/signup" />
            </Switch>
          </div>
        </div>
        <nav className="navigation-right no-print">
          <div className="title-box">
            <h1 className="heading">
              {numDays === 0 && <FormattedMessage id="rightNav.greeting.today" />}
              {numDays > 0 && (
                <FormattedMessage id="rightNav.greeting.future" values={{ numDays }} />
              )}
              {numDays < 0 && (
                <FormattedMessage
                  id="rightNav.greeting.past"
                  values={{ numDays: Math.abs(numDays) }}
                />
              )}
            </h1>
            <span className="subheading">{props.eventDateStr}</span>
          </div>

          <div id="brand">
            <object data={wedmeImgSvg} type="image/svg+xml">
              <img src={wedmeImg} />
            </object>
          </div>
          <ul>
            <li>
              <NavLink to="/user/comparison">
                <FormattedMessage id="sidebar.comparison" />
                <i className="icon comparison" />
              </NavLink>
            </li>
            <li>
              <NavLink to="/user/budget">
                <FormattedMessage id="sidebar.budget" />
                <i className="icon budget" />
              </NavLink>
            </li>
            <li>
              <NavLink to="/user/invitation">
                <FormattedMessage id="sidebar.invited" />
                <i className="icon invited" />
              </NavLink>
            </li>
            <li>
              <NavLink to="/user/profile">
                <FormattedMessage id="sidebar.profile" />
                <i className="icon profile" />
              </NavLink>
            </li>
            <li onClick={props.logout}>
              <FormattedMessage id="sidebar.logout" />
              <i className="icon logout" />
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

const mapStateToProps = (state: State): UserLayoutProps => {
  const eventDate = new Date(pathOr(new Date(), ['event', 'date'], state.firebase.profile));

  return {
    isLoggedIn: isLoggedIn(state),
    user: isLoggedIn(state) ? state.firebase.user : null,
    eventDate,
    eventDateStr: format(eventDate, 'MMMM DD, YYYY', he)
  };
};

const mapDispatchToProps = (dispatch): UserLayoutCallbacks => ({
  logout: () => dispatch(logout.start())
});

export default connect(mapStateToProps, mapDispatchToProps)(UserLayout);
