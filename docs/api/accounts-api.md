# Accounts API

### POST `/accounts/signup`

Starts the onboarding process for a new user. 

**Request**: 

Must include either a "phone" or an "email"  property in the body. The server will proceed according to which one is present in the body.

~~~
headers:
  Content-Type: application/json
  Accept: application/json
body: 
  email: ""
  phone: ""
~~~

**Response**: 

Will send a passcode to the email or phone, and return a `session_key` linked to the sent `passcode` needed to continue the onboarding.

~~~
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

### POST `/accounts/recovery`

Used when the user has logged out and it's AUTH_KEY has been erased from the LocalStorage. The user MUST remember the email or phone used for signup, otherwise we can't do any recovery.

**Request**:  

Must include either a "phone" or an "email"  property in the body. The server will proceed according to which one is present in the body.

~~~
headers:
  Content-Type: application/json
  Accept: application/json
body: 
  email: ""
  phone: ""
~~~

**Response**: 

Server will send a passcode to the email or phone, and return a `session_key` linked to the sent `passcode` needed to continue the recovery. 

~~~
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

~~~
headers:
  Content-Type: application/json
  Accept: application/json
body: 
  session: "session_key"
  passcode: "passcode value" 
~~~

**Response**: 

Will return the `AUTH_KEY` which can be used  for all subsequent calls to the API.

~~~
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

### GET `/accounts/:uid`

### PUT `/accounts/:uid`

### DELETE `/accounts/:uid`

### GET `/accounts/:uid/verifications?states=[]`
