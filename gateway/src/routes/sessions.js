
const express = require('express');
const router = express.Router();
const accountsController = require('../controllers/sessions.controller');

router.get('/signup', async (req, res, next) => {
    const { email, phone, type } = req.body;
    try {
        const response = await accountsController.getSingleAccount(uid);
        res.status(response.status).send(response.body);
    } catch (error) {
        console.log(error);
        res.status(error?.statusCode ? error.statusCode : 500).send(error, error.stack);
    }
    next();
});

module.exports = router;
