import { Success, NotFoundError, MissingParams, UnknownException, ConflictError } from '../response';
import AccountsService from '../services/accounts.service';
import SessionsService from '../services/sessions.service';

class SessionsController {
  constructor() { }

  static async getSession(session_key) {
    const response = await SessionsService.getSession(session_key);
    if (response) {
      return new Success(response);
    } else {
      return new NotFoundError(response);
    }
  }

  static async createSession(params) {
    const {email, phone, type} = params;
    if (!email || !phone) {
      return new MissingParams("Email or Phone is required")
    }
    const contact = email || phone;
    try {
      const account = await AccountsService.getAccountByContact(contact);
      if (account) {
        return new ConflictError('User is already registered')
      }

      const session_key = await SessionsService.createSession(contact, type);
      const response = {
        session: session_key,
        requires_passcode: true,
        requires_password: false
      }
      return new Success(response);
    } catch (err) {
      console.info({error_message: err})
      return new UnknownException()
    }
  }
}

module.exports = SessionsController;
