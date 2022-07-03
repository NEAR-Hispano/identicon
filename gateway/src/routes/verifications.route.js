const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const AuthMiddleware = require('../middlewares/auth.middleware');
const { FlattenMiddleware } = require('../middlewares/flatten.middleware');
const ValidateParamsMiddleware = require('../middlewares/validate.middleware')
const verificationsController = require('../controllers/verifications.controller');


let postPreconditions = [
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
      const response = await verificationsController.createVerification(req.body, req.authorized);
      res.status(response.status).send(response.body);
    } catch (error) {
      res.status(error.statusCode ? error.statusCode : 500).send(error, error.stack);
    }
    next();
  }
);


router.get('/', AuthMiddleware, async (req, res, next) => {
  /*   try {
        const response = await verificationsController.getVerification(req.body, req.params, req.authorized);
        res.status(response.status).send(response.body);
    } catch (error) {
        res.status(error?.statusCode ? error.statusCode : 500).send(error, error.stack);
    }
   */
  next();
});


module.exports = router;
