import SessionsModel from '../models/';
import crypto from 'crypto';

class SessionsService {
  constructor() { }

  static async getSession(session_key) {
    const result = await SessionsModel.findAll({
      where: { key: session_key }
    });
    return (result.length && result[0]) || null;
  }

  static async createSession(contact, type) {
    const session = await SessionsModel.findAll({
      where: { contact: contact }
    });
    let entity;
    const passCode = crypto.randomInt(6);
    if (session) {
      // contact exists on session, update passcode
      entity = SessionsModel.update({passCode: passCode}, {where: {key: session.key}})
    } else {
      // new session
      entity = SessionsModel.create({
        key: crypto.randomUUID(),
        contact: contact,
        passCode: passCode,
        type: type
      })
    }
    return entity.key
  }
}

module.exports = SessionsService;
