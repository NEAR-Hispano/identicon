const { Op } = require('sequelize');
const { VerificationsModel, sequelize } = require('../models/');
const { VerificationStates, isVerificationDone, isVerificationPending } = require('../models/definitions');

class VerificationsService {
  constructor() {}

  static async createVerification(
    uid, 
    subject_id, 
    is_type,
    state, 
    account
  ) {
    const verification = await VerificationsModel.create({
      request_uid: uid,
      account_uid: account.uid,
      subject_id: subject_id,
      type: is_type,
      state: state,
      result: null,
      must_start_utc: '2022-01-01 00:00:00',
      must_end_utc:  '2022-01-01 00:00:00',
    });
    return verification;
  }

  static async updateFields(
    request_uid, 
    fields
  ) {
    let verification = await this.getByRequestUid(request_uid) ;
    verification.set(fields);
    await verification.save();
    return verification;
  }

  static async updateState(
    request_uid, 
    fields
  ) {
    let verification = await this.getByRequestUid(request_uid) ;
    if (isVerificationDone(fields.state)) {
      fields.result = fields.state;
    }
    verification.set(fields);
    await verification.save();
    return verification;
  }

  static async getFilteredBy(
    requester_uid, 
    states
  ) {
    const statesSet = states.map(t => `'${t}'`).join(',');
    const sql = `
      SELECT v.*, su.personal_info FROM verifications as v, subjects as su
      WHERE 
        v.account_uid ='${requester_uid}'  AND v.state in (${statesSet})
        AND (v.subject_id = su.subject_id)
    `;
    const [results, _] = await sequelize.query(sql);
    return results.map((t) => {
      t.personal_info = JSON.parse(t.personal_info);
      return t;
    });
  }

  static async getByRequestUid(uid) {
    const subject = await VerificationsModel.findOne({
      where: { request_uid: uid }
    });
    return subject;
  }

  static async getByUidWithSubject(
    uid
  ) {
    const sql = `
      SELECT v.*, su.personal_info FROM verifications as v, subjects as su
      WHERE 
        v.request_uid ='${uid}' AND (v.subject_id = su.subject_id)
    `;
    const [results, _] = await sequelize.query(sql);
    if (!results.length) 
      return null; 
    let one = results[0];
    one.personal_info = JSON.parse(one.personal_info);
    return one;
  }
}

module.exports = VerificationsService;
