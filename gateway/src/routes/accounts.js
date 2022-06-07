
const express = require('express');
const router = express.Router();
const accountsController = require('../controllers/accounts.controller');

router.get('/', async (req, res, next) => {
    const { account_id } = req.query;

    try {
        const response = await accountsController.getAccounts(req.query, account_id);
        res.status(response.status).send(response.body);
    } catch (error) {
        console.log(error);
        res.status(error?.statusCode ? error.statusCode : 500).send(error, error.stack);
    }
    next();
});

module.exports = router;
