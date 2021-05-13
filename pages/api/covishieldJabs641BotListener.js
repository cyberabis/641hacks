let sendTelegramMessage = require('api-utils/send-telegram-message');
let getAvailableCovidJabs = require('api-utils/get-available-covid-jabs');
let getFormattedDate = require('api-utils/get-formatted-date');
const YAML = require('json-to-pretty-yaml');

const COVISHIELDJABS641BOT_TOKEN = process.env.COVISHIELDJABS641BOT_TOKEN;

export default async (request, response) => {
  console.log('Got request: ', request.body);

  const standardReplyMarkup = {keyboard: [['/today'],['/tomorrow'],['/notify'],['/mute']]};
  
  if(request.body && request.body.message && request.body.message.text === '/start') {
    let name = request.body.message.from.first_name ? ' ' + request.body.message.from.first_name : '';
    let welcomeMessage = `Welcome${name}! I can help you know availability of Covishield vaccine in Coimbatore. You can use the following commands \\today, \\tomorrow, \\notify and \\mute.\n\n\\today and \\tomorrow will reply with list of available Covishield centers for today or tomorrow.\n\n\\notify will notify you as soon as a center becomes available and \\mute can be used to stop receiving notifications.`;
    sendTelegramMessage(request.body.message.chat.id, welcomeMessage, standardReplyMarkup, COVISHIELDJABS641BOT_TOKEN);
  } 
  
  else if (request.body && request.body.message && (request.body.message.text === '/today' || request.body.message.text === '/tomorrow')) {
    let today = getFormattedDate(request.body.message.text.substring(1));
    let output = await getAvailableCovidJabs('539', today, 'COVISHIELD');
    let messageText;
    if(output) {
      messageText = YAML.stringify(output);
    } else {
      messageText = 'We could not pull up the details now - probably too many requests. \nPlease try again after 10 minutes.';
    }
    sendTelegramMessage(request.body.message.chat.id, messageText, undefined, COVISHIELDJABS641BOT_TOKEN);
  } 
  
  else if (request.body && request.body.message && request.body.message.text === '/notify') {
    
  } 
  
  else if (request.body && request.body.message && request.body.message.text === '/mute') {
    
  } 
  
  else {
    let name = request.body.message.from.first_name ? ' ' + request.body.message.from.first_name : '';
    let invalidCommandMessage = `I could not get you${name}. Right now I only understand the following commands \\today, \\tomorrow, \\notify and \\mute.`;
    sendTelegramMessage(request.body.message.chat.id, invalidCommandMessage, standardReplyMarkup, functions.config().covishieldjabs641bot.token);
  }

  response.end();
}