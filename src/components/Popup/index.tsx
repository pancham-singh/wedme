import * as React from 'react';
import { PopupState, PopupProps } from './ducks';
import { Dispatch, AnyAction } from 'redux';

interface PopupCallbacks {
  onSuccess: () => void;
  onCancel: () => void;
  onClose: () => void;
}

const Popup = (props: PopupProps & PopupCallbacks) => {
  return (
    <div className="popup-container">
      <div className="popup center">
        <span className="close" onClick={props.onClose} />

        <h1>{props.title}</h1>
        <p>{props.subtitle}</p>
        <div className="text-center">
          <button onClick={props.onCancel} className="btn outline">
            {props.cancelButton}
          </button>
          <button onClick={props.onSuccess} className="btn primary">
            {props.successButton}
          </button>
        </div>
      </div>
    </div>
  );
};

interface PopupContainerProps {
  popups: PopupState;
  dispatch: (action: AnyAction) => void;
}

const PopupContainer = ({ popups, dispatch }: PopupContainerProps) => {
  const dispatcher = (action) => () => {
    if (Array.isArray(action)) {
      action.forEach((a) => {
        dispatch(a);
      });
    } else {
      dispatch(action);
    }
  };
  const popupIds = Object.keys(popups);

  if (!popupIds.length) {
    return null;
  }

  return (
    <div className="popups-container">
      {popupIds.map((id) => (
        <Popup
          key={id}
          onSuccess={dispatcher(popups[id].successAction)}
          onCancel={dispatcher(popups[id].cancelAction)}
          onClose={dispatcher(popups[id].closeAction)}
          {...popups[id]}
        />
      ))}
    </div>
  );
};

export default PopupContainer;
