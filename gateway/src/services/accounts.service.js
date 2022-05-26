const { models } = require("../models");

class AccountsService {
  constructor() { }


  static async getAccounts() {
    const result = await models.AccountsModel.findAll({
      order: [
        ['id', 'ASC']
      ]
    });
    return result;
  }


}

module.exports = AccountsService;
