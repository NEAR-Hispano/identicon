# Data Models

Naming conventions:

- `BC`: NEAR Blockchain
- `GW`: Gateway (mediator)
- `DB`: Gateway hosted DB
- `TX`: A BC transaction 

Design goals: 

- Keep most of the info *inside* the BC data space.
- Use the GW as an encryption layer *over* the BC.
- Use the GW DB as an indexer and for onboarding new users.
- Keep the GW as minimum layer for a simple OpenAPI.

## Gateway DB Data Model ##

*Preliminar work in progress. We use SQLite3 datatypes.* 

![Schema ERD](./images/Gateway_DB_Schema.png)

#### Table `accounts` ####

This table is used mainly for onboarding new users and mantaining registered users linked to its NEAR account and keys. There is also needed for account recovery using email or phone.

|Column name|Datatype|Description|
|--|--|--|
| `uid` | text | UNIQUE NEAR account ID  |
| state | text | `A`: active `I`: Inactive `D`: deleted |
| type | text | `RQ`: Requester, `VL`: Validator, `XA`: External app |
| email | text | Account email |
| phone | text | Account phone |
| keys | blob | **Encripted JSON** account pub/priv keys |
| state | text | `A`: active `I`: Inactive `X`: deleted |
| verified | text | Verification state, `TRUE` or `FALSE` |
| personal_info | text | **Encripted JSON** personal info |
| subject_id | text | Subject ID, example: `ar_dni_12345678`, may be empty |
| linked_account_uid | text | A NEAR account ID linked to this account, used by validators to receive payments. |
| created_utc | text | Created UTC time stamp in ISO-8601 format |
| updated_utc | text | Last update UTC time stamp in ISO-8601 format |

The `personal_info` JSON:

| Attribute | Datatype | Description |
| --------- | ----------- | ---- |
|full_name| text | Full person name, may be empty|
|birthday|text||
|age| integer | |
|country | text | Country code|
| region | text | Region code (province, state, ...) |
| comune | text | Region subdivisions code (county, Municipio, comuna, etc) code |
| idioms | text | Comma separated list of lang codes |
| address | text | Full address information, expressed as a string which can be used by Maps APIs to find location |
|  other ? | ? | ? |

#### Table `Features` ####

This is a helper table is used to select validators, according to certain features, such as country, region, idioms, coordinates, etc. Ideally this table can always be extended or reconstructed from the `personal_info` data.

|Column name|Datatype|Description|
|--|--|--|
| `account_uid` | text | UNIQUE account Uid |
| country | text | Country code |
| region | text | Region code |
| comune | text | Comune code |
| coords | text | GPS Coordinates obtained usinng address |
| idioms | text | Comma separated list of language codes |

#### Table `Verifications` ####

Requested verifications, which can be in different states. This is mainly used as an indexer and linked to one or more BC transactions, as most  info is stored in the BC.

|Column name|Datatype|Description|
|--|--|--|
| `request_uid` | text | UNIQUE request UUID |
| account_uid | text | Account uid which made the request |
| type | text | Request type: `ProofOfLife`, ... |
| subject_id | text | Subject ID, example: `ar_dni_12345678`, may be empty |
| state | text | `PN`: Pending, `ST`: Started, `FI`: Finished |
| result | text | `AP`, `RX`, `NP`, `WND`, `CX` |
| created_utc | text | Created UTC time stamp in ISO-8601 format |
| updated_utc | text | Last update UTC time stamp in ISO-8601 format |
| must_start_utc | text | Must start verification after UTC time stamp in ISO-8601 format |
| must_end_utc | text | Must end verification before UTC time stamp in ISO-8601 format |

#### Table `Transactions` ####

BC transactions linked to some particular request. Note that all transaction info is stored in the BC, here we just maintain a copy of some minimal info.

|Column name|Datatype|Description|
|--|--|--|
| `uid` | text | UNIQUE auto assigned UUID |
| request_uid | text | Request UUID |
| action | text | Transaction action: `RQ`; request, `VL`: validation, `CL`: conclusion |
| actor_uid | text | Actor account uid which participated in this transaction |
| tx_uid | text | Transaction UID in the BC |
| tx_log | text | JSON additional information from TX log |
| created_utc | text | Created UTC time stamp in ISO-8601 format |

#### Table `Sessions` ####

This is  helper table for mantaining the relation with a signup/recovery session_key and  the corresponding passcode sent for aan account signup/recovery/login handshake. Once the passcode has been verified (or rejected) it MUST be removed from the table.

|Column name|Datatype|Description|
|--|--|--|
| `key` | text | The signup/recovery/login session key |
| passcode | integer | A numeric passcode for validating signup/login |
| created_utc | text | Created UTC timestamp in ISO-8601 format |
| expires_utc | text |  Max time for the passcode life, UTC time stamp in ISO-8601 format.  |


## Blockchain data model

**NOTE** Preliminar work in progress. Extracted form [first (naive) implementation](../contracts/README.md#Structures).

~~~
// The Subject government identification as a string formed 
// using "{country}_{type}_{number}", ex: 'ar_dni_12488353'
// compatible with [NEAR DID](https://github.com/ontology-tech/DID-spec-near/blob/master/NEAR/DID-Method-NEAR.md)
// so we can have a NEAR DID like "did:near:ar_dni_12488353.near" 
type SubjectId = String;  

// A NEAR account ID, ex: 'juanmescher.near'
type ValidatorId = String; 

// A DateTime in ISO format 'AAAA-MM-DD hh:mm:ss', ex: '2022-03-27 00:00:00'
type ISODateTime = String; 

// The Time Window in which the verification must be performed
struct TimeWindow {
  starts: ISODateTime,
  ends: ISODateTime
}

// All the relevant Subject information
struct SubjectInfo {
  encripted: String
}

// The different verification services 
enum VerificationType {
  /// Validates that the Subject is alive, and lives in the indicated Location.
  /// It also implies a ProofOfIdentity. This is a recurrent validation, 
  // meaning it must be repeated every month.
  ProofOfLife,
  
  /// Validates that the Subject is who he says he is, and that is (obviously) alive.
  ProofOfIdentity,

  // Not implemented, reserved for future use
  ProofOfExistence { asset: String },
  ProofOfState { asset: String },
  ProofOfOwnership { asset: String },
  ProofOfService { service: String },
}

enum VerificationState {
  /// Started but waiting for the validator results  
  Pending, // code: P

  /// Verification result is approved
  Approved, // code: AP

  /// Verification result is Rejected
  Rejected { why: String }, // code: RX

  /// It is not possible to do the verification, due to some reason which exceeds 
  /// the Validator possibilites, such as inaccesible area, weather, etc
  NotPossible { why: String }, // code: NP

  /// Validator will not do the verification, for some personal reason,
  /// but it requires a cause and explanation. Too many of this refusals 
  /// may eliminate the Validator from the validators pool.
  WillNotDo { why: String } // code: WND
  
  /// Verification was canceled by Requestor
  Canceled { why: String } // code: CX
}

// The min and max required validators to verify a given request
// it may vary randomly between MIN and MAX
const MIN_VALIDATORS = 3;
const MAX_VALIDATORS = 4;

struct VerificationResult {
  validator_id: ValidatorId,
  result: VerificationState,
  timestamp: ISODateTime,
}

struct VerificationRequest {
  // the verification service required, which may include additional info
  // for some types such as ProofOfOwnership(asset) or ProofOfService(service).
  is_type: VerificationType,
  
  // this is the account who requested the verification and will pay for it,
  // and is NOT the same as the subject to be verified.
  requestor_id: AccountId,
  
  // this is the subject to be verified, which is ALLWAYS a real human being,
  // cats, dogs and other pets may be considered in the future :-)
  subject_id: SubjectId,
  subject_info: SubjectInfo,
  when: TimeWindow,
  
  // the verification state of the whole request, as a result of the individual
  // verifications. If any of the individual verifications is Rejected, then the
  // whole verification is Rejected.
  state: VerificationState, 
  
  // the array [MIN_VALIDATORS..MAX_VALIDATORS] of individual validator verifications  
  results: Vec<VerificationResult> 
}

pub struct VerificationContract {
  // the pending verifications as a iterable Map keyed by SubjectId
  verifications: UnorderedMap<SubjectId, VerificationRequest>,
  
  // the assigned validations, as a Map keyed by ValidatorId
  // the value is a (variable) list of the SubjectIds to verify
  assignments: UnorderedMap<ValidatorId, Vec<SubjectId>>,
  
  // the Pool of validators, as an array of ValidatorIds
  validators: Vec<ValidatorId>,
}

~~~

