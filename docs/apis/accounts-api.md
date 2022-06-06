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

**Actions**

1. If no email or phone => ERR 400
1. If received email/phone exists in `accounts` table => ERR 409
1. **Generate `passcode`**
1. If contact exists in `session`, **Update `session` with new `passcode`**
1. If contact does no exist in `session`, **Insert into `session` with `key, contact, passcode`**
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

### POST `/accounts/login`

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
1. If contact NOT exists in `account`, **Create new account**
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

### GET `/accounts/current`

Returns all info (including the private personal info) of the currently logged account. Server will use the `AUTH_KEY` from the `Authorization` header to extract the current `account uid` and will decrypt the personal info that it will return.

**Request**: 
~~~
headers:
  Authorization: "Bearer AUTH_KEY"
  Content-Type: application/json
  Accept: application/json
~~~

**Response**: 
~~~
headers:
  Status: 200 Ok. 
  Content-Type: application/json
  Accept: application/json
body: { 
  // data existent in the 'accounts' table
  uid
  state
  type
  email
  phone
  verified
  subject_id
  linked_account_uid
  created_utc
  updated_utc
  personal_info: {
    full_name
    birthday // ISODate format, ex: '1956-05-12'
    age
    sex // 'M', 'F', 'U'
    country // ex 'mx', 'ar', 've', 'bo', cl', 'uy', ..
    region // region/state/province code 
    comune // city code 
    address // free format full address data, understandable by Maps 
    coordinates // GPS coords
    idioms // list of prefered language codes, ex 'es', 'en' 'po' ...
    health // free format description of health status if it applies
  }
~~~

**Errors:**
- `403 Forbidden`:  Invalid AUTH_KEY or it may be due to the user not having the necessary permissions for this resource.
- `404 Not Found`: The requested account_uid could not be found.

### PUT `/accounts/{uid}`

Update all info (including the private personal info) of the given account. Server will use the `AUTH_KEY` from the `Authorization` header to check if the current `account uid` has permissions to change this account data. 

:eyes: Currently, we expect the only case will be an account updating its own info, so "uid === logged account". 

**Request**: 
~~~
headers:
  Authorization: "Bearer AUTH_KEY"
  Content-Type: application/json
  Accept: application/json
body:
  state
  type
  email
  phone
  verified
  subject_id
  linked_account_uid
  created_utc
  updated_utc
  personal_info: {
    full_name
    birthday // ISODate format, ex: '1956-05-12'
    age
    sex // 'M', 'F', 'U'
    country // ex 'mx', 'ar', 've', 'bo', cl', 'uy', ..
    region // region/state/province code 
    comune // city code 
    address // free format full address data, understandable by Maps 
    coordinates // GPS coords
    idioms // list of prefered language codes, ex 'es', 'en' 'po' ...
    health // free format description of health status if it applies
  }
~~~

**Response**: 
~~~
headers:
  Status: 200 Ok. 
  Content-Type: application/json
  Accept: application/json
~~~

**Errors:**
- `403 Forbidden`:  Invalid AUTH_KEY or it may be due to the user not having the necessary permissions for this action.
- `404 Not Found`: The requested account_uid could not be found.
- `409 Conflict`: The request could not be processed because of conflict in the current state of the resource, a malformed body, or invalid data.

### DELETE `/accounts/{uid}`

This wil change the state of the given account to `D (Deleted)`. The account will NOT be physically deleted from the DB. Server will use the `AUTH_KEY` from the `Authorization` header to check if the current `account uid` has permissions to change this account state. 

**Request**: 
~~~
headers:
  Authorization: "Bearer AUTH_KEY"
  Content-Type: application/json
  Accept: application/json
~~~

**Response**: 
~~~
headers:
  Status: 200 Ok. 
  Content-Type: application/json
  Accept: application/json
~~~

**Errors:**
- `403 Forbidden`:  Invalid AUTH_KEY or it may be due to the user not having the necessary permissions for this action.
- `404 Not Found`: The requested account_uid could not be found.

### GET `/accounts/{uid}/verifications?states=[]`
