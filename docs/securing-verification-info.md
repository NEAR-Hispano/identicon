

# Securing request verification files with a Vault 

**NOTE: Work in progress**

Each request may have one or more files attached to it. Usually:

- Subject info, as entered by the Requester and needed by the Validators to do their jobs.
- Verification info, such as video recordings, photos, health information, or other info which may have been captured by the Validators while running the verification process.

This files should be protected (encrypted) as they contain personal information which can not be opened to the public, and so can not be stored in the blockchain.

We can use some IPFS service to store files, but we need to encrypt them, and also the Requester and Validator need access to the encrypted files. 

We solve this by using a Vault for storing a public/private key pair which we will use to encrypt/decrypt the files and an access list (ACL) of authorized accounts for each request. 

The Vault provides:

- A way of generating and storing the public/private key pair used to encrypt/decrypt the files. The files will be encrypted using the public key, and decrypted using the private key.
- A way of adding/removing accounts from the ACL list of a given request.
- A way for a Requester or Validator to get the public key (for encryption) and the private key (for decryption) but without showing them on the blockchain. 

# Use cases

### Create ACL and grant access on request

When we receive a request we create the ACL and grant the Requester account and to all the Validator accounts, access permissions to the files attached to a certain `request_id` .    

~~~mermaid
sequenceDiagram
  	participant Requester
  	participant Identicon
  	participant VaultContract
    Requester->>Identicon: request_verification(subject_id, type)
    Identicon->>VaultContract: create_acl(request_id)
    Identicon->>VaultContract: add_to_acl(request_id, RequesterId, mode)
  	Identicon->>Identicon: validators = assign_validators(request_id)
    Identicon->>VaultContract: for validator in validators: add_to_acl(request_id, ValidatorId)
    Identicon->>Requester: request_id
        
~~~

### Upload encrypted file and attach to the request

~~~mermaid
sequenceDiagram
  	participant Requester
  	participant VaultContract
  	participant IPFS
    Requester->>VaultContract: get_encryption_key(request_id, pub_key)
    VaultContract->>Requester: encrypted_encryption_key
    Requester->>Requester: encryption_key = decript_using_private_key(encrypted_encryption_key)
    Requester->>Requester: file = encrypt_file(encryption_key)
    Requester->>IPFS: upload_file(file)
    IPFS->>Requester: CID
    Requester->>VaultContract: attach_file_cid(request_id, file_key, CID)
    
~~~

NOTE: we add a `file_key` because we may have more than one file attached to a given `request_id`.

### View the file 

How a validator can access a given file.

~~~mermaid
sequenceDiagram
  	participant Validator
  	participant VaultContract
  	participant IPFS
    Validator->>VaultContract: get_decrypt_key(request_id, pub_key)
    VaultContract->>Validator: encrypted_decrypt_key
    Validator->>Validator: decript_key = decript_using_priv_key(encrypted_decrypt_key)
    Validator->>VaultContract: get_attached_cid(request_id, file_key)
    VaultContract->>Validator: CID
		Validator->>IPFS: get_file(CID)
    IPFS->>Validator: encrypted_file
    Validator->>Validator: content = decript_file(encrypted_file, decrypt_key)
    
~~~



# VaultContract

### Structs and types

~~~ rust
// A UUID expressed as a 128 bit unsigned int. 
// See https://en.wikipedia.org/wiki/Universally_unique_identifier
type UID = u128;

type EncryptedKey = String;
~~~

### Methods

#### create_acl(request_id: UID)

Creates a Access Control List for the given `request_id`. It will:

- Create a public/private key pair and an ACL, indexed by the `request_id`.

- The key pair and the ACL will be hidden and stored in the contract state. 
- The ACL will have a list of AccountIds with full access to the vaulted files for this `request_id`.

*IMPORTANT: this method can only be called from the Identicon contract*.

#### add_to_acl(request_id: UID, account: AccountId, mode: String)

Grants permission to the given Account for access to all files attached to  a certain `request_id`.

The `mode` param defines the granted permissions using a combination of the following allowed actions:

- `r` Read,  `w` Write, `d` Delete

Examples:

	+ `r` read only access
	+ `rw` read and write access
	+ `rwd` full access

*IMPORTANT: this method can only be called from the Identicon contract*.

#### remove_from_acl(request_id: UID, account: AccountId)

Remove the given Account from the ACL of a certain `request_id`.

*IMPORTANT: this method can only be called from the Identicon contract*.

#### get_encryption_key(request_id: UID, pub_key: PublicKey) -> EncryptedKey

Returns an `encryption_key` BUT encrypted using the caller account `pub_key`. 

We send the public key of the Account making the request, and the Vault uses it to encrypt it's response to the caller. As the caller account knows it's own private key he/she can use it to decrypt the result and obtain the real `encryption_key`  and then use it for encrypting the IPFS files.

*IMPORTANT: this method can only be called from a Validator or Requestor account*.

#### get_decryption_key(request_id: UID, pub_key: PublicKey) -> EncryptedKey

Returns an `decryption_key` BUT encrypted using the caller account `pub_key`. 

We send the public key of the Account making the request, and the Vault uses it to encrypt it's response to the caller. As the caller account knows it's own private key he/she can use it to decrypt the result and obtain the real `decryption_key`  and then use it for decrypting the IPFS files.

*IMPORTANT: this method can only be called from a Validator or Requestor account*.

#### attach_file_cid(request_id: UID, file_key: String, cid: CID) 

Attachs the given `CID` of an encrypted file to a certain `request_id`. Because a request may have more than one file attached to it, we must provide a string `file_key` to each file, so we can latter recover each one of the different files.

*IMPORTANT: this method can only be called from a Validator or Requestor account*.

#### get_attached_file_cid(request_id: UID, file_key: String) -> CID

Get the `CID` of the encrypted file attached for a certain `request_id` and `file_key`

*IMPORTANT: this method can only be called from a Validator or Requestor account*.

#### remove_attached_file_cid(request_id: UID, file_key: String) -> CID

Removes the file attached to a certain `request_id` and `file_key`

*IMPORTANT: this method can only be called from a Validator or Requestor account*.

