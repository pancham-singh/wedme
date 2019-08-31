import { createAction, createReducer } from 'yapreact/utils';
import { AnyAction } from 'redux';
import { YapAction, YapActionCreator } from 'yapreact/utils/createAction';

export interface PopupProps {
  id: string;
  title: string;
  subtitle: string;
  successButton: string;
  cancelButton: string;
  successAction: YapAction<any> | Array<YapAction<any>>;
  cancelAction: YapAction<any> | Array<YapAction<any>>;
  closeAction: YapAction<any> | Array<YapAction<any>>;
}

export interface PopupState {
  [id: string]: PopupProps;
}

export const closePopup = createAction('POPUP_CLOSE');
export const showPopup: YapActionCreator<PopupProps> = createAction('POPUP_SHOW');

interface ShowPopupInput {
  id?: string;
  title: string;
  subtitle: string;
  successButton: string;
  cancelButton: string;
  successAction: YapAction<any> | Array<YapAction<any>>;
  cancelAction: YapAction<any> | Array<YapAction<any>>;
  closeAction: YapAction<any> | Array<YapAction<any>>;
}
export const makePopup = (popupInput: ShowPopupInput): PopupProps => {
  return {
    ...popupInput,
    id: popupInput.id || String(new Date().getTime())
  };
};

const initialState: PopupState = {};

export default createReducer(
  {
    [closePopup().type]: (state, { payload: popup }: YapAction<PopupProps>) => {
      const nextState = {
        ...state
      };
      delete nextState[popup.id];

      return nextState;
    },
    [showPopup().type]: (state, { payload: popup }: YapAction<PopupProps>) => ({
      ...state,
      [popup.id]: popup
    })
  },
  { initialState }
);
