/*
# Implicit Accounts

See: https://docs.near.org/docs/roles/integrator/implicit-accounts

Implicit accounts work similarly to Bitcoin/Ethereum accounts.

- They allow you to reserve an account ID before it's created by generating a ED25519 key-pair locally.
- This key-pair has a public key that maps to the account ID.
- The account ID is a lowercase hex representation of the public key.
- An ED25519 Public key contains 32 bytes that maps to 64 characters account ID.
- The corresponding secret key allows you to sign transactions on behalf of this account once it's created on chain.

@created: JUN-03-2022, @mazito
*/
const nearAPI = require('near-api-js');
const Uuid = require('uuid');
const { KeyPair, connect } = nearAPI;
const { decryptIt } = require('../utils/cypher.utils');

const
  NETWORK_ID = process.env.NETWORK_ID,
  MASTER_ACCOUNT_ID = process.env.MASTER_ACCOUNT_ID,
  MASTER_PRIVATE_KEY = process.env.MASTER_PRIVATE_KEY,
  CONTRACT_ID = process.env.CONTRACT_ID,
  INITIAL_BALANCE = '1000000000000000000000000',
  ATTACHED_GAS = '300000000000000';

const Config = {
  testnet: {
    networkId: 'testnet',
    keyStore: null,
    nodeUrl: 'https://rpc.testnet.near.org',
    walletUrl: 'https://wallet.testnet.near.org',
    helperUrl: 'https://helper.testnet.near.org',
    explorerUrl: 'https://explorer.testnet.near.org',
  },
  mainnet: {
    networkId: 'mainnet',
    keyStore: null,
    nodeUrl: 'https://rpc.mainnet.near.org',
    walletUrl: 'https://wallet.mainnet.near.org',
    helperUrl: 'https://helper.mainnet.near.org',
    explorerUrl: 'https://explorer.mainnet.near.org',
  },
};


async function getConfig(accountId, privateKey) {
  /**
   * Returns the currently active NEAR Config, binded to a given account.
   * This enables this account for signing transactions.
   */
  const config = Config[NETWORK_ID];
  console.log(`getConfig '${NETWORK_ID}' '${accountId}' '${privateKey}'`);

  // see: https://docs.near.org/docs/api/naj-quick-reference#key-store
  // creates keyStore from a private key string
  // you can define your key here or use an environment variable
  const {
    keyStores,
    KeyPair
  } = nearAPI;
  const keyStore = new keyStores.InMemoryKeyStore();

  // creates a public / private key pair using the provided private key
  const keyPair = KeyPair.fromString(privateKey);
  //const keyPair = new nearAPI.utils.key_pair.KeyPairEd25519(privateKey);

  // adds the keyPair you created to keyStore
  await keyStore.setKey(NETWORK_ID, accountId, keyPair);
  config.keyStore = keyStore;
  console.log('keyStore', config.keyStore);
  return config;
}


async function createImplicitAccount() {
  /**
   * Creates an implict account, using the MasterAccount, and returns the
   * created account and its public and private keys.
   *
   * @example:
   *  [account, receipt] = await createImplictAccount();
   *
   * @returns: [{id, public_key, private_key}, receipt] if success, 
   *           [null, error] otherwise
   */
  try {
    const { keyStores, KeyPair } = nearAPI;

    // we need to use some MasterAccount to create a new account
    const config = await getConfig(MASTER_ACCOUNT_ID, MASTER_PRIVATE_KEY);
        
    // create the KeyPair for the implicit account
    // see: https://github.com/near/near-cli/blob/master/commands/generate-key.js
    const keyPair = KeyPair.fromString(MASTER_PRIVATE_KEY);
    const publicKey = keyPair.publicKey.toString();
    const privateKey = keyPair.secretKey.toString();
    console.log('KEYPAIR=',keyPair, 'pub=', publicKey, 'prv=', privateKey);

    // adds the keyPair you created to keyStore
    const myKeyStore = new keyStores.InMemoryKeyStore();
    await myKeyStore.setKey(NETWORK_ID, MASTER_ACCOUNT_ID, keyPair);    

    // create the new accountId using UUIDs, because the implicit way:
    // does not seem to work for us ???
    // ??? const accountId = utils.PublicKey.fromString(publicKey).data.hexSlice();
    const uid = Uuid.v4().replace(new RegExp('-', 'g'), '');
    const newAccountId = `${uid}.${MASTER_ACCOUNT_ID}`;
    console.info(
      `createImplicitAccount id='${newAccountId}' initial=${INITIAL_BALANCE}`
    );

    // create new account using funds from the master account used to create it
    // see: https://docs.near.org/docs/api/naj-quick-reference#connection
    const near = await connect(config);
    const masterAccount = await near.account(MASTER_ACCOUNT_ID);
    const receipt = await masterAccount.createAccount(
      newAccountId, // new account name
      publicKey, // public key for new account
      INITIAL_BALANCE // initial balance for new account in yoctoNEAR
    );
    console.info({
      id: newAccountId,
      public_key: publicKey,
      private_key: privateKey
    }, '\nreceipt=', receipt);

    return [{
        id: newAccountId,
        public_key: publicKey,
        private_key: privateKey
      },
      receipt, // No errors
    ];
  } catch (error) {
    console.log('near.service createImplicitAccount Err=', error);
    return [null, error];
  }
}


async function getContract(signer) {
  // @signer: (optional) is an Account object (defined in models)
  // @returns: the initialized contract with predefined methods
  const signerId = signer ? signer.linked_account_uid : MASTER_ACCOUNT_ID;
  const keyPair = signer && decryptIt(signer.keys);
  const privateKey = signer ? keyPair.private_key : MASTER_PRIVATE_KEY;
  const publicKey = signer ? keyPair.public_key : '0x0';
  console.log('getContract signerId=', signerId);
  console.log('getContract keys prv=', privateKey, 'pub=', publicKey);

  const config = await getConfig(signerId, privateKey);
  const near = await connect(config);
  const account = await near.account(signerId);
  console.log('getContract config.keyStore', config.keyStore);

  try {
    const contract = new nearAPI.Contract(
      account, 
      CONTRACT_ID, 
      {
        viewMethods: [
        ],
        changeMethods: [
          'request_verification',
          'cancel_verification',
          'register_as_validator',
          'unregister_as_validator',
          'assign_validators',
          'get_assigned_validations',
          'get_verification'
        ],
        // sender: account, // account object to initialize and sign transactions.
      }
    );
    return contract;
  }
  catch (err) {
    console.log('getContract ERR=', err);
    return null;
  }
}


async function requestVerification(args, signer) {
  let result;
  try {
    // @args: { request_uid, subject_id, is_type, payload }
    const contract = await getContract(signer);
    result = await contract.request_verification(args, ATTACHED_GAS);
  } catch(e) {
    console.log('ERROR request_verification', e);
    throw e;
  }
  return result;
}


async function registerAsValidator(args, signer) {
  let result;
  try {
    args = args || { can_do: ['Remote'] };
    const contract = await getContract(signer);
    result = await contract.register_as_validator(args, ATTACHED_GAS);
  } catch (e) {
    console.log('ERROR register_as_validator', e);
    throw e;
  }
  return result;
}


async function assignValidators(args, signer) {
  let result;
  try {
    // { request_uid, validators_set }
    args = args || {};
    // signer MUST be null, because signer will be MASTER (default)
    const contract = await getContract();
    result = await contract.assign_validators(args, ATTACHED_GAS);
  } catch (e) {
    console.log('ERROR assign_validators', e);
    throw e;
  }
  return result;
}

async function getVerification(args, signer) {
  let result;
  try {
    // @args: { request_uid }
    const contract = await getContract(signer);
    result = await contract.get_verification(args);
  } catch(e) {
    console.log('ERROR get_verification', e);
    throw e;
  }
  return result;
}

async function getAssignedValidations(args, signer) {
  let result;
  try {
    // @args {order: 'asc'} ;
    const contract = await getContract(signer);
    result = await contract.get_assigned_validations(args);
  } catch(e) {
    console.log('ERROR get_assigned_validations', e);
    throw e;
  }
  return result;
}


module.exports = {
  getConfig,
  createImplicitAccount,
  requestVerification,
  getVerification,
  registerAsValidator,
  assignValidators,
  getAssignedValidations
};
