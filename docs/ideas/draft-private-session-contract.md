
Private session contract 

struct SessionKeys {
  uid: String, // session identifier UUID
  public: String,
  secret: String, 
}

type EncryptedSession = String;
type EncryptedPayload = String;
type EncryptedResponse = String;

### open_private_session

It establishes a private session between this account and an external contract. 

The caller Account needs to save somewhere the received keys so he/she can used them to encrypt/decrypt future messages within this private session.

This key pair will be used by the `private_call` to sign all private transactions done on behalf of the caller Account.

Params:
- `pubkey: String` is the caller Account public key

Actions:
1. It will create a SessionKeys obj with a new UUID, and a new pair of public and secret keys. 
2. It will encrypt this SessionKeys obj using the received `pubkey`, so the caller can decrypt it.

Returns:
- `EncryptedJSON` the `SessionKeys` structure encripted using the given `pubkey`


### private_call

Params:
- `session_uid: String`
- `payload: EncryptedJSON`

Actions:
1. The caller encrypts the payload using the received session publick key.
2. The contract method decrypts the payload using the session private key and executes the calls defined in the payload.

Returns:
- `EncryptedJSON`

### close_private_session

When called with a given session uid, the temporarily stored values of the session are deleted from the chain state, and so no private keys are left associated to this session. All data associated to the session (and the session itself) is fully erased.

To decrypt old payloads, the caller MUST use the session id and private key previosuly received. There is no way of recovering them using the contract.
