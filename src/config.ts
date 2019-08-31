export const isProduction = REACT_APP_ENV === 'production';

export const firebase = {
  name: 'WedMeWeb',
  apiKey: 'AIzaSyAEpBL317np0hSaMfbF1hOT9IF4oALkUTU',
  authDomain: 'wedme-c589a.firebaseapp.com',
  databaseURL: 'https://wedme-c589a.firebaseio.com',
  projectId: 'wedme-c589a',
  storageBucket: 'wedme-c589a.appspot.com',
  messagingSenderId: '540884322130'
};
export const locale = {
  name: 'he',
  data: require('react-intl/locale-data/he')
};
