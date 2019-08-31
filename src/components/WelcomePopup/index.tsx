import * as React from 'react';
import { FormattedMessage } from 'react-intl';
const logoSvg = require('@src/images/logo.svg');

type Status = 'starting' | 'started' | 'none';

interface Props {}
interface Callbacks {
  onSelect: (status: Status) => void;
}

const WelcomePopup = (props: Props & Callbacks) => (
  <div className="welcome-popup-container">
    <div className="welcome-popup">
      <div className="content">
        <div className="text-right logo">
          <img src={logoSvg} />
        </div>
        <h1 className="title main">
          <FormattedMessage id="welcomePopup.title" />
        </h1>
        <p className="welcome-text">
          <FormattedMessage id="welcomePopup.description.line1" />
          <br />
          <FormattedMessage id="welcomePopup.description.line2" />
          <br />
          <FormattedMessage id="welcomePopup.description.line3" />
        </p>

        <p className="welcome-note">
          <FormattedMessage id="welcomePopup.note" />
        </p>

        <button onClick={() => props.onSelect('starting')} className="btn outline">
          <FormattedMessage id="welcomePopup.starting" />
        </button>
        <button onClick={() => props.onSelect('started')} className="btn outline">
          <FormattedMessage id="welcomePopup.started" />
        </button>
        <button onClick={() => props.onSelect('none')} className="btn outline">
          <FormattedMessage id="welcomePopup.none" />
        </button>
      </div>
      <div className="image" />
    </div>
  </div>
);

export default WelcomePopup;
