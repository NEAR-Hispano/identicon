const {
  Success,
  NotFoundError,
  UnknownException,
  ConflictError
} = require('../response');
const nearService = require('../services/near.service');
const verificationsService = require('../services/verifications.service');
const { getAccountOrError } = require('./controllers.helpers');
const accountsService = require('../services/accounts.service');
const subjectsService = require('../services/subjects.service');
const uuid = require('uuid');

class VerificationsController {
  constructor() {}


  static async createVerification({ 
    subject_id, 
    type, 
    personal_info, 
    authorized_uid 
  }) {
    // check if the Account exists
    const account_uid = authorized_uid;
    let account = await accountsService.getAccountById(account_uid);
    if (account.error) return new NotFoundError(account.error);
    account = account.dataValues;

    // check Subject or create it
    let subject = await subjectsService.getSubjectById(subject_id);
    if (!subject) {
      subject = await subjectsService.createSubject(subject_id, personal_info, account);
    } 
    if (!subject || subject.error) return new UnknownException(subject.error);

    const request_uid = uuid.v4();
    const args = {
      uid: request_uid,
      subject_id: subject_id,
      is_type: type,
      payload: JSON.stringify(personal_info),
    };
    try {
      // call the Contract
      const result = await nearService.requestVerification(args, account);
      console.log('\n\n',result,'\n\n');
      // also store it in DB 
      const response = await verificationsService.createVerification(
        request_uid, subject_id, type, personal_info, // all subject info
        account // account requesting this verification
      );
      return new Success(response);
    }
    catch (error) {
      return new NotFoundError(error);
    }
  }


  static async getVerifications({ 
    requester_uid, 
    states, 
    authorized_uid 
  }) {
    const { account, error } = await getAccountOrError(authorized_uid);
    if (error) 
      return error;
    if (authorized_uid !== requester_uid) 
      return new ConflictError(`Invalid requester_uid=${requester_uid}`);
    try {
      const response = await verificationsService.getVerifications(
        requester_uid || account.uid, 
        states || []
      );
      return new Success(response);
    }
    catch (error) {
      return new UnknownException(error);
    }
  }
}

module.exports = VerificationsController;