
const jwt = require('jsonwebtoken');
const config = require('../config');
const AuthMiddleware = async (req, res, next) => {
  if (!req.headers || !req.headers.authorization) res.status(403).send({ message: "request lack of authorization header" })
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  console.info('token', token)
  if (token == null) res.status(401).send({ message: "request lack of auth token" })
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "", (err, payload) => {
    if (err) return res.status(401).send({ message: "Invalid Token" });
    next();
  }
  );
};


module.exports = AuthMiddleware;