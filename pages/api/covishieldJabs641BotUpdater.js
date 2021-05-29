let sendTelegramMessage = require('api-utils/send-telegram-message');
let getAvailableCovidJabs = require('api-utils/get-available-covid-jabs');
let getFormattedDate = require('api-utils/get-formatted-date');
const db = require('api-utils/db');
const YAML = require('json-to-pretty-yaml');

const COVISHIELDJABS641BOT_TOKEN = process.env.COVISHIELDJABS641BOT_TOKEN;

export default async (request, response) => {
  
  console.log('Going to update asynchronously');

  (async()=>{
    //1. Get existing state
    //2. Get new state
    //3. Find new availability
    //4. Update new state
    //5. Notify users
    
    //1.
    let availabilityRef = db.collection('availability').doc('covishieldJabs641');
    let existingAvailabilityDoc = await availabilityRef.get();
    let existing = [];
    if (existingAvailabilityDoc.exists) {
      console.log('Existing availability:', existingAvailabilityDoc.data());
      existing = existingAvailabilityDoc.data().centers ? existingAvailabilityDoc.data().centers : [];
    }

    //2.
    let today = getFormattedDate('today');
    let todayAvailability = await getAvailableCovidJabs('539', today, 'COVISHIELD');
    console.log('Today availability: ', todayAvailability);
    let tomorrow = getFormattedDate('tomorrow');
    let tomorrowAvailability = await getAvailableCovidJabs('539', tomorrow, 'COVISHIELD');
    console.log('Tomorrow availability: ', tomorrowAvailability);

    //3. 
    let newAvailability = [];
    let update = [];
    if(todayAvailability && todayAvailability.length) {
      for(let center of todayAvailability) {
        let found = existing.find(x => x.name === center.name && x.when === today)
        if(!found) newAvailability.push(center);
        update.push({...center, when: today});
      }
    }
    if(tomorrowAvailability && tomorrowAvailability.length) {
      for(let center of tomorrowAvailability) {
        let found = existing.find(x => x.name === center.name && x.when === tomorrow)
        if(!found) newAvailability.push({...center, when: tomorrow});
        update.push({...center, when: tomorrow});
      }
    }
    console.log('New availability: ', newAvailability);
    console.log('DB update: ', update);

    //4.
    await db.collection('availability').doc('covishieldJabs641').set({centers: update});

    //5.
    if(newAvailability.length) {
      let message = YAML.stringify(newAvailability);
      let usersRef = db.collection('usersToNotify');
      let snapshot = await usersRef.get();
      snapshot.forEach(doc => {
        console.log('Messaging user: ', doc.data().name);
        //sendTelegramMessage(doc.id, 'Newly available centers:\n' + message, undefined, COVISHIELDJABS641BOT_TOKEN);
      });
    }

    console.log('Updater finished!');
  })();
  
  console.log('Replying ok immediately.');
  response.end();
}