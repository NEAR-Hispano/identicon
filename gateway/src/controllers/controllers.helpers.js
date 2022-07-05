const { NotFoundError, UnknownException } = require('../response');
const accountsService = require('../services/accounts.service');

async function getAccountOrError(account_id) {
  let account = await accountsService.getAccountById(account_id);
  if (account.error) 
    return { error: new NotFoundError(account.error) };
  return { account: account.dataValues };
}

module.exports = { getAccountOrError };
