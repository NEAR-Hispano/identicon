const { VerificationsModel } = require("../models/");
const EmailService = require("./email.service");
const crypto = require("crypto");
class VerificationsService {
  constructor() {}

  static async create(params) {
    return await VerificationsModel.create({params});
  }

}

module.exports = VerificationsService;
