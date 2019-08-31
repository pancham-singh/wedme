import '@src/rxjs-imports';

import { Observable } from 'rxjs/Observable';
import { Epic, combineEpics } from 'redux-observable';
import { State } from '@src/ducks';
import { YapAction } from 'yapreact/utils/createAction';
import { push } from 'react-router-redux';

import firebaseApp from '@src/firebase';
import { FirebaseError } from 'firebase';
import firebaseErrorMsg from '@src/lib/firebaseErrorMsg';

import { UserProfile } from '@src/firebase/ducks';
import { sendSms } from '@src/views/Invitation/SendSms/ducks';
// import { initialState } from '@src/views/Invitation/SendSms/ducks';

import logger from '@src/lib/logger';
import { Invitation } from '@src/firebase/ducks';
/*const initialState = {
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
    deutsch: 'deutsch'
  },
  selectedMessageType: '',
  selectedLanguage: '',
  smsTemplate: '',
  rideTemplate: ''
};*/
const log = logger('sendSmsEpic');

const sendSmsEpic: Epic<YapAction<any>, State> = (action$, { getState }) =>
  action$
    .ofType(sendSms.start().type)
    .mergeMap(() => {
      const smsTemplate = getState().sendSmsView.smsTemplate;
      const smsTemplate2 = getState().sendSmsView.rideTemplate;
      const profile = getState().firebase.profile;
      const selectedMessageType=getState().sendSmsView.selectedMessageType;
      console.log(smsTemplate,selectedMessageType,smsTemplate2);
      const time = new Date().getTime();
      const selectedRecipients = Object.entries(getState().firebase.invitations)
        .map(([id, invitation]) => ({ ...invitation, id }))
        .filter((invite) => invite.isSelected);

      let queryNumbers = '';
      let queryNumbersSecondMsg = '';
      if (!selectedRecipients.length) {
        return Observable.of(sendSms.fail('Please Select Recipients!'));
      }
      if(profile.sms.available <= 0){
          return Observable.of(sendSms.fail('Sorry You have no enough sms balance!'));

      }

      let updateInvitations = {};
      
      for (let rc = 0; rc < selectedRecipients.length; rc++) {
        updateInvitations[selectedRecipients[rc].id] = selectedRecipients[rc];
        updateInvitations[selectedRecipients[rc].id].invitedCount =
          (selectedRecipients[rc].invitedCount && selectedRecipients[rc].invitedCount + 1) || 1;
          
        queryNumbers += `&toNumber=${
          selectedRecipients[rc].id
        }&reference=${new Date().getTime()}&text=${smsTemplate}`;

        queryNumbersSecondMsg += `&toNumber=${
          selectedRecipients[rc].id
        }&reference=${new Date().getTime()}&text=${smsTemplate2}`;

      }

      let apiUrl = `http://www.pulseem.co.il/Pulseem/pulseemsendservices.asmx/SendMultipleInternationalTextsSMS?userID=wedmesherry&password=1671700&fromNumber=0544988911${queryNumbers}`;
      let apiUrl2 = `http://www.pulseem.co.il/Pulseem/pulseemsendservices.asmx/SendMultipleInternationalTextsSMS?userID=wedmesherry&password=1671700&fromNumber=0544988911${queryNumbersSecondMsg}`;

      // alert(apiUrl+apiUrl2);
     
      return fetch(apiUrl, {
        method: 'GET'
      })
        .then((res) => {
          let parser = new DOMParser();
          let xmlDoc = parser.parseFromString(res.toString(), 'text/xml');

          let responseString = xmlDoc.getElementsByTagName('string')[0].childNodes[0].nodeValue;

          const resArray = responseString.split(' ');
          const resultArray = resArray.reduce((result, value, index, array) => {
            if (index % 2 === 0 && array.slice(index, index + 1)[0] === 'Success:') {
              result[array.slice(index + 1, index + 2)[0]] = { invitedCount: 1 };
            }
            return result;
          }, {});
          return resultArray;
        })
        .catch((error) => {
          console.log(apiUrl);
          console.log(`in catch`);

          if(selectedMessageType !==  'invitation')
    {
      console.log(selectedMessageType);
           return updateInvitations;

        
    }
    else{
      return fetch(apiUrl2, {
        method: 'GET'
      })
        .then((res) => {
          let parser = new DOMParser();
          let xmlDoc = parser.parseFromString(res.toString(), 'text/xml');

          let responseString = xmlDoc.getElementsByTagName('string')[0].childNodes[0].nodeValue;

          const resArray = responseString.split(' ');
          const resultArray = resArray.reduce((result, value, index, array) => {
            if (index % 2 === 0 && array.slice(index, index + 1)[0] === 'Success:') {
              result[array.slice(index + 1, index + 2)[0]] = { invitedCount: 1 };
            }
            return result;
          }, {});
          return resultArray;
        })
        .catch((error) => {

          console.log(`in catch apiUrl2`);
          console.log(apiUrl2);
          return updateInvitations;

          // sendSms.fail(firebaseErrorMsg(error))
        });

    }
          
          // sendSms.fail(firebaseErrorMsg(error))
        });
        
        
    })
    // .mergeMap((updateInvitations: YapAction<any> | any) => {
    //   const selectedMessageType = getState().sendSmsView.selectedMessageType;
    //   if (!updateInvitations.type && selectedMessageType === 'invitation') {
    //     console.log('updateInvitations', updateInvitations);
    //     const userId = getState().firebase.user.uid;
    //     const path = `${firebaseApp.dbPaths.invites(userId)}`;
    //     const ref = firebaseApp.app.database().ref(path);

    //     return ref
    //       .update(updateInvitations)
    //       .then((records) => {
    //         return updateInvitations;
    //       })
    //       .catch((err) => {
    //         return updateInvitations;
    //         // sendSms.fail(firebaseErrorMsg(err))
    //       });
    //     // return Observable.of(push('/user/invitation/send-invite/sms-summary'));
    //   } else if (updateInvitations.type && updateInvitations.type === sendSms.fail().type) {
    //     console.log('updateInvitations failed', updateInvitations);
    //     //sendSms.fail();
    //     // return updateInvitations;

    //     return updateInvitations;
    //     // return Observable.of(push('/user/invitation/send-invite/sms-summary'));
    //   } else {
    //     console.log('updateInvitations success', updateInvitations);

    //     return Observable.of(updateInvitations);
    //     // return Observable.of(push('/user/invitation/send-invite/sms-summary'));
    //   }
    // })
    .mergeMap((updateInvitations) => {
      const profile = getState().firebase.profile;

      const profileUpdate: Partial<UserProfile> = {
        ...profile
      };
      const userId = getState().firebase.user.uid;
      const path = `${firebaseApp.dbPaths.profile(userId)}`;
      const ref = firebaseApp.app.database().ref(path);
      const selectedMessageType=getState().sendSmsView.selectedMessageType;

      if(selectedMessageType ===  'invitation')
  {
    profileUpdate.sms = {
    used:
      (profileUpdate.sms && profileUpdate.sms.used + (Object.keys(updateInvitations).length)*2) ||
      Object.keys(updateInvitations).length,
    available:
      (profileUpdate.sms &&
        profileUpdate.sms.available >0 ? profileUpdate.sms.available - Object.keys(updateInvitations).length : 0) ||
      0
    };
  }
else
{
  profileUpdate.sms = {
    used:
      (profileUpdate.sms && profileUpdate.sms.used + Object.keys(updateInvitations).length) ||
      Object.keys(updateInvitations).length,
    available:
      (profileUpdate.sms &&
        profileUpdate.sms.available - Object.keys(updateInvitations).length) ||
      0
  };
}
     

      ref
        .update(profileUpdate)
        .then((records) => {})
        .catch((err) => {
          // sendSms.fail(firebaseErrorMsg(err))
        });
      return Observable.of(push('/user/invitation/send-invite/sms-summary'));
    });

const responseParser = (response) => {
  const resArray = response.split(' ');
  const resultArray = resArray.reduce((result, value, index, array) => {
    if (index % 2 === 0 && array.slice(index, index + 1)[0] === 'Success:') {
      result[array.slice(index + 1, index + 2)[0]] = { invitedCount: 1 };
    }
    return result;
  }, {});

  return resultArray;
};

export default combineEpics(sendSmsEpic);
