import * as React from 'react';
import { Switch, Route, Redirect, Link } from 'react-router-dom';
import ProtectedRoute from 'yapreact/components/ProtectedRoute';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import LoginForm from '@src/views/LoginForm';
import SignupForm from '@src/views/SignupForm';
import ForgotPassword from '@src/views/ForgotPassword';
import { isLoggedIn, State } from '@src/ducks';
import { User } from '@src/firebase/ducks';
import { logout } from '@src/firebase/ducks';

const logoImg = require('@src/images/logo.png');
const logoImgSvg = require('@src/images/logo.svg');
const profileImg = require('@src/images/profile-image.png');
const wedmeImg = require('@src/images/wedme.png');
const wedmeImgSvg = require('@src/images/wedme.svg');

interface PublicLayoutProps {
  user?: User;
  isLoggedIn: boolean;
}

interface PublicLayoutCallbacks {
  logout: () => void;
}

const PublicLayout = ({ isLoggedIn, logout, user }: PublicLayoutProps & PublicLayoutCallbacks) => {
  return (
    <div id="mainContainer">
      <div className="page without-login">
        <Switch>
          <Route path="/login/forgot-password" exact component={ForgotPassword} />
          <Route path="/login" exact component={LoginForm} />

          <Route path="/signup" component={SignupForm} />
        </Switch>

        <nav className="navigation-right" />
      </div>
    </div>
  );
};

const mapStateToProps = (state: State): PublicLayoutProps => ({
  isLoggedIn: isLoggedIn(state),
  user: isLoggedIn(state) ? state.firebase.user : null
});

const mapDispatchToProps = (dispatch): PublicLayoutCallbacks => ({
  logout: () => dispatch(logout.start())
});

export default connect(mapStateToProps, mapDispatchToProps)(PublicLayout);
