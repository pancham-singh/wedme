import { Observable } from 'rxjs/Observable';
import {
  deleteBudget,
  togglePaidAdditionalExpense,
  togglePaidMilestone,
  changeBudget,
  createAdditionalExpense,
  addProvider,
  deleteAdditionalExpense
} from '@src/views/Budget/ducks';
import { Epic, combineEpics } from 'redux-observable';
import { YapAction } from 'yapreact/utils/createAction';
import { State } from '@src/ducks';
import { Vendor, AdditionalExpense } from '@src/firebase/ducks';
import firebaseApp from '@src/firebase';
import firebaseErrorMsg from '@src/lib/firebaseErrorMsg';
import { FirebaseError } from 'firebase';
import { reset } from 'redux-form';

const removeFromBudgetEpic: Epic<YapAction<any>, State> = (action$, { getState }) =>
  action$.ofType(deleteBudget.start().type).mergeMap(({ payload: v }: { payload?: Vendor }) => {
    const uid = getState().firebase.user.uid;
    const path = `${firebaseApp.dbPaths.vendors(uid)}/${v.vendor.categoryId}/${v.vendor.id}`;
    const ref = firebaseApp.app.database().ref(path);

    return ref
      .remove()
      .then(() => deleteBudget.success())
      .catch((err) => deleteBudget.fail(firebaseErrorMsg(err)));
  });

const togglePaidAdditionalExpenseEpic: Epic<YapAction<any>, State> = (action$, { getState }) =>
  action$
    .ofType(togglePaidAdditionalExpense.start().type)
    .mergeMap(({ payload: exp }: { payload?: AdditionalExpense }) => {
      const uid = getState().firebase.user.uid;
      const path = `${firebaseApp.dbPaths.additionalExpenses(uid)}/${exp.id}`;
      const ref = firebaseApp.app.database().ref(path);

      return ref
        .update({ isPaid: !exp.isPaid })
        .then(() => togglePaidAdditionalExpense.success())
        .catch((err) => togglePaidAdditionalExpense.fail(firebaseErrorMsg(err)));
    });

const togglePaidMilestoneEpic: Epic<YapAction<any>, State> = (action$, { getState }) =>
  action$
    .ofType(togglePaidMilestone.start().type)
    .mergeMap(
      ({
        payload: { vendor: v, milestone }
      }: {
        payload?: { vendor: Vendor; milestone: string };
      }) => {
        const uid = getState().firebase.user.uid;
        const path = `${firebaseApp.dbPaths.vendors(uid)}/${v.vendor.categoryId}/${
          v.vendor.id
        }/paymentMilestones/${milestone}`;
        const ref = firebaseApp.app.database().ref(path);

        return ref
          .update({ isPaid: !v.paymentMilestones[milestone].isPaid })
          .then(() => togglePaidMilestone.success())
          .catch((err) => togglePaidMilestone.fail(firebaseErrorMsg(err)));
      }
    );

const changeBudgetEpic: Epic<YapAction<any>, State> = (action$, { getState }) =>
  action$.ofType(changeBudget.start().type).mergeMap(({ payload: newBudget }) => {
    const uid = getState().firebase.user.uid;
    const path: string = `${firebaseApp.dbPaths.profile(uid)}/budget`;
    const ref = firebaseApp.app.database().ref(path);

    return ref
      .update({
        amount: Number(newBudget)
      })
      .then(() => changeBudget.success())
      .catch((err: FirebaseError) => changeBudget.fail(firebaseErrorMsg(err)));
  });

const createAdditionalExpenseEpic: Epic<YapAction<any>, State> = (action$, { getState }) =>
  action$
    .ofType(createAdditionalExpense.start().type)
    .mergeMap(({ payload: values }) => {
      const userId = getState().firebase.user.uid;
      const refPath = `${firebaseApp.dbPaths.additionalExpenses(userId)}`;
      let ref = firebaseApp.app.database().ref(refPath);

      if (!values.id) {
        ref = ref.push();
      } else {
        // Update instead of create
        ref = ref.child(values.id);
      }

      return ref
        .update({ ...values, amount: Number(values.amount) })
        .then(() => [createAdditionalExpense.success(), reset('AdditionalExpenseForm')])
        .catch((err: FirebaseError) => [createAdditionalExpense.fail(firebaseErrorMsg(err))]);
    })
    .mergeMap((xs) => Observable.from(xs));

const addCustomProviderEpic: Epic<YapAction<any>, State> = (action$, { getState }) =>
  action$
    .ofType(addProvider.start().type)
    .mergeMap(({ payload: values }) => {
      const state = getState();
      const userId = state.firebase.user.uid;
      const category = state.firebase.categories[values.vendor.categoryId];
      const refPath = `${firebaseApp.dbPaths.vendors(userId)}/${values.categoryId}`;
      let ref = firebaseApp.app.database().ref(refPath);

      if (!values.id) {
        ref = ref.push();
      } else {
        // Update instead of create
        ref = ref.child(values.id);
      }

      return ref
        .update({
          id: ref.key,
          isCustom: true,
          isSelected: true,
          vendor: {
            id: ref.key,
            categoryId: values.categoryId,
            categoryName: category.name,
            ...(values.vendor || {})
          },
          paymentMilestones: {
            advance: {
              isPaid: values.paymentMilestones.advance.isPaid,
              amount: Number(values.paymentMilestones.advance.amount)
            },
            second: {
              isPaid: values.paymentMilestones.second.isPaid,
              amount: Number(values.paymentMilestones.second.amount)
            },
            final: {
              isPaid: values.paymentMilestones.final.isPaid,
              amount: Number(values.paymentMilestones.final.amount)
            }
          },
          bids: values.bids || {}
        })
        .then(() => [addProvider.success(), reset('AddProviderForm')])
        .catch((err: FirebaseError) => [addProvider.fail(firebaseErrorMsg(err))]);
    })
    .mergeMap((xs) => Observable.from(xs));

const deleteExpenseEpic: Epic<YapAction<any>, State> = (action$, { getState }) =>
  action$.ofType(deleteAdditionalExpense.start().type).mergeMap(({ payload: id }) => {
    const uid = getState().firebase.user.uid;
    const path = `${firebaseApp.dbPaths.additionalExpenses(uid)}/${id}`;
    const ref = firebaseApp.app.database().ref(path);

    return ref
      .remove()
      .then(() => deleteAdditionalExpense.success())
      .catch((err) => deleteAdditionalExpense.fail(firebaseErrorMsg(err)));
  });

export default combineEpics(
  removeFromBudgetEpic,
  togglePaidAdditionalExpenseEpic,
  togglePaidMilestoneEpic,
  changeBudgetEpic,
  createAdditionalExpenseEpic,
  addCustomProviderEpic,
  deleteExpenseEpic
);
