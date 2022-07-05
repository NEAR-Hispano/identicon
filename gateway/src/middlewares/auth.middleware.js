const jwt = require('jsonwebtoken');
const config = require('../config');

/**
 * This Middleware verifies the Authorization header.
 * If it exists and the AUTH_TOK is valid, it modifies the `req` object
 * adding an `authorized` property with the decrypted token payload, 
 * which can then be used by the Controller:
 * 
 * ~~~
 * req.authorized = {
 *    "account_data": {
 *       "id": "12b8...ca3",
 *       "email": "ma...@....com",
 *       "phone": "",
 *       "verified": false
 *     },
 *     "near_account_data": {
 *       "account_id": "fdc...14ad.identicon.testnet"
 *     },
 *     "iat": 1656799895,
 *     "exp": 1656886295
 * };
 *~~~
 */
const AuthMiddleware = async (req, res, next) => {
  if (!req.headers || !req.headers.authorization) res.status(403).send({
    message: "request lack of authorization header"
  })
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  console.info('token', token)
  if (token == null) res.status(401).send({
    message: "request lack of auth token"
  });
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "", (err, payload) => {
    if (err)  {
      return res.status(401).send({
        message: "Invalid Token"
      });
    } else {
      // we change the Req obj to include the decrypted token payload
      req.authorized = payload;
      req.header.authorized = payload;
    }
    next();
  });
};


module.exports = AuthMiddleware;
