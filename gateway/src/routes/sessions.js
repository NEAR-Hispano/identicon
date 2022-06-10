
const express = require('express');
const router = express.Router();
const controller = require('../controllers/sessions.controller');

router.post('/signup', async (req, res, next) => {
    const { email, phone, type } = req.body;
    try {
        const response = await controller.createSession(req.body);
        res.status(response.status).send(response.body);
    } catch (error) {
        console.log(error);
        res.status(error?.statusCode ? error.statusCode : 500).send(error, error.stack);
    }
    next();
});

router.post('/login', async (req, res, next) => {
    const { session_key, passcode } = req.body;
    try {
        const response = await controller.login({session_key, passcode});
        res.status(response.status).send(response.body);
    } catch (error) {
        console.log(error);
        res.status(error?.statusCode ? error.statusCode : 500).send(error, error.stack);
    }
    next();
});

module.exports = router;
