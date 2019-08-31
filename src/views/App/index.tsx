import * as React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import ProtectedRoute from 'yapreact/components/ProtectedRoute';
import { connect } from 'react-redux';

import PublicLayout from '../PublicLayout';
import UserLayout from '../UserLayout';
import { isLoggedIn, State } from '@src/ducks';
import { User } from '@src/firebase/ducks';
import { logout, AuthState } from '@src/firebase/ducks';
import Loader from '@src/components/Loader';
import Popups from '@src/components/Popup';
import { AnyAction } from 'redux';
import { PopupState } from '@src/components/Popup/ducks';

const profileImg = require('@src/images/profile-image.png');
const wedmeImg = require('@src/images/wedme.png');
const wedmeImgSvg = require('@src/images/wedme.svg');

interface AppProps {
  auth: AuthState;
  user?: User;
  isLoggedIn: boolean;
  popups: PopupState;
}

interface AppCallbacks {
  logout: () => void;
  dispatch: (action: AnyAction) => void;
}

const App = ({ isLoggedIn, logout, user, auth, dispatch, popups }: AppProps & AppCallbacks) => {
  return (
    <div>
      <Loader isVisible={auth.logout.isBusy || auth.login.isBusy} />

      <Popups popups={popups} dispatch={dispatch} />

      <Switch>
        <ProtectedRoute
          canProceed={!isLoggedIn}
          redirectToPath="/user/profile"
          path="/login"
          component={PublicLayout}
        />
        <ProtectedRoute
          canProceed={!isLoggedIn}
          redirectToPath="/user/profile"
          path="/signup"
          component={PublicLayout}
        />

        <ProtectedRoute
          path="/user"
          canProceed={isLoggedIn}
          redirectToPath="/login"
          component={UserLayout}
        />
        <Redirect path="/" exact to="/login" />
      </Switch>
    </div>
  );
};

const mapStateToProps = (state: State): AppProps => ({
  auth: state.firebase.auth,
  isLoggedIn: isLoggedIn(state),
  user: isLoggedIn(state) ? state.firebase.user : null,
  popups: state.popups
});

const mapDispatchToProps = (dispatch): AppCallbacks => ({
  logout: () => dispatch(logout.start()),
  dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
