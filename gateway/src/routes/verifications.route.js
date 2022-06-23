
const express = require('express');
const router = express.Router();
const verificationsController = require('../controllers/verifications.controller');
const AuthMiddleware = require('../middlewares/auth.middleware');

router.post('/', AuthMiddleware, async (req, res, next) => {
    try {
        const response = await verificationsController.createVerification(req.body);
        res.status(response.status).send(response.body);
    } catch (error) {
        res.status(error?.statusCode ? error.statusCode : 500).send(error, error.stack);
    }
    next();
});


module.exports = router;