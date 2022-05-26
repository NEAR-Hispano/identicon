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

:hand: This is preliminar work in progress and may change in the future. 

We use SQLite3 datatypes to describe the table attributes as they are general and can be easily adapted to other SQL variants.

![Gateway DB Schema](./images/Gateway_DB_Schema.png)

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

:hand:  This is preliminar work in progress. Some definitions below may change.  It is bases on the [first (naive) implementation](../contracts/README.md#Structures) of the VerificationContract but updated.

The descriptions here follow the RUST conventions and datatypes usage, but in an informal way. The formal definitions will be found in the code in [contracts/src/definitions.rs](../contracts/src/definitions.rs).

![Blockchain State Schema](./images/Blockchain_State_Schema.png)

#### Custom types #### 

**Simple types**

|Custom type|RUST Type|Description|
|--|--|--|
| SubjectId | String | The Subject government identification as a string formed using `{country}_{type}_{number}`, ex: `ar_dni_12488353` |
|ValidatorId|String|A NEAR AccountId, ex: `juanmescher.near` or `5GDZ...ekUj`|
|ISODateTime|String|A DateTime in ISO-8601 format: `AAAA-MM-DD hh:mm:ss`|
|TimeWindow|struct|The Time Window in which the verification must be performed<br />`{ starts: ISODateTime,  ends: ISODateTime }`|
|RequestInfo|String|Relevant request information, but fully **encripted**. It will usually be an encripted JSON object, whose contents will dependen on the VerificationType.|

**enum VerificationType**

Enumerates the  different verification services variants:

| Case                | Description                                                  |
| ------------------- | ------------------------------------------------------------ |
| PoLife              | Validates that the Subject is alive, and lives in the indicated Location. It also implies a ProofOfIdentity. This is a recurrent validation, meaning it must be repeated every month. |
| PoIdentity          | Validates that the Subject is who he says he is, and that is (obviously) alive. |
| PoExistence (asset) | Not implemented, reserved for future use.                    |
| PoState (asset)     | Not implemented, reserved for future use.                    |
| PoOwnership (asset) | Not implemented, reserved for future use.                    |
| PoService (asset)   | Not implemented, reserved for future use.                    |

**enum VerificationState**

Enumerates the different states in which a given request may be. Some requests may require a *why: String* to describe the reason for the given state change.

| Case              | Description                                                  |
| ----------------- | ------------------------------------------------------------ |
| Pending           | Started but waiting for the validator results. Code ` P`     |
| Approved          | Verification result is approved.  Code ` AP`                 |
| Rejected (why)    | Verification result is Rejected.  Code ` RX`                 |
| NotPossible (why) | It is not possible to do the verification, due to some reason which exceeds the Validator possibilites, such as inaccesible area, weather, etc. Code `NP` |
| WillNotDo (why)   | Validator will not do the verification, for some personal reason, but it requires a cause and explanation. Too many of this refusals may eliminate the Validator from the validators pool. Code `WND` |
| Canceled (why)    | Verification was canceled by Requestor. Code `CX`            |

**struct VerificationResult**

This struct describes the result reported by a given validator. When the validator has not yet performed the validation, it just describes the assigned task.

| Property     | Type              | Description                                                  |
| ------------ | ----------------- | ------------------------------------------------------------ |
| validator_id | ValidatorId       | The validator account assigned to perform this validation.   |
| result       | VerificationState | The result state. It may be in differente states, depending on the validator actions. |
| timestamp    | ISODateTime       | The timestamp when the validation was performed, or an empty timestamp otherwise. |

**struct VerificationCertificate NFT**

:warning: **URGENT** :warning: MUST define this as soon as possible.

**struct VerificationRequest**

This fully describes a given request for verification. Requests may be of different types, but we currently we will only deal with the PoLife and PoIdentity cases. 

| Property      | Type                    | Description                                                  |
| ------------- | ----------------------- | ------------------------------------------------------------ |
| request_uid   | RequestId               | The current UUID of this request, as given by the caller API or dApp. |
| is_type       | VerificationType        | The verification service required, which may include additional info for some types. |
| requestor_uid | AccountId               | This is the account who requested the verification and will pay for it, and is NOT the same as the subject to be verified. |
| subject_id    | SubjectId               | This is the subject to be verified, which is ALLWAYS a real human being. Ccats, dogs and other pets may be considered in the future- |
| info          | RequestInfo             | Relevant request information, but fully **encripted**.       |
| when          | TimeWindow,             | The time window in which this verification MUST be performed. |
| state         | VerificationState       | The verification state of the whole request, as a result of the individual verifications. If any of the individual verifications is Rejected, then the whole verification is Rejected. |
| results       | Vec                     | The array [MIN_VALIDATORS..MAX_VALIDATORS] of individual validator VerificationsResults. |
| certificate   | VerificationCertificate | The final certificate emitted by the verification process.   |

#### contract struct VerificationContract ####

This contains the full contract state.

| Property      | Type         | Description                                                  |
| ------------- | ------------ | ------------------------------------------------------------ |
| verifications | UnorderedMap | The pending verifications as an iterable Map keyed by RequestId. When a verification is completed, it must be removed. The value is the VerificationRequest to be performed. |
| subjects      | UnorderedMap | The pending verifications as an iterable Map but keyed by SubjectId, so we avoid traversing the verifications Map to find if a given subject has one or more pending requests. The value is a (variable) array of the pending requests of this particular subject. |
| assignments   | UnorderedMap | The assigned validations, as an iterable Map keyed by ValidatorId. The value is a (variable) array of the RequestIds to be verified by this validator. |
| validators    | Vec          | The Pool of validators, as an array of ValidatorIds.         |
