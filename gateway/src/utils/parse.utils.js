
const parseBody = message => {
  if (!message) return '';
  
  let dataJson;

  try {
    dataJson = JSON.parse(message);
  } catch(err){
    const body = message.replace('\\"', '"');
    dataJson = JSON.parse(body);
    console.log('dataJson: %j', dataJson);
  }

  return dataJson;
};

module.exports = { parseBody };