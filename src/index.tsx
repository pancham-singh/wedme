/* globals document */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { IntlProvider, addLocaleData } from 'react-intl';
import { Route } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';

import { locale } from './config';
import * as translations from './translations';
import configureStore from './configureStore';
import App from './views/App';

import './styles/base.scss';
import { login } from '@src/firebase/ducks';

const history = createHistory();
const store = configureStore(history);

// Firebase automatically tries to login. We dispatch this action to show the
// loader in the beginning
store.dispatch(login.start());

addLocaleData(locale.data);

ReactDOM.render(
  <IntlProvider locale={locale.name} messages={translations[locale.name]}>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Route path="/" component={App} />
      </ConnectedRouter>
    </Provider>
  </IntlProvider>,
  document.querySelector('#root')
);
