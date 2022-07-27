const { Op } = require("sequelize");
const uuid = require('uuid');
const { TasksModel, sequelize } = require("../models");
const { defaultValidationType, initialVerificationState, TaskStates, initialTaskState } = require('../models/definitions');

// const crypto = require("crypto");

class SubjectsService {
  constructor() {}

  static async create({ 
    request_uid,
    validator_uid,
    type
  }) {
    const task = await TasksModel.create({
      uid: uuid.v4(),
      request_uid: request_uid,
      validator_uid: validator_uid,
      type: type || defaultValidationType,
      state: initialTaskState,
      result: initialVerificationState,
      contents: '[]',
      remarks: ''
    });
    return task;
  }

  static async update(
    uid, 
    fields
  ) {
    let task = await this.getByUid(uid) ;
    if (!task) 
      return null;
    if (fields.contents) 
      fields.contents = JSON.stringify(fields.contents);
    task.set(fields);
    await task.save();
    return task;
  }


  static async getByUid(uid) {
    try {
      const t = await TasksModel.findOne({
        where: { uid: uid }
      });
      return t || null;
    } catch (e) {
      console.log('task.service getByUid ERR=', e);
      return null;
    }
  }


  static async getFilteredByValidator({
    validator_uid, 
    state
  }) {
    // const sql = `
    //   SELECT t.*, vr.subject_id, su.personal_info 
    //   FROM tasks as t, subjects as su, verifications as vr
    //   WHERE 
    //     t.validator_uid ='${validator_uid}'  AND t.state='${state}'
    //     AND (vr.request_uid = t.request_uid)
    //     AND (vr.subject_id = su.subject_id)
    // `;
    const sql = `
      SELECT t.*, vr.subject_id, su.personal_info 
      FROM tasks as t, subjects as su, verifications as vr
      WHERE 
        t.validator_uid = '${validator_uid}'  AND t.state != 'X'
        AND (vr.request_uid = t.request_uid)
        AND (vr.subject_id = su.subject_id)
    `;
    const [results, _] = await sequelize.query(sql);
    return results.map((r) => {
      r.personal_info = JSON.parse(r.personal_info);
      return r;
    });
  }


  static async getByIdWithSubjectInfo({
    uid
  }) {
    const sql = `
      SELECT t.*, vr.subject_id, su.personal_info 
      FROM tasks as t, subjects as su, verifications as vr
      WHERE 
        t.uid ='${uid}'
        AND (vr.request_uid = t.request_uid)
        AND (vr.subject_id = su.subject_id)
    `;
    const [results, _] = await sequelize.query(sql);
    if (!results || !results.length)
      return null;
    let r = results[0]; // we just need the first one !
    r.personal_info = JSON.parse(r.personal_info);
    return r;
  }
}

module.exports = SubjectsService;
