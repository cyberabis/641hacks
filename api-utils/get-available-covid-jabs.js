//const fetch = require('node-fetch');
//const superagent = require('superagent');
const https = require('https');

let getCowinAPIData = async (requestUrl) => {
  return new Promise(async(resolve, reject) => {

    https.get(requestUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36',
        'Host': 'cdn-api.co-vin.in',
        'Accept': 'application/json',
        'Accept-Encoding': 'accept-encoding: gzip, deflate, br',
        'Accept-Language': 'accept-language: en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Origin': 'https://apisetu.gov.in',
        'Pragma': 'no-cache',
        'Referer': 'https://apisetu.gov.in/public/marketplace/api/cowin',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site'
      }
    }, (resp) => {
    let data = '';
    // A chunk of data has been received.
    resp.on('data', (chunk) => {
      data += chunk;
    });
    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      console.log('Cowin Response: ', data);
      resolve(JSON.parse(data));
    });
  }).on('error', (error) => {
    console.log('Error while calling Cowin API: ', error.message);
    resolve(undefined);
  });

  }).catch(error => console.log('Error while calling Cowin function: ', error));
};

module.exports = async function(districtId, dateString, vaccineName) {
  let output;
  let requestUrl = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${districtId}&date=${dateString}&vaccine=${vaccineName}`;
  console.log('Calling API using Https lib: ', requestUrl);
  let cowinResponse = await getCowinAPIData(requestUrl);
  if(cowinResponse) {
    output = [];
    for(let session of cowinResponse.sessions) {
      if (session.available_capacity > 0) {
        output.push({name: session.name, address: session.address + ', ' + session.pincode, availableCapacity: session.available_capacity});
      }
    }
  }
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

  /*
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
    console.log('Error while calling Cowin API: ', error);
  }
  */

  return output;
}