const https = require('https');

let getCowinAPIData = async (requestUrl) => {
  return new Promise(async(resolve, reject) => {

    https.get(requestUrl, (resp) => {
    let data = '';
    resp.on('data', (chunk) => {
      data += chunk;
    });
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
        output.push({name: session.name + (session.min_age_limit ? ` (${session.min_age_limit}+)` : ''), address: session.address + ', ' + session.pincode, availableCapacity: session.available_capacity});
      }
    }
  }
  return output;
}