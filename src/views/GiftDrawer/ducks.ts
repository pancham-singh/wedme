import { createReducer, createAction, createDuck } from 'yapreact/utils';
import { DuckStateNode } from 'yapreact/utils/createDuck';

export interface GiftDrawerState {
  giftSubmission: DuckStateNode<null>;
}

const saveGiftDuck = createDuck('SAVE_GIFT');

const initialState: Partial<GiftDrawerState> = {};

const ducks = {
  giftSubmission: saveGiftDuck
};

export const saveGift = saveGiftDuck.actions;

export default createReducer({}, { initialState, ducks });
