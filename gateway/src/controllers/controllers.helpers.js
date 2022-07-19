const { NotFoundError, UnknownException } = require('../response');
const accountsService = require('../services/accounts.service');

async function getAccountOrError(account_id) {
  let account = await accountsService.getAccountById(account_id);
  if (account.error) 
    return [null, new NotFoundError(account.error)];
  return [account.dataValues, null] ;
}


module.exports = { getAccountOrError };
