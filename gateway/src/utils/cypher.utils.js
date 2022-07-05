const jwt = require("jsonwebtoken");

/** 
 * Use AES_256 symmetric encryption so we can 
 * later encode and decode the account public and private keys
 * we use the same Initialization vector used for JWT Tokens
 * https://nodejs.org/en/knowledge/cryptography/how-to-use-crypto-module/#ciphers
 * https://attacomsian.com/blog/nodejs-encrypt-decrypt-data
 * https://stackoverflow.com/questions/70841673/make-nodejs-encrypt-and-decrypt-function-up-to-date 
 */ 
function encryptIt(obj) {
  // @obj: to be encrypted
  // @returns: an encrypted string
  const secret = process.env.ACCESS_KEYS_SECRET || 'Nada por aquíp!';
  return jwt.sign(JSON.stringify(obj), secret); 
  // const iv = crypto.createHash('sha256')
  //   .update(process.env.ACCESS_TOKEN_SECRET || 'Nada por aquíp!')
  //   .digest();
  // const resizedIV = Buffer.allocUnsafe(16);
  // iv.copy(resizedIV);
  // return crypto.createCipheriv('aes256', JSON.stringify(obj), resizedIV);
}

function decryptIt(str) {
  // @encrypted: the string 
  // @returns: the decrypted and deserialized obj
  const secret = process.env.ACCESS_KEYS_SECRET || 'Nada por aquíp!';
  var decoded = jwt.verify(str, secret);
  return decoded;
  // 
  // 
  // const secretKey = 'Nada-por-aquíp!-HayJalapeniosAlV';
  // const ps = JSON.parse(encrypted);
  // const decipher = crypto.createDecipheriv('aes-256-ctr', secretKey, Buffer.from(ps.iv, 'hex'));
  // const decrypted = Buffer.concat([
  //   decipher.update(Buffer.from(ps.content, 'hex')), 
  //   decipher.final()
  // ]);
  // return decrypted.toString();  
  //
  // const iv = crypto.createHash('sha256')
  //   .update(process.env.ACCESS_TOKEN_SECRET || 'Nada por aquíp!')
  //   .digest();
  // const resizedIV = Buffer.allocUnsafe(16);
  // iv.copy(resizedIV);      
  // return JSON.parse(crypto.createDecipheriv('aes256', encrypted, resizedIV));
}


module.exports = { encryptIt, decryptIt };
