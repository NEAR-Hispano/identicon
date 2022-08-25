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
const NearService = require("../services/near.service");
const AuthService = require("../services/auth.service");

class SessionsController {
  constructor() {}

  static async getSession(session_key) {
    const response = await SessionsService.getSessionByKey(session_key);
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

      const session = await SessionsService.createSession(contact, type);
      const response = {
        session: session.key,
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
      const session = await SessionsService.getSessionByKey(session_key);
      if (!session)  {
        return new ConflictError('La sesión no pudo ser encontrada')
      }
      const valid = await SessionsService.verifyPasscode(session.passcode, passcode);
      if (!valid) {
        return new UnauthorizedError("Código no válido");
      }
      let account = await AccountsService.getAccountByContact(
        session.contact
      );
      
      if (!account) {
        // We create a new NEAR account for this user with public & private keys
        const [nearAccount, receipt] = await NearService.createImplicitAccount();
        
        // Must be stored in our index database with encripted keys
        account = await AccountsService.createAccount(session, nearAccount);

        // If the new account is a Validator, me must register him 
        // and indicate which types of validations can perform
        //await NearService.registerAsValidator({can_do: ['ProofOfLife']}, account);        
      }

      const payload = {
        account_data: {
          id: account.uid,
          email: account.email,
          phone: account.phone,
          verified: account.verified,
          user_type: account.user_type
        },
        near_account_data: {
          //TBD if we want to return near account data, eg account id
          account_id: account.linked_account_uid
        }
      };
      const token = AuthService.generateAccessToken(payload);
      console.log('')
      // axios.defaults.headers.common[
      //   "Authorization"
      // ] = `Bearer ${session.token}`;
      SessionsService.deleteSession(session_key)
      return new Success({ id: account.uid, token });
    } catch (err) {
      console.info({ error_message: err });
      return new GenericError(err);
    }
  }

  static async recovery(params) {
    const {email, phone} = params;
    if (email && phone) {
      return new MissingParams("Either mail or phone is required not both");
    }

    if (!email && !phone) {
      return new MissingParams("Mail or phone is required");
    }
    const contact = email || phone;
    try {
      const account = await AccountsService.getAccountByContact(contact);
      if (!account) {
        return new NotFoundError("User not exists");
      }

      let session = await SessionsService.getSessionByContact(contact);
      if (session) {
        session = await SessionsService.updatePasscode(session);
      } else {
        session = await SessionsService.createSession(contact, account.type);
      }

      const response = {
        session: session.key,
        requires_passcode: true,
        requires_password: false,
      };
      return new Success(response);
    } catch (err) {
      console.info({ error_message: err });
      return new GenericError(err);
    }
  }
}

module.exports = SessionsController;
