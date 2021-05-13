const got = require('got');


module.exports = async function(districtId, dateString, vaccineName) {
  let output;
  let requestUrl = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${districtId}&date=${dateString}&vaccine=${vaccineName}`;
  console.log('Calling API using Got lib: ', requestUrl);
  try{
    let {body} = await got.get(requestUrl, {
      responseType: 'json',
      headers: {
        'User-Agent': 'PostmanRuntime/7.26.8',
        'Cache-Control': 'no-cache',
        'Origin': 'https://apisetu.gov.in',
        'Accept': 'application/json'
      }
    });
    if(body && body.sessions) {
      output = [];
      for(let session of body.sessions) {
        if (session.available_capacity > 0) {
          output.push({name: session.name, address: session.address + ', ' + session.pincode, availableCapacity: session.available_capacity});
        }
      }
    }
  } catch(error) {
    console.log('Could not get data from Cowin API: ', error);
  }
  return output;
}