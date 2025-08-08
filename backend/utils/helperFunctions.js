module.exports.generateRandomString = function(length) {
  var text = '';
  var possibleValues = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possibleValues.charAt(Math.floor(Math.random() * possibleValues.length));
  }
  return text;
};

module.exports.wait  = async function(timeInSec) {
  console.info(`[wait called] ==> WAITING FOR ${timeInSec} SEC`);
  await new Promise(resolve => setTimeout(resolve, timeInSec * 1000));
}

module.exports.splitArray = function({parts = 10, arr}) {
  let start = 0;
  let end = parts;
  const response = [];
  while (start < arr.length) {  
      response.push(arr.slice(start, end))
      start = end;
      end += parts;
      if (end > arr.length) end = arr.length
  }
  return response;
}

module.exports.getTime = function(date) {
  if(date) return new Date(date).getTime();
  else return new Date();
}