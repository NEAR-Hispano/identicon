const {
  Success,
  NotFoundError,
  UnknownException,
  ConflictError
} = require('../response');
const nearService = require('../services/near.service');
const verifications = require('../services/verifications.service');
const accountsService = require('../services/accounts.service');
const subjects = require('../services/subjects.service');
const { getAccountOrError } = require('./controllers.helpers');
const uuid = require('uuid');
const AccountsService = require('../services/accounts.service');

class VerificationsController {
  constructor() {}


  static async createVerification({ 
    subject_id, 
    type, 
    personal_info, 
    authorized_uid 
  }) {
    try {
      const [account, err] = await getAccountOrError(authorized_uid);
      if (err) 
        return err;

      // get Subject or create it
      let subject = await subjects.getById(subject_id);
      if (!subject)
        subject = await subjects.create(subject_id, personal_info);
      if (!subject || subject.error) 
        return new UnknownException(subject.error);

      // call the Contract
      const request_uid = uuid.v4();
      const result = await nearService.requestVerification({
          uid: request_uid,
          subject_id: subject_id,
          is_type: type,
          payload: JSON.stringify(personal_info),
        },
        account
      );
      console.log('\n\n',result,'\n\n');

      // also store it in DB for indexing
      const response = await verifications.createVerification(
        request_uid, subject_id, type, // all request verification info
        account // account requesting this verification
      );

      // now assign the validators with an async call BUT NO wait
      setTimeout(() => {
        this.assignValidators({
          request_uid: request_uid, 
          payload: personal_info
        }) ;
      }, 200);

      return new Success(response);
    }
    catch (error) {
      return new UnknownException(error);
    }
  }


  static async getVerifications({ 
    requester_uid, 
    states, 
    authorized_uid 
  }) {
    try {
      const [account, err] = await getAccountOrError(authorized_uid);
      if (err) 
        return err;

      if (authorized_uid !== requester_uid) 
        return new ConflictError(`Invalid requester_uid=${requester_uid}`);

      const response = await verifications.getFilteredBy(
        requester_uid || account.uid, 
        states || []
      );
      return new Success(response);
    }
    catch (error) {
      return new UnknownException(error);
    }
  }


  static async getOneVerification({ 
    uid, 
    authorized_uid 
  }) {
    try {
      const [account, err] = await getAccountOrError(authorized_uid);
      if (err) 
        return err;

      const verification = await verifications.getByUidWithSubject(uid);
      if (!verification)
        return new NotFoundError(`Not found the request with uid=${uid}`);

      return new Success(verification);
    }
    catch (error) {
      return new UnknownException(error);
    }
  }


  static async updateVerification({ 
    uid,
    subject_id, 
    type, 
    personal_info, 
    authorized_uid 
  }) {
    try {
      const [account, err] = await getAccountOrError(authorized_uid);
      if (err) 
        return err;
  
      let verification = await verifications.getByUid(uid);
      if (!verification)
        return new NotFoundError(`Not found the request with uid=${uid}`);
    
      // we must use check if the subject_id has changed.
      // so we can update the other subject info and its id too     
      await subjects.updateFields(verification.subject_id, {
        subject_id: subject_id, 
        personal_info: JSON.stringify(personal_info)
      });
  
      // now we can update the Verification with the changed data
      verification = await verifications.updateFields(uid, {
        subject_id: subject_id, 
        type: type
      });

      return new Success(verification);
    }
    catch (error) {
      return new UnknownException(error);
    }
  }


  static async assignValidators({
    request_uid,
    payload // personal info and ...
  }) {
    // find a set of validators filtered by country and language
    const validators = await AccountsService.getFilteredValidators({
      country: payload.country,
      languages: payload.languages
    });   
    
    const theSet = validators.map((t) => t.linked_account_uid);
    console.log(theSet);

//     nearService.assignValidators({
//        uid: request_uid 
//        validators_set: (validators || []).map((t) => t.linked_account_uid)
//     }, {})

  }
}

module.exports = VerificationsController;