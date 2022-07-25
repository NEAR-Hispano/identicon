const { response } = require("express");
const {
  Success,
  NotFoundError,
  MissingParams,
  GenericError,
} = require("../response");
const accountsService = require("../services/accounts.service");
const { getAccountOrError } = require('./controllers.helpers');
const nearService = require('../services/near.service');

class AccountsController {
  constructor() {}

  static async getSingleAccount(uid) {
    const response = await accountsService.getAccountById(uid);
    if (response) {
      return new Success(response);
    } else {
      return new NotFoundError(response);
    }
  }

  static async getAccounts(params) {
    const response = await accountsService.getAccounts(params);
    if (response) {
      return new Success(response);
    } else {
      return new NotFoundError(response);
    }
  }

  static async updateAccount(id, accountUpdate) {
    try {
      if (!id) 
        return new MissingParams("Account Id is required");

      const [account, err] = await getAccountOrError(id);
      if (!account) 
        return new NotFoundError("Account not found");
      const response = await accountsService.updateAccount(id, 
        account, 
        accountUpdate
      );

      if (account.type === 'VL') {
        try {
          // TODO: use validator options from PersonalInfo options
          // we now assign only default 'Remote' to a new Validator
          await nearService.registerAsValidator(
            { can_do: ['Remote'] }, // 'Onsite', Review'
            account
          );
        }
        catch(err) {
          console.log('Register as validator ERR=', err);
        }
      }

      return new Success({ id: response });
    } catch (err) {
      return new GenericError(err);
    }
  }

  static async deleteAccount(id) {
    try {
      if (!id) return new MissingParams("Account Id is required");
      const account = await accountsService.getAccountById(id);
      if (!account) return new NotFoundError("Account not found");
      const response = await accountsService.deleteAccount(id);
      return new Success({ id: response });
    } catch (err) {
      return new GenericError(err);
    }
  }

  static async registerAccountAsValidator({id, can_do, authorized_uid}) {
    try {
      if (!id) return new MissingParams("Account Id is required");
      const [account, err] = await getAccountOrError(authorized_uid);
      if (err) 
        return err;

      // call the Contract
      const response = await nearService.registerAsValidator(
        { can_do: can_do },
        account
      );

      return new Success({ id: response });
    } catch (err) {
      return new GenericError(err);
    }
  }
}

module.exports = AccountsController;
