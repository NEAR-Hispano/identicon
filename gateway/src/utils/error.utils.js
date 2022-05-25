const { CustomError, GenericError } = require('../response');

const processError = error => {
  let response; 
  if (error.body !== undefined && error.status !== undefined) {
    response = new CustomError(error.status, error.body);
  }
  else { 
    response = new GenericError(error);
  }
  return response;
};

module.exports = { processError };