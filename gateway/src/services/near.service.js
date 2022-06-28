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
const nearAPI = require("near-api-js");
const Uuid = require("uuid");
const { KeyPair, utils, connect, keyStores } = nearAPI;
const {viewMethods, changeMethods} = require('./contractMethods');

const 
  NETWORK_ID = process.env.NETWORK_ID,
  MASTER_ACCOUNT_ID = process.env.MASTER_ACCOUNT_ID;
  MASTER_PRIVATE_KEY = process.env.MASTER_PRIVATE_KEY,
  CONTRACT_ID = process.env.CONTRACT_ID,
  INITIAL_BALANCE = "2000000000000000000000", //"1810000000000000000000"
  ATTACHED_GAS = "300000000000000";

const Config = {
  testnet: {
    networkId: "testnet",
    keyStore: null,
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: "https://wallet.testnet.near.org",
    helperUrl: "https://helper.testnet.near.org",
    explorerUrl: "https://explorer.testnet.near.org",
  },
  mainnet: {
    networkId: "mainnet",
    keyStore: null,
    nodeUrl: "https://rpc.mainnet.near.org",
    walletUrl: "https://wallet.mainnet.near.org",
    helperUrl: "https://helper.mainnet.near.org",
    explorerUrl: "https://explorer.mainnet.near.org",
  },
};

async function getContract() {
  const near = await connect(config);
  const account = await near.account(MASTER_ACCOUNT_ID);
  return new Contract(account, CONTRACT_ID, {
    viewMethods: Object.values(viewMethods),
    changeMethods: Object.values(changeMethods),
  });
}

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
  const { keyStores, KeyPair } = nearAPI;
  const keyStore = new keyStores.InMemoryKeyStore();

  // creates a public / private key pair using the provided private key
  const keyPair = KeyPair.fromString(privateKey);
  //const keyPair = new nearAPI.utils.key_pair.KeyPairEd25519(privateKey);

  // adds the keyPair you created to keyStore
  await keyStore.setKey(NETWORK_ID, accountId, keyPair);
  config.keyStore = keyStore;

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
   * @returns: [true, {id, public_key, private_key}, receipt] if success, 
   *           [false, error] otherwise
   */
  try {
    // we need to use some MasterAccount to create a new account
    const config = await getConfig(MASTER_ACCOUNT_ID, MASTER_PRIVATE_KEY);

    // create the KeyPair for the implicit account
    // see: https://github.com/near/near-cli/blob/master/commands/generate-key.js
    const keyPair = KeyPair.fromRandom("ed25519");
    const publicKey = keyPair.publicKey.toString();
    const privateKey = keyPair.secretKey.toString();

    // create the new accountId using UUIDs, because the implicit account
    // NEEDS that we transfer tokens to it to activate the account
   // const accountId = utils.PublicKey.fromString(publicKey).data.hexSlice();
    const uid = Uuid.v4().replace(new RegExp("-", "g"), "");
    const accountId = `${uid}.${MASTER_ACCOUNT_ID}`;
    console.info(
      `createImplicitAccount id='${accountId}' initial=${INITIAL_BALANCE}`
    );

    // create new account using funds from the master account used to create it
    // see: https://docs.near.org/docs/api/naj-quick-reference#connection
    const near = await connect(config);
    const account = await near.account(MASTER_ACCOUNT_ID);
    const receipt = await account.createAccount(
      accountId, // new account name
      publicKey, // public key for new account
      INITIAL_BALANCE // initial balance for new account in yoctoNEAR
    );
    console.info("receipt=", receipt);

    return {
      account: {
        id: accountId,
        public_key: publicKey,
        private_key: privateKey,
      },
      receipt, // No errors
    };
  } catch (error) {
    return [null, error];
  }
}

/*
 Create a verification request
*/
async function requestVerification(request_uid, type, subject_id, personal_info) {
  const contract = await getContract();
  const args = {
    request_uid: request_uid,
    type: type,
    subject_id: subject_id,
    personal_info: personal_info
  };
  return (contract)[changeMethods.requestVerification](args, ATTACHED_GAS);
}

async function callContract(method, args, signerId, privateKey) {
    /**
     * Call a contract method
     * 
     * @method: the name of the method to call in the CONTRACT_ID
     * @args: obj with arg name and value - empty object if no args required
     * @signerId: account Id of caller and signer, ex: "maz.testnet"
     * @privatekey: private key of signer account, ex: "29z...rLG"
     * 
     * @exampĺe:
     * let [status, ret] = callContract(
     *   "request_verification", { 
     *      "uid": "ABCD1234607", 
     *      "is_type": "ProofOfLife", 
     *      "subject_id": "AR_DNI_12345678907", 
     *      "payload": "Simulated encrypted PAYLOAD"          
     *   }, 
     *   "maz.testnet", "29z...rLG"
     * );
     * 
     * @returns: [true, result] if success, [false, error] otherwise
     */
    try {
        const config = await getConfig(signerId, privateKey);
        const near = await connect(config);
        const signer = await near.account(signerId);
    
        const contract = new nearAPI.Contract(
            signer, // the account object that is connecting
            CONTRACT_ID, // name of contract we're connecting to
            {
              // view methods do not change state but usually return a value
              viewMethods: viewMethods, 
              // change methods modify state
              changeMethods: changeMethods,
              sender: signer, // account object to initialize and sign transactions.
            }
        );
    
        let ret = await contract[method](
            args, // the args obj: name and value - empty object if no args required
            ATTACHED_GAS // optional attached gas
            // "1000000000000000000000000" // attached deposit in yoctoNEAR (optional)
        );
    
        console.info(`called ${method}(${JSON.stringify(args)}):`, ret);
        return [true, ret]; 
    }
    catch (error) {
        console.log(`called ${method}(${JSON.stringify(args)}): ${error}`);
        return [false, error];
    }
}


module.exports = {
  getConfig,
  createImplicitAccount,
  requestVerification,
  callContract
};