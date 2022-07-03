const { VerificationsModel } = require("../models/");
//const EmailService = require("./email.service");
//const crypto = require("crypto");
const uuid = require("uuid");

class VerificationsService {
  constructor() {}

  static async createVerification(uid, subject_id, is_type, personal_info, account) {
    const verification = await VerificationsModel.create({
      request_uid: uid,
      account_uid: account.uid,
      subject_id: subject_id,
      type: is_type,
      state: 'UN',
      result: null,
      must_start_utc: '2022-01-01 00:00:00',
      must_end_utc:  '2022-01-01 00:00:00',
    });
    return verification.dataValues;
  }

}

module.exports = VerificationsService;
