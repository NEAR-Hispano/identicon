
const { Op } = require('sequelize');
const { AccountsModel } = require('../models');

class AccountsService {
  constructor() { }

  static async getSingleAccount(uid) {
    const result = await AccountsModel.findAll({
      where: { uid: uid }
    });
    return (result.length && result[0]) || null;
  }

  static async getAccountByContact(contact) {
    const result = await AccountsModel.findOne({
      where: {
        [Op.or]: [
          {email: contact},
          {phone: contact}
        ]
      }
    });
    return result;
  }

  static async getAccounts() {
    const result = await AccountsModel.findAll({
      order: [
        ['id', 'ASC']
      ]
    });
    return result;
  }
}

module.exports = AccountsService;
