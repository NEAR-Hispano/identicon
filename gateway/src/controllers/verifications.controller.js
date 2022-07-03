const { response } = require("express");
const {
  Success,
  NotFoundError,
  MissingParams,
  GenericError,
  UnknownException,
} = require("../response");
const verificationsService = require("../services/verifications.service");
const accountsService = require("../services/accounts.service");
const subjectsService = require("../services/subjects.service");

class VerificationsController {
  constructor() {}

  static async createVerification(payload, authorized) {
    let {subject_id, type, personal_info} = payload;

    // check if the Account exists
    const account_uid = authorized.account_data.id;
    let account = await accountsService.getAccountById(account_uid);
    if (account.error) return new NotFoundError(account.error);
    account = account.dataValues;

    // check Subject or create it
    let subject = await subjectsService.getSubjectById(subject_id);
    if (!subject) {
      subject = await subjectsService.createSubject(subject_id, personal_info, account);
    } 
    if (!subject || subject.error) return new UnknownException(subject.error);

    const response = await verificationsService.createVerification(
      subject_id, type, personal_info, // all subject info
      account // account requesting this verification
    );
    if (response) {
      return new Success(response);
    } else {
      return new NotFoundError(response);
    }
  }
}

module.exports = VerificationsController;