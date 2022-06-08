
const { models } = require('../models');

class AccountsService {
  constructor() { }

  static async getSingleAccount(uid) {
    const result = await models.AccountsModel.findAll({
      where: { uid: uid }
    });
    return (result.length && result[0]) || null;
  }

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
