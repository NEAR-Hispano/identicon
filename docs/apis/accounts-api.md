
# Accounts API

Manages the Account info.

### GET `/accounts/:uid`

Returns all info (including the private personal info) of the currently logged account. Server will use the `AUTH_KEY` from the `Authorization` header to verify the current logged user has permissions to see this info and will decrypt the personal info that it will return.

**NOTE**: For now ONLY the current logged user can access it's own info, so ":uid === logged account". 

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
  subject_id // `${countryCode}_${docType}_${docNumber}`, ex: AR_DNI_1234567890
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
    languages // list of prefered language codes, ex 'es', 'en' 'po' ...
    health // free format description of health status if it applies
  }
~~~

**Errors:**
- `403 Forbidden`:  Invalid AUTH_KEY or it may be due to the user not having the necessary permissions for this resource.
- `404 Not Found`: The requested account_uid could not be found.

### PUT `/accounts/{uid}`

Update all info (including the private personal info) of the given account. Server will use the `AUTH_KEY` from the `Authorization` header to check if the current `account uid` has permissions to change this account data. 

:eyes: Currently, we expect the only case will be an account updating its own info, so ":uid === logged account". 

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
    languages // list of prefered language codes, ex 'es', 'en' 'po' ...
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
- `404 Not Found`: The requested account :uid could not be found.
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



### GET `/accounts/{uid}/assigned?states=[] &after=`

Get all verifications assigned to this Validator account, filtered by state. It includes both pending and done verifications.  

**Note** that part of this ino is in the `Transactions` table and part in the BC, we dont't have all of it in the GW.

Currently only the Validators can access this data, so "logged uid == :uid and logged type == Validator". 

**Request**: 
~~~
headers:
  Authorization: "Bearer AUTH_KEY"
  Content-Type: application/json
  Accept: application/json
query:
  states: // an array of one or more state codes from ['PN', 'ST', 'FI']
  after: // only get verifications requested after this date
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
      account_uid // the Requester account uid
      type 
      subject_id 
      state // `PN`: Pending, `ST`: Started, `FI`: Finished |
      result // `AP`, `RX`, `NP`, `WND`, `CX` |
      created_utc
      updated_utc
      must_start_utc
      must_end_utc
      personal_info: { // The Validator needs ALL the Subject personal info
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
        health // free format description of health status if it applies
      }
    }
  ]
~~~

**Errors:**
- `403 Forbidden`:  Invalid AUTH_KEY or it may be due to the user not having the necessary permissions for this action.
- `404 Not Found`: The requested account :uid could not be found.
- `409 Conflict`: The request could not be processed because of conflict in the current state of the resource, a malformed body, or invalid data.
