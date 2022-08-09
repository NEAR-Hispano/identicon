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
const { KeyPair, connect, providers } = nearAPI;
const { decryptIt } = require('../utils/cypher.utils');
const { encodeJsonRpcData, decodeJsonRpcData } = require('../utils/transactions.utils');
const {getNetworkConfig} = require('./config');
const
  NETWORK_ID = process.env.NETWORK_ID,
  IDENTICON_ACCOUNT_ID = process.env.MASTER_ACCOUNT_ID,
  MASTER_ACCOUNT_ID = process.env.CREDENTIAL_CONTRACT_ID,
  MASTER_PRIVATE_KEY = process.env.CREDENTIAL_PRIVATE_KEY,
  CONTRACT_ID = process.env.CREDENTIAL_CONTRACT_ID,
  INITIAL_BALANCE = '1000000000000000000000000',
  ATTACHED_GAS = '300000000000000';
  STORAGE_DEPOSIT = '100000000000000000000000'
const nearConfig = getNetworkConfig(NETWORK_ID);
const provider = new providers.JsonRpcProvider({ url: nearConfig.nodeUrl });
async function getConfig(accountId, privateKey) {
  /**
   * Returns the currently active NEAR Config, binded to a given account.
   * This enables this account for signing transactions.
   */
  const config =  getNetworkConfig(NETWORK_ID);
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

async function getContract(signer) {
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
          'nft_token'
        ],
        changeMethods: [
          'mint_credential',
          'claim_credential',
          'new_default_meta',
          'new'
        ],
      }
    );
    return contract;
  }
  catch (err) {
    console.log('getContract ERR=', err);
    return null;
  }
}

async function mintCredential(args, account) {
  const {credential_id, receiver_id, credential_metadata} = args;
    let result;
    try {
      const contract = await getContract(account);
      const args = {
        token_id: credential_id.toString(),
        receiver_id: receiver_id,
        token_metadata: credential_metadata
      }; 
      console.log('args', args)
      result = await contract.mint_credential(args, ATTACHED_GAS, STORAGE_DEPOSIT);
    } catch(e) {
      console.log('ERROR mint_credential', e);
      throw e;
    }
    return result;
}

async function getCredentialMetadata(credential_id) {
  const args = {
    token_id: credential_id
  }; 
  const response = await provider.query({
    request_type: "call_function",
    finality: "optimistic",
    account_id: CONTRACT_ID,
    method_name: 'nft_token',
    args_base64: encodeJsonRpcData(args),
  });

  return decodeJsonRpcData(response.result);

}

module.exports = {
  mintCredential,
  getCredentialMetadata
};
