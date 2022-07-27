const { Op } = require("sequelize");
const { AccountsModel, SubjectsModel, FeaturesModel, sequelize } = require("../models");
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

  static async getAccountByLinkedId(linked_id) {
    const result = await AccountsModel.findOne({
      where: { linked_account_uid: linked_id },
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

    // allways update the Subject binded to this account and
    // assign a subject_id (did) based on Country and Dni
    // so we can get something like: 'AR_DNI_xxxxxxxxxx'
    subjectId = `${personal.country}_DNI_${personal.dni}`.toUpperCase(); 
    await SubjectsModel.upsert({
      verified: account.verified,
      subject_id: subjectId,
      personal_info: JSON.stringify(accountUpdate.personal_info),
    });

    // need to update features binded to this account
    // because we will need them to filter validators
    await FeaturesModel.upsert({
      account_uid: id,
      country: personal.country,
      idioms: personal.languages
    });

    return await AccountsModel.update({
      ...account,
      subject_id: subjectId
    }, { 
      where: { uid: id }
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


  static async getFilteredValidators({
    country, 
    languages 
  }) {
    const sql = `
      SELECT 
        acc.uid, acc.linked_account_uid
      FROM accounts as acc, features as fe
      WHERE 
        (acc.uid = fe.account_uid)
        AND acc.state in ('A')
        AND acc.type = 'VL'
        AND fe.country = '${country}'  
        AND fe.idioms = '${languages}';  
    `;
    const [results, _] = await sequelize.query(sql);
    return results;
  }

}

module.exports = AccountsService;