const config = require("../config");
const {
  Success,
  NotFoundError,
  UnknownException,
  ConflictError,
} = require("../response");
const {
  initialTaskState,
  finalTaskState,
  TaskStates,
  isVerificationDone,
  isVerificationApproved,
} = require("../models/definitions");
const CredentialNFTService = require("../services/credentialNFT.service");

const { getAccountOrError } = require("./controllers.helpers");

class CredentialsController {
  constructor() {}

  static async getCredentialMetadada(token_id) {
    try {
    console.log('TOKEN ID ', token_id)
      const result = await CredentialNFTService.getCredentialMetadata(token_id);
     
      console.log("\n\n", result, "\n\n");

      return new Success(result);
    } catch (error) {
      return new UnknownException(error);
    }
  }
}

module.exports = CredentialsController;
