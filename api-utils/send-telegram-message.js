const got = require('got');

module.exports = function (chatId, text, replyMarkup, token) {
  console.log(replyMarkup);
  got.post(`https://api.telegram.org/bot${token}/sendMessage`, {
    json: {
      chat_id: chatId,
      text: text,
      reply_markup: replyMarkup
    },
    responseType: 'json'
  });
}