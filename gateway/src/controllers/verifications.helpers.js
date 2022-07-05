const { NotFoundError, UnknownException } = require('../response');
const accountsService = require('../services/accounts.service');

async function getAccountOrRaise(account_id) {
  let account = await accountsService.getAccountById(account_id);
  if (account.error) 
    throw new NotFoundError(account.error);
  return account.dataValues;
}

module.exports = { getAccountOrRaise };
