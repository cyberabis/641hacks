//const fetch = require('node-fetch');
const superagent = require('superagent');


module.exports = async function(districtId, dateString, vaccineName) {
  let output;
  let requestUrl = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${districtId}&date=${dateString}&vaccine=${vaccineName}`;
  console.log('Calling API using Got lib: ', requestUrl);
  /*
  try{
    let response = await fetch(requestUrl, {headers: {'User-Agent': 'PostmanRuntime/7.26.8'}});
    let data = await response.json();
    if(data && data.sessions) {
      output = [];
      for(let session of data.sessions) {
        if (session.available_capacity > 0) {
          output.push({name: session.name, address: session.address + ', ' + session.pincode, availableCapacity: session.available_capacity});
        }
      }
    }
  } catch(error) {
    console.log('Could not get data from Cowin API: ', error);
  }
  */
  try {
    const response = await superagent.get(requestUrl);
    console.log('Cowin API Response: ', response.body);
    if(response.body && response.body.sessions) {
      output = [];
      for(let session of response.body.sessions) {
        if (session.available_capacity > 0) {
          output.push({name: session.name, address: session.address + ', ' + session.pincode, availableCapacity: session.available_capacity});
        }
      }
    }
  } catch (error) {
    console.log(error.response.body);
  }
  return output;
}