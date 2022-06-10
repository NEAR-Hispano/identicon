
const { Op } = require('sequelize');
const { AccountsModel } = require('../models');
const uuid = require('uuid');
class AccountsService {
  constructor() { }

  static async createAccount(session, near_account) {
    const account = await AccountsModel.create({
      
        uid: uuid.v4(),
        type: session.type,
        email: session.contact,
        phone: session.contact, // ToDo. manage email/phone store
        keys: null, // ToDo define how to store keys
        subject_id: '17897728', // TODO verify why is requied
        linked_account_uid: near_account.account.id
    })
    console.info('account created', account)
    return account;
  }

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
