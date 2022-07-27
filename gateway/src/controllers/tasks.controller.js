const config = require('../config');
const { Success, NotFoundError, UnknownException, ConflictError } = require('../response');
const { initialTaskState, finalTaskState, TaskStates } = require('../models/definitions')
const NearService = require('../services/near.service');
const TasksService = require('../services/tasks.service');
const { getAccountOrError } = require('./controllers.helpers');

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
      const tasks = await TasksService.getFilteredBy({
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
          result: t.result,
          contents: JSON.stringify(t.contents),
          must_start: t.created_at,
          must_end: ''
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

}

module.exports = TasksController;