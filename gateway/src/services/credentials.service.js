const { Op } = require("sequelize");
const { CredentialModel } = require("../models");
const uuid = require("uuid");
class CredentialsService {
  constructor() {}

  static async create(subject_id, token_id) {
    const credential = await CredentialModel.create({
      uid: uuid.v4(),
      token_id: token_id.toString(),
      subject_id: subject_id.toString()
    });
    return credential.dataValues;
  }

  static async getByTokenId(id) {
    try {
      const credential = await CredentialModel.findOne({
        where: {
          token_id: id,
        },
      });
      return credential || null;
    } catch (e) {
      console.log("getCredentialByTokenId ERR=", e);
      return null;
    }
  }

  static async getBySubjectId(id) {
    try {
      const credential = await CredentialModel.findOne({
        where: {
          subject_id: id,
        },
      });
      return credential || null;
    } catch (e) {
      console.log("getCredentialBySubjectId ERR=", e);
      return null;
    }
  }
}

module.exports = CredentialsService;
