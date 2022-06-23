const { response } = require("express");
const {
  Success,
  NotFoundError,
  MissingParams,
  GenericError,
} = require("../response");
const verificationsService = require("../services/verifications.service");

class VerificationsController {
  constructor() {}

  static async createVerification(params) {
    const response = await verificationsService.createVerification(params);
    if (response) {
      return new Success(response);
    } else {
      return new NotFoundError(response);
    }
  }


}

module.exports = VerificationsController;
