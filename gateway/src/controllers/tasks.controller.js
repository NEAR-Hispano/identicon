const config = require('../config');
const { Success, NotFoundError, UnknownException, ConflictError } = require('../response');
const { initialTaskState, finalTaskState, TaskStates, isVerificationDone, isVerificationApproved } = require('../models/definitions');
const NearService = require('../services/near.service');
const TasksService = require('../services/tasks.service');
const VerificationsService = require('../services/verifications.service');
const { getAccountOrError } = require('./controllers.helpers');
const credentialService = require('../services/credential.service');
const uuid = require('uuid');
const moment = require('moment');
const AccountsService = require('../services/accounts.service');
const SubjectsService = require('../services/tasks.service');
class TasksController {
  constructor() {}

  static async getTasksByState({ 
    order,
    state,
    authorized_uid 
  }) {
    try {
      const [account, err] = await getAccountOrError(authorized_uid);
      if (err) 
        return err;

      // find indexed Tasks 
      const tasks = await TasksService.getFilteredByValidator({
        validator_uid: authorized_uid,
        state: state,
        order: order
      });

      const results = tasks.map((t) => {
        const info = t.personal_info;
        return {
          uid: t.uid,
          subject_id: t.subject_id,
          full_name: info.full_name,
          state: t.state,
          result: t.result,
          contents: JSON.stringify(t.contents),
          must_start: t.created_at,
          must_end: '',
          updated_at: t.updated_at
        };
      });
      console.log('\n\n',results,'\n\n');

      return new Success(results);
    }
    catch (error) {
      return new UnknownException(error);
    }
  }


  static async getSingleTask({ 
    uid,
    authorized_uid
  }) {
    try {
      const [account, err] = await getAccountOrError(authorized_uid);
      if (err) 
        return err;

      const t = await TasksService.getByIdWithSubjectInfo({
        uid: uid
      });

      const result = {
        uid: t.uid,
        subject_id: t.subject_id,
        full_name:  t.personal_info.full_name,
        result: t.result,
        remarks: t.remarks,
        contents: JSON.stringify(t.contents),
        must_start: t.created_at,
        must_end: '',
        info: t.personal_info
      };
      console.log('\n\n',result,'\n\n');

      return new Success(result);
    }
    catch (error) {
      return new UnknownException(error);
    }
  }


  static async udpateTaskResult({ 
    uid,
    result,
    remarks,
    contents,
    authorized_uid 
  }) {
    try {
      const [account, err] = await getAccountOrError(authorized_uid);
      if (err) 
        return err;

      const task = await TasksService.getByUid(uid);
      if (!task)
        return NotFoundError(`Task ${uid} not found`);

      const verified = await NearService.reportValidationResult({
        request_uid: task.request_uid, 
        result: result, 
        contents: contents, 
        remarks: remarks
      }, account);

      await TasksService.update(uid, {
        state: 'F', // task was completed !
        result: result,
        remarks: remarks,
        contents: contents
      });

      await VerificationsService.updateState(task.request_uid, {
        state: verified.state
      });

      if (isVerificationDone(verified.state)) {
        // if verification has been completed, 
        // send an Email to Requester ...
      }

      if (isVerificationApproved(verified.state)) {
        const subject = await SubjectsService.getByUid(account.subject_id);
              
        const issued_at = Date.now();
        const expires_at = moment().add(1, 'm').toDate(); // TBD Verified credencial expiration
        // mint credential
        const args = {
          credential_id:  uuid.v4(),
          receiver_id: account.linked_account_uid,
          credential_metadata: {
            title: 'Credencial de Prueba de Vida',
            description: 'Verifiable Credential - proof of life',
            media: null,
            media_hash: null,
            copies: 1,
            issued_at: issued_at,
            expires_at: expires_at,
            starts_at: None,
            updated_at: None,
            extra: JSON.stringify(subject.personal_info),
            reference: None,
            reference_hash: None,
          }
        }
        await credentialService.mintCredential(args);
      }

      return new Success(verified.state);
    }
    catch (error) {
      console.log("udpateTaskResult ERR=", error);
      return new UnknownException(error);
    }
  }
}

module.exports = TasksController;
