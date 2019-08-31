import * as React from 'react';
import { connect } from 'react-redux';
import * as classnames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { NavLink } from 'react-router-dom';
import { selectLanguage, SendSmsViewState } from '@src/views/Invitation/SendSms/ducks';
import { State } from '@src/ducks';
import { User, UserProfile } from '@src/firebase/ducks';

interface SelectLanguageProps extends SendSmsViewState {
  user: User;
  profile: UserProfile;
}

interface SelectLanguageCallbacks {
  selectLanguage: (type) => void;
}

const enSvg = require('@src/images/icons/en.svg');
const enImg = require('@src/images/icons/en.png');

const russianSvg = require('@src/images/icons/russian.svg');
const russianImg = require('@src/images/icons/russian.png');

const francaisSvg = require('@src/images/icons/en.svg');
const francaisImg = require('@src/images/icons/en.png');

const espanolSvg = require('@src/images/icons/espa-ol.svg');
const espanolImg = require('@src/images/icons/espa-ol.png');

const deutschSvg = require('@src/images/icons/deutsch.svg');
const deutschImg = require('@src/images/icons/deutsch.png');

const italinoSvg = require('@src/images/icons/en.svg');
const italinoImg = require('@src/images/icons/en.png');

const israelSvg =  require('@src/images/icons/israel.svg');
const israelImg =  require('@src/images/icons/israel.png');

const arabSvg =  require('@src/images/icons/arb.svg');
const arablImg =  require('@src/images/icons/arb.png');




const SelectLanguage = ({
  languages,
  profile,
  user,
  selectLanguage,
  selectedLanguage
}: SelectLanguageProps & SelectLanguageCallbacks) => {
  const userDetails = {
    personName:
      profile.signupBy === 'bride' && profile.event
        ? profile.event.brideName
        : (profile.event && profile.event.groomName) || 'Groom Name',
    eventDate: profile.event && profile.event.date ? new Date(profile.event.date) : '',
    eventLocation: profile.event && profile.event.location ? profile.event.location.address : ''
  };
  return (
    <div>
      <label className="status-label"> שלב #3</label>
      <label className="step-name"> בחרי שפה</label>
      <div className="invite-stages">
        <div className="invite-form icons">
          <div className="language">
          <span
              className="lang-icon"
              onClick={() => selectLanguage({ ...userDetails, language: languages.israel })}
            >
              <label
                className={classnames('step-btn', {
                  active: selectedLanguage === languages.israel
                })}
              >
                <object data={israelSvg} type="image/svg+xml">
                  <img src={israelImg} />
                </object>
              </label>
              <br />
            <p className="step-desc">
              <FormattedMessage id="selectLanguage.hebrew" />
            </p>
            </span>
            <span
              className="lang-icon"
              onClick={() => selectLanguage({ ...userDetails, language: languages.english })}
            >
              <label
                className={classnames('step-btn', {
                  active: selectedLanguage === languages.english
                })}
              >
                <object data={enSvg} type="image/svg+xml">
                  <img src={enImg} />
                </object>
              </label>
              <br />
              <FormattedMessage id="selectLanguage.english" />
            </span>
            <span
              className="lang-icon"
              onClick={() => selectLanguage({ ...userDetails, language: languages.arabian })}
            >
              <label
                className={classnames('step-btn', {
                  active: selectedLanguage === languages.arabian
                })}
              >
                <object data={arabSvg} type="image/svg+xml">
                  <img src={arablImg} />
                </object>
              </label>
              <br />
              <FormattedMessage id="selectLanguage.arabic" />
            </span>
            <span
              className="lang-icon"
              onClick={() => selectLanguage({ ...userDetails, language: languages.russian })}
            >
              <label
                className={classnames('step-btn', {
                  active: selectedLanguage === languages.russian
                })}
              >
                <object data={russianSvg} type="image/svg+xml">
                  <img src={russianImg} />
                </object>
              </label>
              <br />
              <FormattedMessage id="selectLanguage.russian" />
            </span>
            <span
              className="lang-icon"
              onClick={() => selectLanguage({ ...userDetails, language: languages.france })}
            >
              <label
                className={classnames('step-btn', {
                  active: selectedLanguage === languages.france
                })}
              >
                <object data={francaisSvg} type="image/svg+xml">
                  <img src={francaisImg} />
                </object>
              </label>
              <br />
              <FormattedMessage id="selectLanguage.france" />
            </span>
            <span
              className="lang-icon"
              onClick={() => selectLanguage({ ...userDetails, language: languages.italian })}
            >
              <label
                className={classnames('step-btn', {
                  active: selectedLanguage === languages.italian
                })}
              >
                <object data={italinoSvg} type="image/svg+xml">
                  <img src={italinoImg} />
                </object>
              </label>
              <br />
              <FormattedMessage id="selectLanguage.italian" />
            </span>
            <span
              className="lang-icon"
              onClick={() => selectLanguage({ ...userDetails, language: languages.deutsch })}
            >
              <label
                className={classnames('step-btn', {
                  active: selectedLanguage === languages.deutsch
                })}
              >
                <object data={deutschSvg} type="image/svg+xml">
                  <img src={deutschImg} />
                </object>
              </label>
              <br />
              <FormattedMessage id="selectLanguage.deutsch" />
            </span>
            <span
              className="lang-icon"
              onClick={() => selectLanguage({ ...userDetails, language: languages.espanol })}
            >
              <label
                className={classnames('step-btn', {
                  active: selectedLanguage === languages.espanol
                })}
              >
                <object data={espanolSvg} type="image/svg+xml">
                  <img src={espanolImg} />
                </object>
              </label>
              <br />
              <FormattedMessage id="selectLanguage.espanol" />
            </span>
          </div>
          {(selectedLanguage && (
            <NavLink className="btn primary" to="/user/invitation/send-invite/sms-confirmation">
              <FormattedMessage id="sendSms.continue_button" />
            </NavLink>
          )) || (
            <button className="btn outline">
              <FormattedMessage id="sendSms.continue_button" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({
  firebase: { user, profile },
  sendSmsView
}: State): SelectLanguageProps => ({
  ...sendSmsView,
  user,
  profile
});
const mapDispatchToProps = (dispatch): SelectLanguageCallbacks => ({
  selectLanguage: (language) => dispatch(selectLanguage(language))
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectLanguage);
