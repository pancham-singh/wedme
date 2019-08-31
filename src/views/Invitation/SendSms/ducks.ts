import { createDuck, createReducer, createAction } from 'yapreact/utils';
import { DuckStateNode } from 'yapreact/utils/createDuck';
import { State } from '@src/ducks';
import { templates } from './smsTemplates';

const sendSmsDuck = createDuck('SEND_SMS');
export const toggleSelectedRecipient = createAction('TOGGLE_SELECTED_RECIPIENT');
export const selectMessage = createAction('SELECT_MESSAGE');
export const selectLanguage = createAction('SELECT_LANGUAGE');
export const changeSmsTemplate = createAction('CHANGE_SMS_TEMPLATE');
export const changeRideTemplate = createAction('CHANGE_RIDE_TEMPLATE');

export interface SendSmsViewState {
  sendSmsDuck: DuckStateNode<null>;
  messageTypes: {
    invitation: string;
    reminder: string;
    thankYou: string;
    shuttleReminder: string;
  };
  languages: {
    english: string;
    russian: string;
    france:  string;
    espanol: string;
    deutsch: string;
    arabian: string;
    israel:  string;
    italian: string;

  };
  selectedMessageType: string;
  selectedLanguage: string;
  smsTemplate: string;
  rideTemplate: string;
}
const initialState = {
  messageTypes: {
    invitation: 'invitation',
    reminder: 'reminder',
    thankYou: 'thankYou',
    shuttleReminder: 'shuttleReminder'
  },
  languages: {
    english: 'english',
    russian: 'russian',
    france: 'france',
    espanol: 'espanol',
    deutsch: 'deutsch',
    arabian: 'arabian',
    israel: 'israel',
    italian:'italian'
  },
  selectedMessageType: '',
  selectedLanguage: '',
  smsTemplate: '',
  rideTemplate: '',
  thankYouTemplate: '',
  reminderTemplate: ''
};

export const sendSms = sendSmsDuck.actions;

const ducks = {
  sendSms: sendSmsDuck
};
const formatDate = (date) =>{
  console.log('event date', date);
  const newDate = new Date(date);
  return `${newDate.getDate()}.${newDate.getMonth()+1}.${newDate.getFullYear()} `;
}
export default createReducer(
  {
    [selectMessage().type]: (state, { payload: messageType }) => ({
      ...state,
      selectedMessageType: messageType
    }),
    [selectLanguage().type]: (
      state,
      { payload: { language, personName, eventDate, eventLocation } }
    ) => {
      const smsTemplate = templates.smsTemplates[language]
        .replace('personName', personName)
        .replace('eventDate', formatDate(eventDate))
        .replace('eventLocation', eventLocation);
        console.log({
          name:personName,
          eventDate:formatDate(eventDate),
          eventLocation:eventLocation
        });
      return {
        ...state,
        smsTemplate,
        rideTemplate: templates.rideTemplate[language],
        selectedLanguage: language
      };
    },
    [changeSmsTemplate().type]: (state, { payload: smsTemplate }) => ({
      ...state,
      smsTemplate
    }),
    [changeRideTemplate().type]: (state, { payload: rideTemplate }) => ({
      ...state,
      rideTemplate: rideTemplate
    }),
    [changeSmsTemplate().type]: (state, { payload: smsTemplate }) => ({
      ...state,
      smsTemplate
    }),
    [changeRideTemplate().type]: (state, { payload: rideTemplate }) => ({
      ...state,
      rideTemplate
    })
  },
  { initialState, ducks }
);
