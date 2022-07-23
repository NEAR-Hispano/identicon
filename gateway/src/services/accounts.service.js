const { Op } = require("sequelize");
const { AccountsModel, SubjectsModel } = require("../models");
const uuid = require("uuid");
const { encryptIt } = require('../utils/cypher.utils');

class AccountsService {
  constructor() {}

  static async createAccount(session, near_account) {
    const encryptedKeys = encryptIt({
      public_key: near_account.public_key,
      private_key: near_account.private_key,
    });

    const account = await AccountsModel.create({
      uid: uuid.v4().replace(new RegExp('-', 'g'), ''), 
      type: session.type,
      email: session.contact,
      phone: session.contact, // ToDo. manage email/phone store
      linked_account_uid: near_account.id, 
      subject_id: null, // ToDo. subject_id should be null on creation, to be set on create verification
      keys: encryptedKeys,
      state: 'A',
      verified: false
    });
    return account;
  }

  static async getAccountById(uid) {
    try {
      const account = await AccountsModel.findOne({
        where: {
          uid: uid
        },
      });
      const subject = await SubjectsModel.findOne({
        where: {
          subject_id: account.subject_id
        }
      });
      return {
        ...account,
        personal_info: subject ? subject.personal_info : null
      };
    } catch (e) {
      console.log("error: ", e);
      return {
        error: e
      };
    }
  }

  static async getAccountByContact(contact) {
    const result = await AccountsModel.findOne({
      where: {
        [Op.or]: [{
          email: contact
        }, {
          phone: contact
        }],
      },
    });
    return result;
  }

  static async getAccounts() {
    const result = await AccountsModel.findAll({
      order: [
        ["id", "ASC"]
      ],
    });
    return result;
  }

  static async updateAccount(id, account, accountUpdate) {
    let subjectId = account.subject_id;
    const personal = accountUpdate.personal_info;
    console.log("account subject_id", subjectId);
    if (subjectId == undefined || !subjectId) {
      // create unique subject_id (did) based on identicon docs AR_DNI_xxxxxxxxxx
      subjectId = `${personal.country}_DNI_${personal.dni}`.toUpperCase(); 
    }
    console.log("updating subject  ", {
      verified: account.verified,
      subject_id: subjectId,
      personal_info: JSON.stringify(accountUpdate.personal_info),
    });
    await SubjectsModel.upsert({
      verified: account.verified,
      subject_id: subjectId,
      personal_info: JSON.stringify(accountUpdate.personal_info),
    });

    return await AccountsModel.update({
      ...account,
      subject_id: subjectId
    }, {
      where: {
        uid: id
      }
    });
  }

  static async deleteAccount(id) {
    return await AccountsModel.update({
      state: "D"
    }, {
      where: {
        uid: id
      }
    });
  }
}

module.exports = AccountsService;