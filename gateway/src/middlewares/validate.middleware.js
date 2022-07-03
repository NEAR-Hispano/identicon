const { validationResult } = require('express-validator');

/**
 * This Middleware validates the received body and query params 
 * using the given preconditions in sequence and stops running 
 * the validations chain if the previous one have failed.
 */
const ValidateParamsMiddleware = (preconditions) => {

  return async (req, res, next) => {
    for (let validation of preconditions) {
      const result = await validation.run(req);
      if (result.errors.length) break;
    }

    const result = validationResult(req);
    if (result.isEmpty()) {
      return next();
    }

    // we have only 1 error beccause we stopped on the first one
    const err = result.errors[0]; 
    res.status(400).send({ 
      message: `Missing Params: @${err.param} ${err.msg}`
    });
  };
};


module.exports = ValidateParamsMiddleware ;