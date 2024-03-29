const express = require('express');
const router = express.Router();
const { body, check } = require('express-validator');
const AuthMiddleware = require('../middlewares/auth.middleware');
const { FlattenMiddleware } = require('../middlewares/flatten.middleware');
const ValidateParamsMiddleware = require('../middlewares/validate.middleware')
const TasksController = require('../controllers/tasks.controller');
const { VerificationStates } = require('../models/definitions')


/**
 * GET /tasks ?state= &order=
 */
const getPreconditions = [
];

router.get('/', 
  AuthMiddleware, 
  //ValidateParamsMiddleware(getPreconditions),
  async (req, res, next) => {
    try {
      const response = await TasksController.getTasksByState({
        order: 'asc',
        state:  req.query.state,
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
 * GET /tasks/:uid
 */
const getOnePreconditions = [
  check('uid').exists().notEmpty().trim(),
];

router.get('/:uid', 
  AuthMiddleware, 
  //ValidateParamsMiddleware(getOnePreconditions),
  async (req, res, next) => {
    try {
      const response = await TasksController.getSingleTask({
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
 * PUT /tasks/:uid
 */
const putOnePreconditions = [
  check('uid').exists().notEmpty().trim(),
  body('result').isIn(VerificationStates), 
  body('remarks').not().isEmpty().trim().escape(),
];

router.put('/:uid', 
  AuthMiddleware,
  ValidateParamsMiddleware(putOnePreconditions),
  async (req, res, next) => {
    try {
      const response = await TasksController.udpateTaskResult({
        uid: req.params.uid,
        result: req.body.result,
        remarks: req.body.remarks,
        contents: req.body.contents,
        authorized_uid: req.authorized.account_data.id 
      });
      res.status(response.status).send(response.body);
    } catch (error) {
      res.status(error.statusCode ? error.statusCode : 500).send(error, error.stack);
    }
    next();
  }
);

router.get('/test',
AuthMiddleware,
async (req, res, next) => {
  const response = await TasksController.identicontest();
  res.status(200).send(response);
  next();
}
);


// /**
//  * POST /verifications/:uid/results
//  */
// const postResultsPreconditions = [
//   check('uid').exists().notEmpty().trim(),
//   body('validator_uid').exists().not().isEmpty().trim(),
//   body('type').isIn(['ProofOfLife']), 
//   body('state').isEmail().isIn(['Approved', 'Rejected', 'NotPossible', 'WillNotDo']),
//   body('remarks').exists().trim().escape(),
//   body('files').exists(),
// ];
// 
// router.post('/:uid/results', 
//   AuthMiddleware,
//   ValidateParamsMiddleware(postResultsPreconditions),
//   async (req, res, next) => {
//     try {
//       const response = await verificationsController.updateResults({
//         request_uid: req.params.uid,
//         validator_uid: req.body.validator_uid,
//         type: req.body.type,
//         state: req.body.state,
//         remarks: req.body.remarks,
//         files: req.body.files || [],
//         authorized_uid: req.authorized.account_data.id 
//       });
//       res.status(response.status).send(response.body);
//     } catch (error) {
//       res.status(error.statusCode ? error.statusCode : 500).send(error, error.stack);
//     }
//     next();
//   }
// );

module.exports = router;
