const {SessionsModel} = require('../models/');
const crypto = require('crypto');
class SessionsService {
  constructor() { }

  static async getSessionByKey(session_key) {
    return await SessionsModel.findOne({
      where: { key: session_key }
    });
  }

  static async getSessionByContact(contact) {
    return await SessionsModel.findOne({
      where: { contact: contact }
    });
  }

  static async createSession(contact, type) {
    const session = await SessionsModel.findOne({
      where: { contact: contact }
    });
    let sessionKey;
    const passcode = crypto.randomInt(0,999999).toString();
    console.info('pass code ', passcode)
    const passCodeHash = crypto.createHash('sha256').update(passcode).digest('base64');
    console.info('session', session)
    if (session !== null) {
      console.info('contact exists', session)
      // contact exists on session, update passcode
      const result = await SessionsModel.update({passcode: passCodeHash}, {where: {key: session.key}})
      console.log('update result', result)
      sessionKey = session.key
    } else {
      // new session
      console.info('new contact')
      const entity = await SessionsModel.create({
        key: crypto.randomUUID(),
        contact: contact,
        passcode: passCodeHash,
        type: type
      })
      sessionKey = entity.key
    }

    // TODO SEND EMAIL
    return await SessionsModel.findOne({where: {key: sessionKey}});
  }

  static async deleteSession(session_key) {
    await SessionsModel.destroy({
      where: { key: session_key}
    });
  }

  static async verifyPasscode(session_passcode, passcode) {
    const passcodeHash = crypto.createHash('sha256').update(passcode).digest('base64');
    console.info('session passcode', session_passcode);
    console.info('passcode to verify', passcodeHash)
    return session_passcode === passcodeHash;
  }
  
  static async updatePasscode(session) {
    const passcode = crypto.randomInt(0,999999).toString();
    console.info('pass code ', passcode)
    const passCodeHash = crypto.createHash('sha256').update(passcode).digest('base64');

      // contact exists on session, update passcode
      const result = await SessionsModel.update({passcode: passCodeHash}, {where: {key: session.key}})
      console.log('update result', result)

    // TODO SEND EMAIL
    return await SessionsModel.findOne({where : {key: session.key}})
  }
}

module.exports = SessionsService;