const { Op } = require("sequelize");
const { SubjectsModel } = require("../models");
// const crypto = require("crypto");

class SubjectsService {
  constructor() {}

  static async create(subject_id, personal_info) {
    const subject = await SubjectsModel.create({
      subject_id: subject_id.toString(),
      verified: false,
      personal_info: JSON.stringify(personal_info)
    });
    return subject.dataValues;
  }

  static async updateFields(subject_id, fields) {
    let subject = await this.getById(subject_id);
    subject.set(fields);
    await subject.save();
    return subject;
  }

  static async getById(id) {
    try {
      const subject = await SubjectsModel.findOne({
        where: {
          subject_id: id
        }
      });
      return subject || null;
    } catch (e) {
      console.log("getSubjectById ERR=", e);
      return null;
    }
  }
}

module.exports = SubjectsService;
