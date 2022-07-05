const config = require('../config');

/**
 * This Middleware verifies ...
 */
const FlattenMiddleware = (prop) => {
  return(async (req, res, next) => {
    const obj = req.body[prop];
    for (let k in obj) {
      req.body[`${prop}__${k}`] = obj[k]; 
    }
    next();
  });
};

const UnflattenMiddleware = async (req, res, next) => {
  // now does nothing
  next();
};

module.exports = { FlattenMiddleware, UnflattenMiddleware } ;
