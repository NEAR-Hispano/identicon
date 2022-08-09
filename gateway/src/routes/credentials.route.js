const express = require('express');
const router = express.Router();
const { body, check } = require('express-validator');
const AuthMiddleware = require('../middlewares/auth.middleware');
const { FlattenMiddleware } = require('../middlewares/flatten.middleware');
const ValidateParamsMiddleware = require('../middlewares/validate.middleware')
const CredentialsController = require('../controllers/credentials.controller');
const { VerificationStates } = require('../models/definitions')


/**
 * GET /credentials/:token_id
 */

router.get('/:token_id', 
  async (req, res, next) => {
    try {
        const { token_id } = req.params;
    console.info('Fetching credential metadatafor ', token_id)
      const response = await CredentialsController.getCredentialMetadada(token_id);
      res.status(response.status).send(response.body);
    } catch (error) {
      res.status(error.statusCode ? error.statusCode : 500).send(error, error.stack);
    }
    next();
  }
);


module.exports = router;
