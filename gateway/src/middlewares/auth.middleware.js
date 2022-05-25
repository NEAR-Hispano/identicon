
const config = require('../config');
const { ForbiddenError, UnauthorizedError } = require('../response');


const AuthMiddleware = async (req, res, next) => {
    // do validations
    next();

}


module.exports = {
  AuthMiddleware
}