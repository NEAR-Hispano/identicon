# Gateway DB Data Model

:hand: This is preliminar work in progress and may change in the future. 

We use SQLite3 datatypes to describe the table attributes as they are general and can be easily adapted to other SQL variants.

![Gateway DB Schema](../images/Gateway_DB_Schema.png)

#### Table `Accounts` ####

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
| subject_id | text | Subject ID, example: `ar_dni_12345678`, may be empty |
| linked_account_uid | text | A NEAR account ID linked to this account, used by validators to receive payments. |
| created_utc | text | Created UTC time stamp in ISO-8601 format |
| updated_utc | text | Last update UTC time stamp in ISO-8601 format |



#### Table `Subjects` ####

This table contains the encripted personal info of all verified (or candidates for verification) Subjects. 

**NOTES**: All accounts MUST have an associated Subject, but not all subjects need an Account. Only Requester, Validator an External subjects really need and Account.

|Column name|Datatype|Description|
|--|--|--|
| `subject_id` | text | Subject ID, example: `ar_dni_12345678`, may be empty |
| verified | text | Verification state, `TRUE` or `FALSE` |
| personal_info | text | **Encripted JSON** personal info |
| created_utc | text | Created UTC time stamp in ISO-8601 format |
| updated_utc | text | Last update UTC time stamp in ISO-8601 format |

The `personal_info` JSON:

| Attribute | Datatype | Description |
| --------- | ----------- | ---- |
|full_name| text | Full person name, may be empty|
|birthday|text| |
|age| integer | autocalculated age using birthday |
| sex | text | 'M', 'F', 'U'
|country | text | Country code|
| region | text | Region code (province, state, ...) |
| comune | text | Region subdivisions code (county, Municipio, comuna, etc) code |
| address | text | Full address information, expressed as a string which can be used by Maps APIs to find location |
| coordinates | text | GPS Coordinates as obtained from Maps API.|
| languages | text | Comma separated list of lang codes |
| email | text | Contact email |
| phone | text | Contact email |
| preferred | text | Preferred way to contact this Subject: `WHATSAPP`,`TELEGRAM`,`ONSITE`. |
| health | text | free format description of health status if it applies |
| extras | text | additional comments |



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
| state | text | `UN`: Unassigned, `PN`: Pending, `ST`: Started, `FI`: Finished |
| result | text | `AP`, `RX`, `NP`, `WND`, `CX` |
| created_utc | text | Created UTC time stamp in ISO-8601 format |
| updated_utc | text | Last update UTC time stamp in ISO-8601 format |
| must_start_utc | text | Must start verification after UTC time stamp in ISO-8601 format |
| must_end_utc | text | Must end verification before UTC time stamp in ISO-8601 format |


#### Table `Tasks` ####

Tasks and its BC transactions linked to some particular tasks.  Note that all transaction info is stored in the BC, here we just maintain a copy of some minimal info.

|Column name|Datatype|Description|
|--|--|--|
| `id` | text | UNIQUE auto assigned ID |
| request_uid | text | Request UUID |
| validator_uid | text | Validator account_uid |
| state | text | The state of the task: `Pending`, `Draft`, `Completed` |
| type | text | Validation type: `Remote`, `Onsite`, `Review`|
| draft | text | JSON obj with draft info temporarily stored here. |
| tx_uid | text | Final transaction UID in the BC |
| tx_log | text | JSON additional information from TX log |
| created_utc | text | Created UTC time stamp in ISO-8601 format |
| updated_utc | text | Updated UTC time stamp in ISO-8601 format |


#### Table `Sessions` ####

This is  helper table for mantaining the relation with a signup/recovery session_key and  the corresponding passcode sent for aan account signup/recovery/login handshake. Once the passcode has been verified (or rejected) it MUST be removed from the table.

|Column name|Datatype|Description|
|--|--|--|
| `key` | text | The signup/recovery/login session key |
| passcode | integer | A numeric passcode for validating signup/login |
| contact | text | Email or phone used as contact info to signup/recover/login | 
| type | text | `RQ`: Requester, `VL`: Validator, `XA`: External app |
| created_utc | text | Created UTC timestamp in ISO-8601 format |
| updated_utc | text |  Max time for the passcode life, UTC time stamp in ISO-8601 format.  |



#### Table `Files`

It is an auxiliary table describing the uploaded content files, and their state. The process of uploading a file has this steps:

1. The app prepares uploader FormData including `file` and `uploader_uid`  (typically the validator_uid, who is also the App user uploading the file).
2. Upload from App (`POST /verifications/:uid/files`) and store it in GW temp storage assigning a tmp UUID (for example: `/tmp/123e4567-e89b-12d3-a456-426614174000.mp4`).
3. **Insert into Files table** (uuid=, state= TMP, request_uid= :uid, owner_uid= Verifications.findByUid(:uid).account_uid, uploader_uid= request.body.uploader_uid,  type= request.header.Content_type, cid=NULL)
4. Encrypt file **using the `owner` account public key** 
5. **Update table Files** (state=ENC, ...)
6. Upload encripted file to IPFS service (FileCoin or variant)
7. Get th IPFS ContentID for the file -> `CID`
8. **Update table Files** (state=IPFS, cid=CID)
9. Remove the file from temp GW storage

| Column name  | Datatype | Description                                                  |
| ------------ | -------- | ------------------------------------------------------------ |
| uid | text | An auto assigned UUID. |
| request_uid | text | The request uid to which this file is attached. |
| owner_uid | text | The account uid which acts as owner of the file, typically the 'requester_uid' who made the verification request. |
| uploader_uid | text | Account uid who uploaded it, usually a validator account uid. |
| type | text | The file type Content-Type |
| state | text | `TMP`: Temp. uploaded, `ENC`: Encrypted, `IPFS`: Saved to IPFS |
|  cid  | text | Final ContentId returned by IPFS (or variant) |
| created_utc | text | Created UTC timestamp in ISO-8601 format |



## Subjects and Personal Data Access Model ##

This takes into account the needs to allow restricted access to some accounts to a subject's personal data. It defines which accounts have been given permission (allowed) to access a certain set of properties (an only those ones).

![Subjects and Personal Data DB Schema](../images/Personal_Data_Access_Schema.png)

