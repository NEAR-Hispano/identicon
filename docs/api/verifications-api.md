# Verifications API

### GET /verifications ? states=[] ordered=

Lists all verifications requested by the authorized logged in account, filtered by the given states, and ordered by ascending or descending created_utc.

### POST /verifications

The authorized logged in account requests a new verification for certain Subject.

This will encrypt the subject info and send the request to the BC.

### GET /verifications/:uid

Get all the Verification data for the given `request_id`. This method requires a logged and authorized user.

### PUT /verifications/:uid

### GET /verifications/:uid/certificate



