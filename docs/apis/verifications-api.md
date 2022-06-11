# Verifications API

### POST `/verifications`

The authorized logged in account requests a new verification for certain Subject. This will encrypt the subject info and send the request to the BC.

**Request**

~~~
headers:
headers:
  Authorization: "Bearer AUTH_KEY"
  Content-Type: application/json
  Accept: application/json
body:
  subject_id 
  type // verification type: now only 'ProofOfLife' as required by Contract
  personal_info: {
    email 
    phone 
    full_name
    birthday // ISODate format, ex: '1956-05-12'
    age
    sex // 'M', 'F', 'U'
    country // ex 'mx', 'ar', 've', 'bo', cl', 'uy', ..
    region // region/state/province code 
    comune // city code 
    address // free format full address data, understandable by Maps 
    coordinates // GPS coords
    languages // list of prefered language codes, ex 'es', 'en' 'po' ...
    preferred // preferred way to contact `WHATSAPP`,`TELEGRAM`,`ONSITE`.
    health // free format description of health status if it applies
    extras // extra (future) info (such as preferences/other) as JSON obj
  }
~~~

**Preconditions**:

- Requires a logged and authorized user, or ERR => 401.
- The requester is the logged account, or ERR => 401.
- The user MUST have been verified and have and associated `subject_id`. This may be allowed when the Requester asks the verification for himself, or ERR => 403.
- `subject_id` must NOT be empty and respect the `${country_code}_${doc_type}_${doc_number}` format, or ERR => 409.
- All personal info fields are required and can NOT empty (some of them may require additional validation, such as birthday), exceptions are `health, extras` which can be empty, or ERR => 409.

**Actions**

1. Assign 'request_uid' = UUID.
1. **Call BC Contract `request_verification(request_uid, type, subject_id, personal_info)`**.
1. If call failed =>  ERR 409,402,500 (if possible use the BC call error)
1. If subject_id does not exist in `Subjects`, **Encrypt personal info and insert into table**.
1. **Insert into `Verifications` table** with request_uid, state='UN', result=NULL, and `must_start, must_end` as set by the contract call. 
1. **Add verification to queue so we can later assign validators**. 
1. => Response

**Response**: 

Will return the new `requested_uid` and verification (probable) time window.
~~~
headers:
  Status: 200 Ok. Verification request was successful
  Content-Type: application/json
  Accept: application/json
body: 
  request_uid // the assigned UUID for this request
  must_start // ISODatetime of probable start time
  must_end // ISODatetime of probable end time
~~~

**Errors:**
- `401 Unauthorized`:  No authorizated user or AUTH_KEY invalid.
- `403 Forbidden`:  Invalid AUTH_KEY or it may be due to the user not having the necessary permissions for this action.
- `402 Payment Required`: If the requester has exceeded the allowed number of montly requests, transfer of funds may be needed to allow additional requests.
- `404 Not Found`: The requester account could not be found.
- `409 Conflict`: The request could not be processed because of conflict in the current state of the resource, a malformed body, or invalid data.


### GET `/verifications ?requester_uid= &states=`

Get all verifications requested by this account, filtered by state. 

**Preconditions**:

- Requires a logged and authorized user, or ERR => 401.
- The user must be either a Requester or External, never a Validator, or ERR => 403.
- FOR NOW (this may change in the future) only requester can access this data, so requester_uid MUST be the logged uid, or ERR => 403.
- The `requester_uid` must exist, or ERR => 404.
- The `states` must be in the set of valid states, or ERR => 409.

**Request**: 

~~~
headers:
  Authorization: "Bearer AUTH_KEY"
  Content-Type: application/json
  Accept: application/json
query:
  requester_uid: // the requester who requested this verifications
  states: // an array of one or more state codes from ['PN', 'ST', 'FI']
~~~

**Response**: 

~~~
headers:
  Status: 200 Ok. 
  Content-Type: application/json
  Accept: application/json
body: 
  [ 
    // an array of cero or more Verification items
    {
      request_uid
      account_uid
      type 
      subject_id 
      state // `UN`: Unassigned, `PN`: Pending, `ST`: Started, `FI`: Finished |
      result // `PN`, `AP`, `RX`, `NP`, `WND`, `CX` |
      created_utc
      updated_utc
      must_start_utc
      must_end_utc
      // additional data from the Subject personal info,
      // but only the minimal neccesary ...
      full_name
    }
  ]
~~~

**Errors:**

- `401 Unauthorized`:  No authorizated user or AUTH_KEY invalid.
- `403 Forbidden`:  Invalid AUTH_KEY or it may be due to the user not having the necessary permissions for this action.
- `404 Not Found`: The account requester_uid could not be found.
- `409 Conflict`: The request could not be processed because of conflict in the current state of the resource, a malformed body, or invalid data.


### GET /verifications/:uid

Get all the Verification data of the given `request_uid`. 

**Request**: 

~~~
headers:
  Authorization: "Bearer AUTH_KEY"
  Content-Type: application/json
  Accept: application/json
query:
  request_uid: // the request UUID
~~~

**Preconditions**:

- Requires a logged and authorized user, or ERR => 401.
- The authorized user must be either a Requester or External, never a Validator, or ERR => 403.
- The `:uid` must exist, or ERR => 404.
- FOR NOW (this may change in the future) only requester can access this data, or ERR => 403.

**Response**:

~~~
headers:
  Status: 200 Ok. 
  Content-Type: application/json
  Accept: application/json
body: 
  account_uid
  subject_id 
  type // verification type: now only 'ProofOfLife' as required by Contract
  state // `UN`: Unassigned, `PN`: Pending, `ST`: Started, `FI`: Finished |
  result // `PN`, `AP`, `RX`, `NP`, `WND`, `CX` |
  created_utc
  updated_utc
  must_start_utc
  must_end_utc
  // additional data from the Subject personal info
  personal_info: { 
    email 
    phone 
    full_name
    birthday // ISODate format, ex: '1956-05-12'
    age
    sex // 'M', 'F', 'U'
    country // ex 'mx', 'ar', 've', 'bo', cl', 'uy', ..
    region // region/state/province code 
    comune // city code 
    address // free format full address data, understandable by Maps 
    coordinates // GPS coords
    languages // list of prefered language codes, ex 'es', 'en' 'po' ...
    preferred // preferred way to contact `WHATSAPP`,`TELEGRAM`,`ONSITE`.
    health // free format description of health status if it applies
    extras // extra (future) info (such as preferences/other) as JSON obj
  }    
   // array of all transactions linked to this request
  transactions: [
    { 
    uid // TX uid 
    action // RQ, VL, CL
    actor_uid
    log // json obj of TX log { remark, CIDs, etc ... }
    created_utc // sorted by created asc
    }
  ]
~~~

**Errors:**

- `401 Unauthorized`:  No authorizated user or AUTH_KEY invalid.
- `403 Forbidden`:  Invalid AUTH_KEY or it may be due to the user not having the necessary permissions for this action.
- `404 Not Found`: The account requester_uid could not be found.
- `409 Conflict`: The request could not be processed because of conflict in the current state of the resource, a malformed body, or invalid data.

### PUT /verifications/:uid

Update the Verification data of the given request `uid`.

**Request**: 

~~~
headers:
  Authorization: "Bearer AUTH_KEY"
  Content-Type: application/json
  Accept: application/json
query:
  account_uid
  type 
  subject_id 
  state // `UN`: Unassigned, `PN`: Pending, `ST`: Started, `FI`: Finished |
  result // `PN`, `AP`, `RX`, `NP`, `WND`, `CX` |
  created_utc
  updated_utc
  must_start_utc
  must_end_utc
  // additional data from the Subject personal info
  personal_info: { 
    email 
    phone 
    full_name
    birthday // ISODate format, ex: '1956-05-12'
    age
    sex // 'M', 'F', 'U'
    country // ex 'mx', 'ar', 've', 'bo', cl', 'uy', ..
    region // region/state/province code 
    comune // city code 
    address // free format full address data, understandable by Maps 
    coordinates // GPS coords
    languages // list of prefered language codes, ex 'es', 'en' 'po' ...
    preferred // preferred way to contact `WHATSAPP`,`TELEGRAM`,`ONSITE`.
    health // free format description of health status if it applies
    extras // extra (future) info (such as preferences/other) as JSON obj
  }      
~~~

**Preconditions**:

- Requires a logged and authorized user, or ERR => 401
- The authorized user must be either a Requester or External (never a Validator), or ERR => 403

- The `:uid` must be an existent `request_uid`, or ERR => 404
- The `account_id` must be either a Requester or External, or ERR => 403
- The `type, state, result`  must be valid values for each case, or ERR => 409

- The `subject_id` must be existent in subjects, or ERR => 409  

- The `must_start, must_end` must NOT be empty, or ERR => 409
- The `personal_info` may be empty or partially filled.

**Response**: 

~~~
headers:
  Status: 200 Ok. 
  Content-Type: application/json
  Accept: application/json
~~~

**Errors:**

- `401 Unauthorized`:  No authorizated user or AUTH_KEY invalid.
- `403 Forbidden`:  Invalid AUTH_KEY or it may be due to the user not having the necessary permissions for this action.
- `404 Not Found`: The account requester_uid could not be found.
- `409 Conflict`: The request could not be processed because of conflict in the current state of the resource, a malformed body, or invalid data.

### POST /verifications/:uid/results

Post the results of a verification done by the logged Validator.

**Request**: 

~~~
headers:
  Authorization: "Bearer AUTH_KEY"
  Content-Type: application/json
  Accept: application/json
query:
  validator_uid: // the validator UUID
  type: // the ValidationType
  state: // the VerificationState 
  remarks: // descriptive comments or remarks
  files: [] // the array of UUIDs of uploaded files (photos and videos)
~~~

**Preconditions**:

- Requires a logged and authorized user, or ERR => 401.
- The `:uid` must be an existent `request_uid`, or ERR => 404.
- The `validator_uid` must be an existent and verified Validator account, or ERR => 403.
- The `files` array must have at least one video file and one photo file, or ERR => 409.
- `type`and `state` must be valid values of each enum type, or ERR => 409.
- `remarks` may be empty.

**Actions**:

1. Find the file UUIDs and replace them with their corresponding CIDs.
2. Call the contract `report_validation_result` with (request_uid= :uid, result= body.state, contents= replaceFilesWithCID(body.files), remarks= body.remarks).
3. Get the call result, and **Update table Verifications** with (state= Finished, result= call.result)
4. Get the verified subject_id = Verifications.getByUid(:uid).subject_id 
5. If call.result is Approved, **Update table Subjects** with (subject_id, verified= True)
6. Get the account linked to this subject, account_id = Accounts.getBySubjectId(subject_id)
7. If call.result is Approved and account_id.subject_id is subject_id, **Update table Accounts** with (account_id, verified= True)
8. $$TODO$$: Capture the resulting transaction, **Insert into Transactions** with ...

**Response**: 

~~~
headers:
  Status: 200 Ok. 
  Content-Type: application/json
  Accept: application/json
~~~

**Errors:**

- `401 Unauthorized`:  No authorizated user or AUTH_KEY invalid.
- `403 Forbidden`:  Invalid AUTH_KEY or it may be due to the user not having the necessary permissions for this action.
- `404 Not Found`: The request_uid could not be found.
- `409 Conflict`: The request could not be processed because of conflict in the current state of the resource, a malformed body, or invalid data.

### POST /verifications/:uid/files

Attachs a file to the given Verification. The file is first uploaded, encripted using the Requester public_key and latter uploaded to IPFS, obtaining its ContentId. It will later be linked to a given result reported by a given Validator account. 

**Preconditions**:

- Requires a logged and authorized user, or ERR => 401.
- The `:uid` must be an existent `request_uid`, or ERR => 404.
- The user (and so the `uploader_uid`) must be a Validator account, or ERR => 403.
- The file Content-Type must be a valid image (JPG, PNG, GIFF, SVG) or video (MP4, AVI ) file type, , or ERR => 409.
- The file must weight less than MAX_FILE_SIZE bytes, or ERR => 413.

**Request**

~~~
headers:
  Authorization: "Bearer AUTH_KEY"
  Content-Type: multipart/form-data
FormData:
  files // (binary) file
  uploader_uid // the user account_uid
~~~

**Actions**

The process of uploading a file has this steps:

1. The app prepares the `FormData` including `file` and `uploader_uid`  (typically the validator_uid, who is also the App user uploading the file).
2. Receives upload from App (`POST /verifications/:uid/files`) and stores it in GW temp storage assigning a temporary UUID (for example: `/tmp/123e4567-e89b-12d3-a456-426614174000.mp4`).
3. **Inserts into table Files** (uuid=, state= TMP, request_uid= :uid, owner_uid= Verifications.findByUid(:uid).account_uid, uploader_uid= request.body.uploader_uid,  type= request.header.Content_type, cid=NULL)
4. Encrypts file **using the `owner` account public key** 
5. **Updates table Files** (state=ENC, ...)
6. Uploads encripted file to IPFS service (FileCoin or variant)
7. Get the IPFS ContentID for the file -> `CID`
8. **Updates table Files** (state=IPFS, cid=CID)
9. Removes the file from temp GW storage.

**Response**

~~~ 
headers:
  Status: 200 Ok. 
  Content-Type: application/json
  Accept: application/json
body: 
	uuid // the UUID assigned to the file by the GW
	state // the file temporary state after the upload
~~~

**Errors**

- `401 Unauthorized`:  No authorizated user or AUTH_KEY invalid.
- `403 Forbidden`:  Invalid AUTH_KEY or it may be due to the user not having the necessary permissions for this action.
- `404 Not Found`: The request :uid could not be found.
- `409 Conflict`: The request could not be processed because of conflict in the current state of the resource, a malformed body, or invalid data.
- `413 Payload Too Large`: The max allowed file size has been exceeded. The request is larger than the server is willing or able to process. 

### POST /verifications/:uid/credentials

Get the certificate of this Verification after the Verification was completed.

Emmit the certificate for a this Verification after the Verification is completed.
*/

$$TODO$$
