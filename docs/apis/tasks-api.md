# Validator Tasks 

### GET /transactions/:uid

Get the given transaction, and some extra info from the associated request.

### GET /transactions ?actor_uid= &action= &order=created,desc

Get all transactions assigned to or done by the logged account and of the given type.
Can be used to get all validations done by a certain Validator.

**Request**
~~~
headers:
  Authorization: "Bearer AUTH_KEY"
  Content-Type: application/json
  Accept: application/json
query:
  actor_uid: // the account who performed this transaction
  actions: // array of one or more of [RQ, VL, CL] 
~~~ 

**Response**
~~~
headers:
  Status: 200 Ok. 
  Content-Type: application/json
  Accept: application/json
body: 
  [ 
    // an array of cero or more Transaction items and extras
    {
      uid
      request_uid // the request uid associated to this transaction
      actor_uid // the Requester account uid
      action 
      created_utc
      tx_log	// JSON additional information from TX log
      tx_uid // the NEAR Transaction ID for accessing Explorer
      // extra information coming from the associated request
      subject_id 
      full_name
      state 
    }
  ]
~~~

**Errors:**
- `403 Forbidden`:  Invalid AUTH_KEY or it may be due to the user not having the necessary permissions for this action.
- `409 Conflict`: The request could not be processed because of conflict in the current state of the resource, a malformed body, or invalid data.
