class Response {
  constructor(code, msg) {
    this.status = code;
    this.body = msg;
  }
}

class Success extends Response {
  constructor(msg = null) {
    if (!msg) {
      msg ={ msg: 'Ok' };
    }
    super(200, msg);
  }
}


class MissingParams extends Response {
  constructor(msg) {
    if (msg !== undefined) super(400, msg);
    else super(400, { 
      code: '400',
      msg: 'Missing params' 
    });
  }
}

class UnknownException extends Response {
  constructor() {
    super(500, { 
      code: '500',
      msg: 'Unknown Exception' 
    });
  }
}

class ForbiddenError extends Response {
  constructor(msg = null) {
    if (!msg) {
      msg = 'Wrong key';
    }
    super(403, { 
      code: '403',
      msg:  msg});
  }
}

class UnauthorizedError extends Response {
  constructor(msg = null) {
    if (!msg) {
      msg = 'Unauthorized';
    }
    super(401, { 
      code: '401',
      msg:  msg});
  }
}

class NotFoundError extends Response {
  constructor() {
    super(404, { 
      code: '404',
      msg: 'Not found' });
  }
}

class CustomError extends Response {
  constructor(code, msg) {
    super(code, msg);
  }
}

class GenericError extends Response {
  constructor(msg) {
    const errObj = {};
    if (msg?.name.includes('Sequelize')) {
      msg.errors.map( er => {
        errObj[er.path] = er.message;
      })
    }
    super(500, {
      code: -1,
      msg: msg.toString(),
      errors: errObj
    });
  }
}

module.exports = {
  GenericError,
  Response,
  Success,
  MissingParams,
  UnknownException,
  CustomError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError
};