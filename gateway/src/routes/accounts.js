
const express = require('express');
const router = express.Router();
const accountsController = require('../controllers/accounts.controller');

router.get('/:uid', async (req, res, next) => {
    const { uid } = req.params;
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
