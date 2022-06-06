
# Securing data payloads with a Vault 

**NOTE: Work in progress**

As all data passed to the Blockchain is transparent and public, for assuring privacy we need some way to hide some arguments passed in method calls.

This is a proposed Vault contract for: 
1. **encrypting this private arguments before** calling the Identicon contract methods.
2. **decrypting those passed arguments inside** the contract methods.

Once decrypted, the received data can be safely stored as part of the Contract State.

**Vault struct, implementation and Contract State**

~~~
pub type PrivateKey: String;
pub type PublicKey: String;

/// This is the Vault used for encrypting and decrypting payloads
pub struct Vault:
  keys: LookupMap<PublicKey, PrivateKey>, // all generated keys
  current: PublickKey // the currently active key
}

impl Vault {
  /// Returns the currently active PublickKey which 
  /// can be used to encrypt a payload.
  pub fn get_vault_key(&mut self) -> PublickKey {
  };

  /// Decrypts the payload using the PrivateKey linked to this PublicKey
  pub fn decrypt_payload(&mut self, key: PublickKey, payload: String) -> JSON {
  }

  /// Creates a new <PublicKey, PrivateKey> pair 
  /// which will be "current" from now on
  pub fn regen_keys(&mut, self) {
  };
}

pub struct Contract {
  // ...
  pub vault: Vault,
  // ...
}
~~~
