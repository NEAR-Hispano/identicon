# Validator Tasks 

$$TODO$$

We need endpoints for:

- Get a given Task assigned to a Validator for certain verification_request.

- Save a draft of a given Task, because the Validator still needs to complete info.

- Get all PENDING/DRAFT Tasks of a given Validator.

- Get all DONE Tasks of a given Validator, just for historical reasons.

**The GW assigns tasks to validators** by calling contract method `assign_validators` on a given verification_request:

- But it is a set of Tasks, always more than one, which is assigned to a group of validators, not a single task. So we don't have a 1-1 relation between tasks and transactions.
- So we can not represent PENDING/DRAFT tasks as transactions performed on the BC.
- So we need a some Task entity info stored in the GW while the task has not been completed.

**The Validor reports his/her result on a given verification_request**, by calling the contract method `report_validation_result`:

- In this case the generated transaction fully represents the completed Task.

- And we need to have info in the GW index, relating the DONE Task and the Transaction.

**Conclusions**:

- We need and entity `Task` to represent Pending and Draft tasks.
- Add transaction info to the Task, to extend the completed Task.
- 

### GET /tasks ?validator_id= &state= 

### GET /tasks/:uid

Get the given Task, and some extra info from the associated request.

### PUT /tasks/:uid



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



## Drafts 

