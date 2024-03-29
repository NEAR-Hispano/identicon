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
      const info = req.body.personal_info;
      const subject_id = `${info.country}_dni_${info.dni}`.toUpperCase();
      const response = await verificationsController.createVerification({
        subject_id: subject_id,
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
  check('states').exists().notEmpty().isIn([
    'Unassigned','Pending', 'Approved', 'Rejected', 
    'NotPossible', 'WillNotDo','Canceled'
  ]), 
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


/**
 * GET /verifications/:uid
 */
const getOnePreconditions = [
  check('uid').exists().notEmpty().trim(),
];

router.get('/:uid', 
  AuthMiddleware, 
  ValidateParamsMiddleware(getOnePreconditions),
  async (req, res, next) => {
    try {
      const response = await verificationsController.getOneVerification({
        uid: req.params.uid,
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
 * PUT /verifications/:uid
 */
const putOnePreconditions = [
  check('uid').exists().notEmpty().trim(),
  body('subject_id').not().isEmpty().trim(),
  body('type').isIn(['ProofOfLife']), 
  body('personal_info__email').isEmail().normalizeEmail(),
  body('personal_info__phone').not().isEmpty().trim().escape(),
  body('personal_info__full_name').not().isEmpty().trim().escape(),
  body('personal_info__country').isIn(['mx', 'ar', 've', 'bo', 'cl', 'uy', 'pe']),
];

router.put('/:uid', 
  AuthMiddleware,
  FlattenMiddleware('personal_info'), 
  ValidateParamsMiddleware(putOnePreconditions),
  async (req, res, next) => {
    try {
      const response = await verificationsController.updateVerification({
        uid: req.params.uid,
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
 * POST /verifications/:uid/results
 */
const postResultsPreconditions = [
  check('uid').exists().notEmpty().trim(),
  body('validator_uid').exists().not().isEmpty().trim(),
  body('type').isIn(['ProofOfLife']), 
  body('state').isEmail().isIn(['Approved', 'Rejected', 'NotPossible', 'WillNotDo']),
  body('remarks').exists().trim().escape(),
  body('files').exists(),
];

router.post('/:uid/results', 
  AuthMiddleware,
  ValidateParamsMiddleware(postResultsPreconditions),
  async (req, res, next) => {
    try {
      const response = await verificationsController.updateResults({
        request_uid: req.params.uid,
        validator_uid: req.body.validator_uid,
        type: req.body.type,
        state: req.body.state,
        remarks: req.body.remarks,
        files: req.body.files || [],
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
