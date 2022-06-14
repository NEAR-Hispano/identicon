const { Op } = require("sequelize");
const { AccountsModel } = require("../models");
const uuid = require("uuid");
const crypto = require("crypto")
class AccountsService {
  constructor() {}

  static async createAccount(session, near_account) {
    const keys = {
      public_key: near_account.public_key,
      private_key: near_account.private_key,
    };
    const keyHash = crypto
    .createHash("sha256")
    .update(JSON.stringify(keys))
    .digest("base64");
    const account = await AccountsModel.create({
      uid: uuid.v4(),
      type: session.type,
      email: session.contact,
      phone: session.contact, // ToDo. manage email/phone store
      subject_id: "", // TODO verify why is requied
      linked_account_uid: near_account.account.id,
      keys: keyHash
    });
    return account;
  }

  static async getSingleAccount(uid) {
    const result = await AccountsModel.findAll({
      where: { uid: uid },
    });
    return (result.length && result[0]) || null;
  }

  static async getAccountByContact(contact) {
    const result = await AccountsModel.findOne({
      where: {
        [Op.or]: [{ email: contact }, { phone: contact }],
      },
    });
    return result;
  }

  static async getAccounts() {
    const result = await AccountsModel.findAll({
      order: [["id", "ASC"]],
    });
    return result;
  }
}

module.exports = AccountsService;
