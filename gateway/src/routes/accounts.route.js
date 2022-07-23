
const express = require('express');
const router = express.Router();
const { body, check } = require('express-validator');
const accountsController = require('../controllers/accounts.controller');
const AuthMiddleware = require('../middlewares/auth.middleware');
const { FlattenMiddleware } = require('../middlewares/flatten.middleware');
const ValidateParamsMiddleware = require('../middlewares/validate.middleware')

router.get('/:uid', AuthMiddleware, async (req, res, next) => {
    const { uid } = req.params;
    try {
        const response = await accountsController.getSingleAccount(uid);
        res.status(response.status).send(response.body);
    } catch (error) {
        res.status(error?.statusCode ? error.statusCode : 500).send(error, error.stack);
    }
    next();
});


const putPreconditions = [
  body('personal_info__dni').not().isEmpty().trim().escape(),
  body('personal_info__full_name').not().isEmpty().trim().escape(),
  body('personal_info__country').isIn(['mx', 'ar', 've', 'bo', 'cl', 'uy', 'pe']),
];

router.put('/:id', 
  AuthMiddleware, 
  FlattenMiddleware('personal_info'), 
  ValidateParamsMiddleware(putPreconditions),
  async (req, res, next) => {
    const { id } = req.params;
    const account = req.body;
    try {
        const response = await accountsController.updateAccount(id, account);
        res.status(response.status).send(response.body);
    } catch (error) {
        res.status(error?.statusCode ? error.statusCode : 500).send(error, error.stack);
    }
    next();
});

router.delete('/:id', AuthMiddleware, async (req, res, next) => {
    const { id } = req.params;
    const account = req.body;
    try {
        const response = await accountsController.deleteAccount(id);
        res.status(response.status).send(response.body);
    } catch (error) {
        res.status(error?.statusCode ? error.statusCode : 500).send(error, error.stack);
    }
    next();
});

router.post('/validators', 
  AuthMiddleware, 
  async (req, res, next) => {
  const account = req.body;
  try {
      const response = await accountsController.registerAccountAsValidator({
        id: req.authorized.account_data.id,
        can_do: req.body.can_do,
        authorized_uid: req.authorized.account_data.id 
      });
      res.status(response.status).send(response.body);
  } catch (error) {
      res.status(error?.statusCode ? error.statusCode : 500).send(error, error.stack);
  }
  next();
});


module.exports = router;
