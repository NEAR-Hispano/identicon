const {
  Success,
  NotFoundError,
  UnknownException,
  ConflictError
} = require('../response');
const config = require('../config');
const nearService = require('../services/near.service');
const verifications = require('../services/verifications.service');
const accountsService = require('../services/accounts.service');
const subjects = require('../services/subjects.service');
const tasksService = require('../services/tasks.service');
const { getAccountOrError } = require('./controllers.helpers');
const uuid = require('uuid');

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

      // call the Contract
      const request_uid = uuid.v4();
      personal_info.subject_id = subject_id;
      const result = await nearService.requestVerification({
          uid: request_uid,
          subject_id: subject_id,
          is_type: type,
          payload: JSON.stringify(personal_info),
        },
        account
      );
      console.log('\n\n',result,'\n\n');

      // now assign the validators 
      const validators = await this.assignValidators({
        request_uid: request_uid, 
        payload: personal_info
      }) ;

      // also store it in DB for indexing
      const response = await verifications.createVerification(
        // all request verification info
        request_uid, subject_id, type, result.state, 
        account // account requesting this verification
      );

      // get Subject or create it
      let subject = await subjects.getById(subject_id);
      if (!subject)
        subject = await subjects.create(subject_id, personal_info);
      if (!subject || subject.error) 
        return new UnknownException(subject.error);

      for (var j=0; j < validators.length; j++) {
        const validator = await accountsService.getAccountByLinkedId(validators[j]);
        if (validator) {
          // add the tasks to DB for indexing
          const task = await tasksService.create({
            request_uid: request_uid,
            validator_uid: validator.uid,
            type: type 
          });

          // also send mail to validators
          console.log('Email to=', validator.uid, validator.email, ' Task=', task);
        }
      }

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

      let verification = await verifications.getByUidWithSubject(uid);
      if (!verification)
        return new NotFoundError(`Not found the request with uid=${uid}`);

      try {
        let updated = await nearService.getVerification(
          { uid: verification.request_uid },
          account
        );
        verifications.updateFields(uid, {
          state: updated.state
        });
        verification.state = updated.state;
        verification.contract = updated;
      }
      catch (err) {
        console.log('getOneVerification ERR=', err)
      }

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
    const validators = await accountsService.getFilteredValidators({
      country: payload.country,
      languages: payload.languages || config.countryLanguages[payload.country]
    });   
    
    const theSet = validators.map((t) => t.linked_account_uid);
    console.log(theSet);
    try {
      const selected = await nearService.assignValidators({
        uid: request_uid, 
        validators_set: (validators || []).map((t) => t.linked_account_uid)
      });
      console.log('assignValidators selected=', selected);
      return selected;
    }
    catch (err) {
      console.log('assignValidators failed ERR=', err);
      return [];
    }
  }
}

module.exports = VerificationsController;