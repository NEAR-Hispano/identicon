const { Op } = require("sequelize");
const { AccountsModel, SubjectsModel } = require("../models");
const uuid = require("uuid");
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

  static async updateAccount(id, account, accountUpdate) {
    let subjectId = account.subject_id;
    if (!subject_id) {
      subjectId = uuid.v4(); // Todo: create unique subject_id (did) based on identicon docs AR_DNI_xxxxxxxxxx
    }
    await SubjectsModel.upsert({
      verified: account.verified,
      subject_id: subjectId,
      personal_info: JSON.stringify(accountUpdate.personal_info),
    });
    return await AccountsModel.update(
      { ...account, subject_id: subjectId },
      { where: { uid: id } }
    );
  }
  
  static async deleteAccount(id) {
    return await AccountsModel.update({ state: 'D'}, { where: { uid: id}})
  }
}

module.exports = AccountsService;
