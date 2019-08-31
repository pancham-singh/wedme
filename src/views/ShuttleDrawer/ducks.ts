import { createReducer, createAction, createDuck } from 'yapreact/utils';
import { DuckStateNode } from 'yapreact/utils/createDuck';

export interface ShuttleDrawerState {
  shuttleSubmission: DuckStateNode<null>;
}

const saveShuttleDuck = createDuck('SAVE_SHUTTLE');

const initialState: Partial<ShuttleDrawerState> = {};

const ducks = {
  shuttleSubmission: saveShuttleDuck
};

export const saveShuttle = saveShuttleDuck.actions;

export default createReducer({}, { initialState, ducks });
