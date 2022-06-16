const { Op } = require("sequelize");
const { AccountsModel, SubjectsModel } = require("../models");
const uuid = require('uuid');
const crypto = require("crypto");
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
      subject_id: uuid.v4(), // Todo: create unique subject_id (did) based on identicon docs
      linked_account_uid: near_account.account.id,
      keys: keyHash,
    });
    return account;
  }

  static async getAccountById(uid) {
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

  static async updateAccount(id, accountUpdate) {
    const account = await AccountsModel.findOne({where: {uid: id}})
    // Need to use JSONB to manage updates to update subject.personal_info instead of a JSON field. 
    await SubjectsModel.upsert({
      verified: account.verified,
      subject_id: account.subject_id,
      personal_info: JSON.stringify(accountUpdate.personal_info)
    });
    return await AccountsModel.update(account, { where: { uid: id } });
  }
}

module.exports = AccountsService;
