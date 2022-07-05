const { Op } = require("sequelize");
const { VerificationsModel } = require("../models/");

class VerificationsService {
  constructor() {}

  static async createVerification(
    uid, 
    subject_id, 
    is_type, 
    personal_info, 
    account
  ) {
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

  static async getVerifications(
    requester_uid, 
    states
  ) {
    const result = await VerificationsModel.findAll({
      where: {
        account_uid: requester_uid,
        state: { [Op.in]: states }
      },
      order: [
        ['created_at', 'ASC']
      ],
    });
    return result;
  }
}

module.exports = VerificationsService;
