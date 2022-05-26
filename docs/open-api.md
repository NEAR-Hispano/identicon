# Gateway RESTful API

***This is VERY preliminar work. Will change.*** 

Here we describe the API exposed by Identicon to clients of the service. 

Clients may be of two types:

- A **frontend app or website** which uses this API for onboarding, requesting verifications, browsing results, etc. This can be any frontend technology able to make HTTPS calls. This clients will usually login and operate many functions of the API.

- An **external dApp** or **external service** which uses this API for requesting verifications for its own users. In this case, the must first signup and generate an API_KEY, which then can later use to make requests to the API, with any technology able to make HTTPS calls.

## Common features ##

### Endpoints and resources

Endpoints follow the established convention of representing **resources**. Available resources are:

- `accounts`: All NEAR accounts managed by the GW.
- `verifications`: Verification requests and its associated data.
- `tasks`: Validator tasks and its results binded to a certain `request_uid` and/or `account_uid`
- `files`: File attachments (such as photos and videos) encripted and uploaded to IPFS. All files must be linked to a certain `request_uid` or `account_uid`

### Request

**Headers**

- `Authorization`: When authorization is required,  calls need to set this to `Bearer $AUTH_KEY` or `Bearer $API_KEY`.
- `Content-Type`: `application/json` .
- `Accept`: `application/json`.

**Body**

All methods use a JSON encoded body.

### Response

**Headers**

Body

- All methods return a JSON encoded body. The only exception are GET methods which return file contents, in which case the Contenty-Type will be set by the server.

Error codes

- `500 Internal Server Error`: Unexpected condition was encountered and no more specific message is suitable.

## Account

### POST /accounts/signup

Starts the onboarding process for a new user. 

**Request**: 

Must include either a "phone" or an "email"  property in the body. The server will proceed according to which one is present in the body.

~~~json
headers:
  Content-Type: application/json
  Accept: application/json
body: 
  email: ""
  phone: ""
~~~

**Response**: 

Will send a passcode to the email or phone, and return a `session_key` linked to the sent `passcode` needed to continue the onboarding.

~~~json
headers:
  Status: 200 OK. User not registered, we already send a "passcode" to this email or phone, please wait.
  Content-Type: application/json
  Accept: application/json
body: 
  session: "session key"
  requires_passcode: true
	requires_password: false
~~~

**Errors**:

- `400 Bad request`: Incomplete or malformed body. Must fullfill request format.
- `409 Conflict`:  User is already registered. Must go to `accounts/login`.

### POST /accounts/recovery

Used when the user has logged out and it's AUTH_KEY has been erased from the LocalStorage. The user MUST remember the email or phone used for signup, otherwise we can't do any recovery.

**Request**:  

Must include either a "phone" or an "email"  property in the body. The server will proceed according to which one is present in the body.

~~~json
headers:
  Content-Type: application/json
  Accept: application/json
body: 
  email: ""
  phone: ""
~~~

**Response**: 

Server will send a passcode to the email or phone, and return a `session_key` linked to the sent `passcode` needed to continue the recovery. 

~~~json
headers:
  Status: 200 OK. User already registered, we already send a "passcode" to this email or phone, wait for it.
  Content-Type: application/json
  Accept: application/json
body: 
  session: "session key"
  requires_password: false
	requires_passcode: true
~~~

Errors:
- `400 Bad request`:  Incomplete or malformed body. Must fullfill request format.
- `401 Unauthorized`:  User not registered. Must go to `accounts/signup`.

### POST /accounts/login

When the user has completed the signup or recovery phases, and has entered the received passcode, so we can establish an authentiacted and authorized connection with the server.

**Request**: 

Must send the `session_key` and the user input `passcode`.

~~~json
headers:
  Content-Type: application/json
  Accept: application/json
body: 
	session: "session_key"
  passcode: "passcode value" 
~~~

**Response**: 

Will return the `AUTH_KEY` which can be used  for all subsequent calls to the API.

~~~json
headers:
	Status: 200 Ok. Login succesfull, can use AUTH_KEY from now on.
  Content-Type: application/json
  Accept: application/json
body: 
  authorized: "AUTH_KEY"
~~~

**Errors:**

- `400 Bad request`:  Incomplete or malformed body. Must fullfill request format.
- `401 Unauthorized`:  Invalid passcode. Must try again.

### GET /accounts/:uid

### PUT /accounts/:uid

### DELETE /accounts/:uid

### GET /accounts/:uid/verifications ? states=[]

## Verifications

### GET /verifications ? states=[] ordered=

Lists all verifications requested by the authorized logged in account, filtered by the given states, and ordered by ascending or descending created_utc.

### POST /verifications

The authorized logged in account requests a new verification for certain Subject.

This will encrypt the subject info and send the request to the BC.

### GET /verifications/:uid

Get all the Verification data for the given `request_id`. This method requires a logged and authorized user.

### PUT /verifications/:uid

### GET /verifications/:uid/certificate



