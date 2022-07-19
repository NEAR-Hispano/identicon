
const express = require('express');
const router = express.Router();
const accountsController = require('../controllers/accounts.controller');
const AuthMiddleware = require('../middlewares/auth.middleware');

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

router.put('/:id', AuthMiddleware, async (req, res, next) => {
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
