const {
  Success,
  NotFoundError,
  UnknownException,
  ConflictError
} = require('../response');
const config = require('../config');
const NearService = require('../services/near.service');
//const verifications = require('../services/verifications.service');
const AccountsService = require('../services/accounts.service');
const subjects = require('../services/subjects.service');
const { getAccountOrError } = require('./controllers.helpers');
//const uuid = require('uuid');

class TasksController {
  constructor() {}

  static async getTasksAssigned({ 
    order,
    authorized_uid 
  }) {
    try {
      const [account, err] = await getAccountOrError(authorized_uid);
      if (err) 
        return err;

      // call the Contract
      const results = await NearService.getAssignedValidations(
        { order: order },
        account
      );
      console.log('\n\n',results,'\n\n');

      return new Success(results);
    }
    catch (error) {
      return new UnknownException(error);
    }
  }

  static async getTasksCompleted({ 
    order,
    authorized_uid 
  }) {
    try {
      const [account, err] = await getAccountOrError(authorized_uid);
      if (err) 
        return err;
      const results = [];
      return new Success(results);
    }
    catch (error) {
      return new UnknownException(error);
    }
  }

}

module.exports = TasksController;