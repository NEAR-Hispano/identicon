const { response } = require("express");
const {
  Success,
  NotFoundError,
  MissingParams,
  GenericError,
} = require("../response");
const accountsService = require("../services/accounts.service");

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
      if (!id) return new MissingParams("Account Id is required");
      const account = await accountsService.getAccountById(id);
      if (!account) return new NotFoundError("Account not found");
      const response = await accountsService.updateAccount(id, account, accountUpdate);
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
}

module.exports = AccountsController;
