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
const { KeyPair, utils, connect, keyStores } = nearAPI;

const 
  NETWORK_ID = process.env.NETWORK_ID,
  MASTER_ACCOUNT_ID = process.env.MASTER_ACCOUNT_ID
  MASTER_PRIVATE_KEY = process.env.MASTER_PRIVATE_KEY,
  INITIAL_BALANCE = "10000000000000000000";

const Config = {
  "testnet": {
    networkId: "testnet",
    keyStore,
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: "https://wallet.testnet.near.org",
    helperUrl: "https://helper.testnet.near.org",
    explorerUrl: "https://explorer.testnet.near.org",
  },
  "mainnet": {
      networkId: "mainnet",
      keyStore,
      nodeUrl: "https://rpc.mainnet.near.org",
      walletUrl: "https://wallet.mainnet.near.org",
      helperUrl: "https://helper.mainnet.near.org",
      explorerUrl: "https://explorer.mainnet.near.org",
  }
};


export function getConfig(accountId, privateKey) {
  /**
   * Returns the currently active NEAR Config, binded to a given account.
   * This enables this account for signing transactions.
   */
  const config = Config[NETWORK_ID];

  // set up a memory KeyStore for the given Account
  // see: https://docs.near.org/docs/api/naj-quick-reference#key-store
  const keyStore = new keyStores.InMemoryKeyStore();
  keyStore.setKey(NETWORK_ID, accountId, KeyPair.fromString(privateKey));
  config.keyStore = keyStore;

  return config;
}


export async function createImplicitAccount() {
  /**
   * Creates an implict account, using the MasterAccount, and returns the
   * created account and its public and private keys.
   * 
   * @example:
   *  [account, error] = await createImplictAccount();
   * 
   * @return: 
   * - `[{id, public_key, private_key}]` if success
   * - `[null, error]` otherwise
   */
  try {
    // we need to use some MasterAccount to create a new account
    const config = getConfig(MASTER_ACCOUNT_ID, MASTER_PRIVATE_KEY);

    // create the KeyPair for the implicit account
    // see: https://github.com/near/near-cli/blob/master/commands/generate-key.js
    const keyPair = KeyPair.fromRandom('ed25519');
    const publicKey = keyPair.publicKey.toString();
    const privateKey = keyPair.secretKey.toString();
    const accountId = utils.PublicKey.fromString(publicKey).data.hexSlice()

    // create new account using funds from the master account used to create it
    // see: https://docs.near.org/docs/api/naj-quick-reference#connection
    const near = await connect(config);
    const account = await near.account(MASTER_ACCOUNT_ID);
    await account.createAccount(
      accountId, // new account name
      publicKey, // public key for new account
      INITIAL_BALANCE // initial balance for new account in yoctoNEAR
    );

    return [
      {id: accountId, public_key: publicKey, private_key: privateKey}, 
      null // No errors
    ];   
  }
  catch (error) {
    return [null, error]
  }
}
