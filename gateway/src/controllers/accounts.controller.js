const { Success, NotFoundError, MissingParams, GenericError } = require('../response');
const accountsService = require('../services/accounts.service');

class AccountsController {
  constructor() { }

  static async getAccounts(params) {
    const response = await accountsService.getAccounts(params);

    if (response) {
      return new Success(response);
    } else {
      return new NotFoundError(response);
    }
  }
}

module.exports = AccountsController;
