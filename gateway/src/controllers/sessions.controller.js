const {
  Success,
  NotFoundError,
  MissingParams,
  UnauthorizedError,
  ConflictError,
  GenericError,
} = require("../response");
const AccountsService = require("../services/accounts.service");
const SessionsService = require("../services/sessions.service");
const { createImplicitAccount } = require("../services/near.service");
const AuthService = require("../services/auth.service");
const Uuid = require('uuid');
class SessionsController {
  constructor() {}

  static async getSession(session_key) {
    const response = await SessionsService.getSession(session_key);
    if (response) {
      return new Success(response);
    } else {
      return new NotFoundError(response);
    }
  }

  static async createSession(params) {
    const { email, phone, type } = params;
    if (!email && !phone) {
      return new MissingParams("Email or Phone is required");
    }
    const contact = email || phone;
    try {
      const account = await AccountsService.getAccountByContact(contact);
      if (account) {
        return new ConflictError("User is already registered");
      }

      const session_key = await SessionsService.createSession(contact, type);
      const response = {
        session: session_key,
        requires_passcode: true,
        requires_password: false,
      };
      return new Success(response);
    } catch (err) {
      console.info({ error_message: err });
      return new GenericError(err);
    }
  }
  static async login(params) {
    const { session_key, passcode } = params;
    if (!session_key && !passcode) {
      return new MissingParams("Passcode & Session Key required");
    }
    try {
      const session = await SessionsService.getSession(session_key);
      if (!session)  {
          return new ConflictError('Session not found')
      }
      const valid = await SessionsService.verifyPasscode(session.passcode, passcode);
      if (!valid) {
        return new UnauthorizedError("Passcode is not valid");
      }
      let account = await AccountsService.getAccountByContact(
        session.contact
      );
      //
      if (!account) {
        const nearAccount = await createImplicitAccount();
        account = await AccountsService.createAccount(session, nearAccount)
      }
      const payload = {
        account_data: {
          id: account.uid,
          email: account.email,
          phone: account.phone,
          verified: account.verified,
          user_type: account.user_type,
        },
        near_account_data: {
          //TBD if we want to return near account data, eg account id
          account_id: account.linked_account_uid
        }
      };
      const token = AuthService.generateAccessToken(payload);
      SessionsService.deleteSession(session_key)
      return new Success({ id: account.uid, token });
    } catch (err) {
      console.info({ error_message: err });
      return new GenericError(err);
    }
  }
}

module.exports = SessionsController;
