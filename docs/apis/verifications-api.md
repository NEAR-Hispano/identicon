# Verifications API

### POST `/verifications`

The authorized logged in account requests a new verification for certain Subject. This will encrypt the subject info and send the request to the BC.

Preconditions:
- Requires a logged and authorized user.
- The requester is the logged account.
- The user must be either a Requester or External, never a Validator.
- `subject_id` must NOT be empty and respect the `${country_code}_${doc_type}_${doc_number}` format.
- All personal info fields are required and can NOT empty (some of them may require additional validation, such as birtday). Exceptions are `health, extras` which can be empty.

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

**Actions**

1. If not authorized => ERR 401
1. If authorized but Account_uid does not exist => ERR 404
1. If authorized but Account not RQ or XA => ERR 403
1. If preconditions not verified => ERR 409
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

Preconditions:
- Requires a logged and authorized user. 
- The user must be either a Requester or External, never a Validator.
- FOR NOW (this may change in the future) only requester can access this data, so requester_uid MUST be the logged uid. 

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

Preconditions:
- Requires a logged and authorized user. 
- The auth user must be either a Requester or External, never a Validator.
- FOR NOW (this may change in the future) only requester can access this data. 

**Request**: 
~~~
headers:
  Authorization: "Bearer AUTH_KEY"
  Content-Type: application/json
  Accept: application/json
query:
  request_uid: // the request UUID
~~~

**Response**: 
~~~
headers:
  Status: 200 Ok. 
  Content-Type: application/json
  Accept: application/json
body: 
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
    tansactions: [ // array of all transactions linked to this request
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

Conditions:
- Requires a logged and authorized user. 
- The user can be either a Requester, Validator or External.


### GET /verifications/:uid/credentials

Get the certificate of this Verification after the Verification was completed.

/*
??? ### POST /verifications/:uid/credentials

Emmit the certificate for a this Verification after the Verification is completed.
*/

### POST /verifications/:uid/results

Post the results of a verification done by the logged Validator. 

Conditions: 
- Requires a logged and authorized user. 
- The logged user must be a Validator sending the result of his work. 
- He/she must be have been assigned to this request.
- The request must be in a Pending or Started state. 
- It MUST include some associated files (one or more).

### POST /verifications/:uid/files

Add a file to the given Verification, that it will later be linked to a given result.

The file must FIRST be encripted using the Requester public_key and THEN uploaded to IPFS.

~~~
headers:
  Authorization: "Bearer AUTH_KEY"
  Content-Type: application/json
  Accept: application/json
body:
  files:
  validator_uid:
~~~ 
