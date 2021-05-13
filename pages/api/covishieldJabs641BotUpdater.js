let sendTelegramMessage = require('api-utils/send-telegram-message');
let getAvailableCovidJabs = require('api-utils/get-available-covid-jabs');
let getFormattedDate = require('api-utils/get-formatted-date');
const db = require('api-utils/db');
const YAML = require('json-to-pretty-yaml');

const COVISHIELDJABS641BOT_TOKEN = process.env.COVISHIELDJABS641BOT_TOKEN;

export default async (request, response) => {
  console.log('Going to update...');
  //TODO
  
  response.end();
}