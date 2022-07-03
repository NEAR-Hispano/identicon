const express = require('express');
const router = express.Router();
const AuthMiddleware = require('../middlewares/auth.middleware');
const verificationsController = require('../controllers/verifications.controller');

router.post('/', AuthMiddleware, async (req, res, next) => {
  try {
    const response = await verificationsController.createVerification(req.body, req.authorized);
    res.status(response.status).send(response.body);
  } catch (error) {
    res.status(error.statusCode ? error.statusCode : 500).send(error, error.stack);
  }
  next();
});

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
