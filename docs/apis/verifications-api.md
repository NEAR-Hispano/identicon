# Verifications API

### POST `/verifications`

The authorized logged in account requests a new verification for certain Subject.
This will encrypt the subject info and send the request to the BC.
Preconditions:
- Requires a logged and authorized user. 
- The user must be either a Requester or External, never a Validator.


### GET `/verifications ?requester_uid= &states=`

Get all verifications requested by this account, filtered by state. 

Preconditions:
- Requires a logged and authorized user. 
- The user must be either a Requester or External, never a Validator.
- Currently only the requester can access this data, so "requester_uid = logged uid" 

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
      state // `PN`: Pending, `ST`: Started, `FI`: Finished |
      result // `AP`, `RX`, `NP`, `WND`, `CX` |
      created_utc
      updated_utc
      must_start_utc
      must_end_utc
      // additional data from the Subject personal info
      full_name
    }
  ]
~~~

**Errors:**
- `403 Forbidden`:  Invalid AUTH_KEY or it may be due to the user not having the necessary permissions for this action.
- `404 Not Found`: The requested account :requester_uid could not be found.
- `409 Conflict`: The request could not be processed because of conflict in the current state of the resource, a malformed body, or invalid data.


### GET /verifications/:uid

Get all the Verification data of the given request `uid`. 


### PUT /verifications/:uid

Update the Verification data of the given request `uid`.

Conditions:
- Requires a logged and authorized user. 
- The user can be either a Requester, Validator or External.
- The user must be a Requester/External.


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

