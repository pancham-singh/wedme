import { selectVendor, removeFromComparison } from './ducks';
import { Observable } from 'rxjs/Observable';
import '@src/rxjs-imports';
import firebaseApp from '@src/firebase';
import { LOCATION_CHANGE } from 'react-router-redux';
import { Epic, combineEpics } from 'redux-observable';
import { YapAction } from 'yapreact/utils/createAction';
import { State } from '@src/ducks';
import { Vendor } from '@src/firebase/ducks';
import { FirebaseError } from 'firebase';
import firebaseErrorMsg from '@src/lib/firebaseErrorMsg';
import slugify from '@src/lib/slugify';

const selectVendorEpic: Epic<YapAction<any>, State> = (action$, { getState }) =>
  action$.ofType(selectVendor.start().type).mergeMap(({ payload: v }: { payload?: Vendor }) => {
    const uid = getState().firebase.user.uid;

    const path = `${firebaseApp.dbPaths.vendors(uid)}/${v.vendor.categoryId}/${v.vendor.id}`;
    const ref = firebaseApp.app.database().ref(path);

    return ref
      .update({ isSelected: !v.isSelected })
      .then(() => selectVendor.success())
      .catch((err: FirebaseError) => selectVendor.fail(firebaseErrorMsg(err)));
  });

const removeFromComparisonEpic: Epic<YapAction<any>, State> = (action$, { getState }) =>
  action$
    .ofType(removeFromComparison.start().type)
    .mergeMap(({ payload: v }: { payload?: Vendor }) => {
      const state = getState();
      const uid = state.firebase.user.uid;
      const path = `${firebaseApp.dbPaths.vendors(uid)}/${v.vendor.categoryId}/${v.vendor.id}`;
      const ref = firebaseApp.app.database().ref(path);

      const allCategories = state.firebase.categories;

      return ref
        .remove()
        .then(() => removeFromComparison.success())
        .catch((err) => removeFromComparison.fail(firebaseErrorMsg(err)));
    });

export default combineEpics(selectVendorEpic, removeFromComparisonEpic);
