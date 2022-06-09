# Gateway OpenAPI

***This is VERY preliminar work. Will change.*** 

Here we describe the API exposed by Identicon to clients of the service. It is aconceptual and informal description of the APIs provided (they will be formally described using [Swagger Specification](https://swagger.io/specification/))

Clients may be of two types:

- A **frontend app or website** which uses this API for onboarding, requesting verifications, browsing results, etc. This can be any frontend technology able to make HTTPS calls. This clients will usually login and operate many functions of the API.

- An **external dApp** or **external service** which uses this API for requesting verifications for its own users. In this case, the must first signup and generate an API_KEY, which then can later use to make requests to the API, with any technology able to make HTTPS calls.

## Common features ##

### Endpoints and resources

Endpoints follow the established convention for representing **resources**. Available resources are:

**[Sessions](./sessions-api.md)**: Onboarding and login handshakes:

- POST /sessions/signups
- POST /sessions/recoveries
- POST /sessions/logins

**[Accounts](./accounts-api.md)**: All NEAR accounts managed by the GW:

- GET  /accounts/:uid
- PUT  /accounts/:uid
- DELETE  /accounts/:uid

**[Verifications](./verifications-api.md)**: Verification requests and its associated data, including File attachments (such as photos and videos) encripted and uploaded to IPFS, which may be linked to an `account_uid` or `request_uid`:

- POST /verifications
- GET  /verifications ?requester_uid &states
- GET  /verifications/:uid
- PUT /verifications/:uid
- POST /verifications/:uid/files
- POST /verifications/:uid/results
- GET  /verifications/:uid/credentials

**[Tasks](./tasks-api.md)**: Validator tasks (represented by transactions performed in the BC) and its results binded to a certain `request_uid` and `account_uid` and `transaction_uid`:

- GET  /transactions/:uid
- GET  /transactions ?actor_uid &action

### Request

**Headers**

- `Authorization`: When authorization is required,  calls need to set this to `Bearer $AUTH_KEY` or `Bearer $API_KEY`.
- `Content-Type`: `application/json` .
- `Accept`: `application/json`.

**Body**

- All methods must send a JSON encoded body.

### Response

**Headers**

- `Content-Type`: `application/json`. But this may change in some special cases (downloading files).

**Body**

- All methods return a JSON encoded body. The only exception are GET methods which return file contents, in which case the Contenty-Type will be set by the server.

### Error codes

All errors will be reported using the standard HTTP Errors, and the specific errors for each method and its messages are described in the corresponding section. The only common error code is:
- `500 Internal Server Error`: Unexpected condition was encountered and no more specific message is suitable.
