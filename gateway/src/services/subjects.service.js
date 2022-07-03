const { Op } = require("sequelize");
const { SubjectsModel } = require("../models");
// const crypto = require("crypto");

class SubjectsService {
  constructor() {}

  static async createSubject(subject_id, personal_info, account) {
    const subject = await SubjectsModel.create({
      subject_id: subject_id.toString(),
      verified: false,
      personal_info: JSON.stringify(personal_info)
    });
    return subject.dataValues;
  }

  static async getSubjectById(id) {
    try {
      const subject = await SubjectsModel.findOne({
        where: {
          subject_id: id
        }
      });
      return subject ? { ...subject.dataValues } : null;
    } catch (e) {
      console.log("getSubjectById ERR=", e);
      return null;
    }
  }

}

module.exports = SubjectsService;
