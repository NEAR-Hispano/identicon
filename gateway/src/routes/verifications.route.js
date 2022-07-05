const express = require('express');
const router = express.Router();
const { body, check } = require('express-validator');
const AuthMiddleware = require('../middlewares/auth.middleware');
const { FlattenMiddleware } = require('../middlewares/flatten.middleware');
const ValidateParamsMiddleware = require('../middlewares/validate.middleware')
const verificationsController = require('../controllers/verifications.controller');

/**
 * POST /verifications
 */
const postPreconditions = [
  body('subject_id').not().isEmpty().trim(),
  body('type').isIn(['ProofOfLife']), 
  body('personal_info__email').isEmail().normalizeEmail(),
  body('personal_info__phone').not().isEmpty().trim().escape(),
  body('personal_info__full_name').not().isEmpty().trim().escape(),
  body('personal_info__country').isIn(['mx', 'ar', 've', 'bo', 'cl', 'uy', 'pe']),
];

router.post('/', 
  AuthMiddleware,
  FlattenMiddleware('personal_info'), 
  ValidateParamsMiddleware(postPreconditions),
  async (req, res, next) => {
    try {
      const response = await verificationsController.createVerification({
        subject_id: req.body.subject_id,
        type: req.body.type,
        personal_info: req.body.personal_info,
        authorized_uid: req.authorized.account_data.id 
      });
      res.status(response.status).send(response.body);
    } catch (error) {
      res.status(error.statusCode ? error.statusCode : 500).send(error, error.stack);
    }
    next();
  }
);

/**
 * GET /verifications ? requester_uid= & states=
 */
 const getPreconditions = [
  check('requester_uid').exists().notEmpty().trim(),
  check('states').exists().notEmpty().isIn(['UN', 'PN', 'ST', 'FI']), 
];

router.get('/', 
  AuthMiddleware, 
  ValidateParamsMiddleware(getPreconditions),
  async (req, res, next) => {
    try {
      const response = await verificationsController.getVerifications({
        requester_uid: req.query.requester_uid,
        states: req.query.states,
        authorized_uid: req.authorized.account_data.id
      });
      res.status(response.status).send(response.body);
    } catch (error) {
      res.status(error.statusCode ? error.statusCode : 500).send(error, error.stack);
    }
    next();
  }
);

module.exports = router;
