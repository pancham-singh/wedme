import { createReducer, createAction, createDuck } from 'yapreact/utils';
import { DuckStateNode } from 'yapreact/utils/createDuck';

export interface InviteDrawerState {
  inviteSubmission: DuckStateNode<null>;
}

const saveInvitationDuck = createDuck('SAVE_INVITATION');

const initialState: Partial<InviteDrawerState> = {};

const ducks = {
  inviteSubmission: saveInvitationDuck
};

export const saveInvitation = saveInvitationDuck.actions;

export default createReducer({}, { initialState, ducks });
