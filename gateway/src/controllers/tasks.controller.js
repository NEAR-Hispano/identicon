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
const NearService = require("../services/near.service");
const TasksService = require("../services/tasks.service");
const VerificationsService = require("../services/verifications.service");
const { getAccountOrError } = require("./controllers.helpers");
const credentialService = require("../services/credentialNFT.service");
const uuid = require("uuid");
const moment = require("moment");
const AccountsService = require("../services/accounts.service");
const SubjectsService = require("../services/tasks.service");
const jdenticon = require("jdenticon");
const fs = require("fs");
const { Web3Storage, File} = require('web3.storage');
const CredentialsService = require("../services/credentials.service");
const WEB3_STORAGE_API_KEY = process.env.WEB3_STORAGE_API_KEY;
class TasksController {
  constructor() {}

  static async identicontest() {
    try {
      console.log("create identicon");
      const subject_id = 'AR_DNI_31019718';
      const token_id = uuid.v4();
      console.log('token id', token_id)
      const imageUrl = await TasksController.createIdenticonOnWeb3(token_id, subject_id, 'Juan Perez');
      // const imageUrl = JSON.parse(idtcUrl);
      console.log('IMAGE URL', imageUrl)
      const issued_at = new Date().toISOString();
      console.log('issued at', issued_at)
      const expires_at = moment().add(1, "m").toISOString(); // TBD Verified credencial expiration
      console.log('expires at', expires_at)
      // mint credential
      const args = {
        credential_id: token_id,
        receiver_id: "identicon.testnet",
        credential_metadata: {
          title: "AHORA ANDA?",
          description: "Verifiable Credential - TEST",
          media: `${imageUrl}`,
          copies: 1,
          extra: JSON.stringify({ name: "juan" })
        },
      };
      // guardar token id generado en bd
      // agregar en tabla de credencial  (request_id, credential_id)
      await credentialService.mintCredential(args);
      const credential = await CredentialsService.create(subject_id, token_id)
      console.log('CREDENTIAL', credential)
      return "todo bien";
    } catch (e) {
      console.log("ERROR", e);
    }
  }

  static async getTasksByState({ order, state, authorized_uid }) {
    try {
      const [account, err] = await getAccountOrError(authorized_uid);
      if (err) return err;

      // find indexed Tasks
      const tasks = await TasksService.getFilteredByValidator({
        validator_uid: authorized_uid,
        state: state,
        order: order,
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
          must_end: "",
          updated_at: t.updated_at,
        };
      });
      console.log("\n\n", results, "\n\n");

      return new Success(results);
    } catch (error) {
      return new UnknownException(error);
    }
  }

  static async getSingleTask({ uid, authorized_uid }) {
    try {
      const [account, err] = await getAccountOrError(authorized_uid);
      if (err) return err;

      const t = await TasksService.getByIdWithSubjectInfo({
        uid: uid,
      });

      const result = {
        uid: t.uid,
        subject_id: t.subject_id,
        full_name: t.personal_info.full_name,
        result: t.result,
        remarks: t.remarks,
        contents: JSON.stringify(t.contents),
        must_start: t.created_at,
        must_end: "",
        info: t.personal_info,
      };
      console.log("\n\n", result, "\n\n");

      return new Success(result);
    } catch (error) {
      return new UnknownException(error);
    }
  }

  static async createIdenticonOnWeb3(token_id, subject_id, full_name) {
    try {
    const client = new Web3Storage({ token: WEB3_STORAGE_API_KEY });
    const name = `${subject_id}-${uuid.v4()}.png` 
    const image = jdenticon.toPng(name, 100);
    // Uploads the image to ipfs
    const cid = await client.put([new File([image], name)], { name: name, wrapWithDirectory: false, maxRetries: 3});
    return `https://${cid}.ipfs.dweb.link`
  }
    catch (e) {
      console.log(`error creating identicon - ${e}`)
    }
  }

  static async udpateTaskResult({
    uid,
    result,
    remarks,
    contents,
    authorized_uid,
  }) {
    try {
      console.log("entro ");
      const [account, err] = await getAccountOrError(authorized_uid);
      console.log("account", account);
      if (err) return err;
      if (!account) return NotFoundError(`Account ${authorized_uid} not found`);

      const task = await TasksService.getByUid(uid);
      if (!task) return NotFoundError(`Task ${uid} not found`);

      const verified = await NearService.reportValidationResult(
        {
          request_uid: task.request_uid,
          result: result,
          contents: contents,
          remarks: remarks,
        },
        account
      );

      await TasksService.update(uid, {
        state: "F", // task was completed !
        result: result,
        remarks: remarks,
        contents: contents,
      });

      await VerificationsService.updateState(task.request_uid, {
        state: verified.state,
      });

      if (isVerificationDone(verified.state)) {
        // if verification has been completed,
        // send an Email to Requester...   // include identicon message
      }

      if (isVerificationApproved(verified.state)) {
        const subject = await SubjectsService.getByUid(account.subject_id);
        const personal_info = JSON.parse(subject.personal_info);
        const tokenId = uuid.v4()
        // console.log('personal info', personal_info)
        const idtcUrl = await TasksController.createIdenticonOnWeb3(
          tokenId,
          account.subject_id,
          personal_info.full_name
        );
        const issued_at = new Date().toISOString();
        const expires_at = moment().add(1, "m").toISOString(); // TBD Verified credencial expiration
        console.log('expires at', expires_at)
        // mint credential
        const args = {
          credential_id: tokenId,
          receiver_id: account.linked_account_uid,
          credential_metadata: {
            title: "Credencial de Prueba de Vida",
            description: "Verifiable Credential - proof of life",
            media: `${idtcUrl}`,
            copies: 1,
            extra: JSON.stringify(personal_info)
          },
        };
        // guardar token id generado en bd
        // agregar en tabla de credencial  (request_id, credential_id)
        await credentialService.mintCredential(args, account);
        await CredentialsService.create(account.subject_id, tokenId)
      }

      return new Success(verified.state);
    } catch (error) {
      console.log("udpateTaskResult ERR=", error);
      return new UnknownException(error);
    }
  }
}

module.exports = TasksController;
