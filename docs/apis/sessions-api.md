
# Sessions API

Manages the onboarding handshake and establishes a new session.

### POST `/sessions/signup`

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
  type: "" // `RQ`: Requester, `VL`: Validator, `XA`: External app
~~~

**Actions**

1. If no email or phone => ERR 400
1. If received email/phone exists in `accounts` table => ERR 409
1. **Generate `passcode`**
1. If contact exists in `session`, **Update `session` with new `passcode`**
1. If contact does no exist in `session`, **Insert into `session(key, contact, passcode, type)`**
1. **Send email/SMS with passcode** to user using contact
1. => Response

**Response**: 

Will send a passcode to the email or phone, and return a `session_key` linked to the sent `passcode` needed to continue the onboarding.
~~~
headers:
  Status: 200 OK. User not registered, we already send a "passcode" to this email or phone, please wait.
  Content-Type: application/json
  Accept: application/json
body: 
  session: "session_key"
  requires_passcode: true
  requires_password: false
~~~

**Errors**:
- `400 Bad request`: Incomplete or malformed body. Must fullfill request format.
- `409 Conflict`:  User is already registered. Must go to `accounts/login`.

### POST `/sessions/recovery`

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

**Actions**

1. If no email or phone => ERR 400
1. If received email/phone NOT exists in `accounts` table => ERR 401
1. **Generate `passcode`**
1. If contact exists in `session`, **Update `session` with new `passcode`**
1. If contact does no exist in `session`, **Insert into `session` with `key, contact, passcode`**
1. **Send email/SMS with passcode** to user using contact
1. => Response

**Response**: 

Server will send a passcode to the email or phone, and return a `session_key` linked to the sent `passcode` needed to continue the recovery. 
~~~
headers:
  Status: 200 OK. User already registered, we already send a "passcode" to this email or phone, wait for it.
  Content-Type: application/json
  Accept: application/json
body: 
  session: "session_key"
  requires_password: false
  requires_passcode: true
~~~

Errors:
- `400 Bad request`:  Incomplete or malformed body. Must fullfill request format.
- `401 Unauthorized`:  User not registered. Must go to `accounts/signup`.

### POST `/session/login`

When the user has completed the signup or recovery phases, and has entered the received passcode, so we can establish an authenticated and authorized connection with the server.

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

**Actions**

1. If no sesion_key or passcode => ERR 400
1. If received passcode does NOT match existent in `session` table => ERR 401
1. Find `account` using received `session` contact
1. If contact NOT exists in `account`, **Create new account and NEAR account**
1. **Generate JWT AUTH_KEY** using new or existent account info
1. **Delete `session`** with `session_key`
1. => Response

**Response**: 

Will return the `AUTH_KEY` which can be used  for all subsequent calls to the API. The `AUTH_KEY` is a JWT token composed using `{account_uid, type, access_datetime, expires_datetime}`.
~~~
headers:
  Status: 200 Ok. Login succesfull, can use AUTH_KEY from now on.
  Content-Type: application/json
  Accept: application/json
body: 
  authorized: "AUTH_KEY" // JWT Token
~~~

**Errors:**
- `400 Bad request`:  Incomplete or malformed body. Must fullfill request format.
- `401 Unauthorized`:  Invalid passcode. Must try again.
