module.exports = function (when) {
  let output;
  let dateString = new Date().toLocaleString('en-US', {timeZone: 'Asia/Kolkata', month: '2-digit', day: '2-digit', year: 'numeric'});;
  let dateParts = dateString.split('/');
  if(when === 'today') {
    output = `${dateParts[1]}-${dateParts[0]}-${dateParts[2]}`;
  } else if(when === 'tomorrow') {
    let dayPartInt = parseInt(dateParts[1]) + 1;
    let dayPartStr = dayPartInt > 9 ? '' + dayPartInt: '0' + dayPartInt;
    output = `${dayPartStr}-${dateParts[0]}-${dateParts[2]}`;
  }
  return output;
}