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
const credentialService = require("../services/credential.service");
const uuid = require("uuid");
const moment = require("moment");
const AccountsService = require("../services/accounts.service");
const SubjectsService = require("../services/tasks.service");
const jdenticon = require("jdenticon");
const fs = require("fs");
const { NFTStorage, File, Blob } = require("nft.storage");
const NFT_STORAGE_TOKEN = process.env.NFT_STORAGE_API_KEY;
class TasksController {
  constructor() {}

  static async identicontest() {
    try {
      console.log("create identicon");
      const imageUrl = await TasksController.createIdenticon('31019718');
      // const imageUrl = JSON.parse(idtcUrl);
      console.log('IMAGE URL', imageUrl)
      const issued_at = new Date().toISOString();
      console.log('issued at', issued_at)
      const expires_at = moment().add(1, "m").toISOString(); // TBD Verified credencial expiration
      console.log('expires at', expires_at)
      // mint credential
      const args = {
        credential_id: uuid.v4(),
        receiver_id: "identicon.testnet",
        credential_metadata: {
          title: "Credencial de Prueba de Vida",
          description: "Verifiable Credential - proof of life",
          media: imageUrl,
          media_hash: null,
          copies: 1,
          issued_at: issued_at,
          expires_at: expires_at,
          starts_at: null,
          updated_at: null,
          extra: JSON.stringify({ name: "juan" }),
          reference: null,
          reference_hash: null,
        },
      };
      // guardar token id generado en bd
      // agregar en tabla de credencial  (request_id, credential_id)
      await credentialService.mintCredential(args);
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

  static async createIdenticon(subject_id, full_name) {
    try {
    const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });
    const name = `${subject_id}-${uuid.v4()}.png` 
    const image = jdenticon.toPng(name, 100);
    fs.writeFileSync("./testicon.png", image);
    const creationDate = new Date().toISOString();
    // Uploads the image to ipfs
    const ipfsRes = await client.store({
      name: `Credencial de Prueba de vida: ${full_name}`,
      description: `Credencial de Prueba Creada por identicon.network`,
      image: new File([image], name, { type: "image/svg" }),
      properties: {
        date: creationDate,
      },
    });
    console.log('IPFS result', ipfsRes)
    return `https://${pfsRes.ipnft}.ipfs.dweb.link`
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
        // console.log('personal info', personal_info)
        const idtcUrl = await TasksController.createIdenticon(
          account.subject_id,
          personal_info.full_name
        );
        const issued_at = new Date().toISOString();
        const expires_at = moment().add(1, "m").toISOString(); // TBD Verified credencial expiration
        console.log('expires at', expires_at)
        // mint credential
        const args = {
          credential_id: uuid.v4(),
          receiver_id: account.linked_account_uid,
          credential_metadata: {
            title: "Credencial de Prueba de Vida",
            description: "Verifiable Credential - proof of life",
            media: idtcUrl,
            media_hash: null,
            copies: 1,
            issued_at: issued_at,
            expires_at: expires_at,
            starts_at: null,
            updated_at: null,
            extra: JSON.stringify(personal_info),
            reference: null,
            reference_hash: null,
          },
        };
        // guardar token id generado en bd
        // agregar en tabla de credencial  (request_id, credential_id)
        await credentialService.mintCredential(args, account);
      }

      return new Success(verified.state);
    } catch (error) {
      console.log("udpateTaskResult ERR=", error);
      return new UnknownException(error);
    }
  }
}

module.exports = TasksController;
