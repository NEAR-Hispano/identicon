
# Contract Methods

:warning: This is Work in progress.

**Requester methods**

This methods will be called by Requester or External accounts, never by a Validator.

### request_verification

Status (deployed :ok:)

Registers the new request in the blockchain, but does not yet assigns validators to verify it. 
~~~rust
request_verification(
  uid: RequestId,
  is_type: VerificationType 
  subject_id: SubjectId, 
  payload: String
) -> VerificationRequest
~~~

If success returns the registered `VerificationRequest` completed. 

In case the request was not allowed, the contract will panic with one of the error codes:
- ERR_REQUEST_UID_ALREADY_EXISTS
- ERR_SUBJECT_HAS_PENDING_VERIFICATION
- ERR_AVAILABLE_REQUESTS_CONSUMED)

### cancel_verification

Status (deployed :ok:)

~~~rust
cancel_verification(
  uid: RequestId, 
  cause: String
) 
~~~

---
**Validator methods**

This methods will be called only by a Validator account.

### register_as_validator

Status (deployed :ok:)

The account registers itself as a validator. indicating what types of work he/she can perform.
~~~ 
register_as_validator(
  can_do: Vec<ValidattionType>
) 
~~~

On failure may return:

-  ERR_VALIDATOR_ALREADY_REGISTERED

### get_assigned_validations

Status (deployed :ok:)

Called by a given validator to get all of its assigned tasks.
~~~rust
get_assigned_validations(
) -> Vec<VerificationRequest>
~~~

Returns: A `Vec` of  `VerificationRequest` objects each containing the info of each request assigned to this validator.

### report_validation_result

Status (deployed :ok:)

Report the result of the verification. If the verification was not possible, or the validator will not do it then  the validator must include a descriptive cause.
~~~rust
report_validation_result(
  request_uid: RequestId, 
  result: VerificationState, 
  contents: Vec<ContentID>, 
  remarks: String
) -> VerificationRequest
~~~

Every time we receive a verification result we must also evaluate if all validations have been done, and which is the final result for the request. While the verifications are still in course the request state is Pending.

Returns: The modified VerificationRequest. 

### evaluate_results

Status (deployed :ok:)

Every time we receive a verification result we must evaluate if all verifications have been done, and which is the final result for the request. While the verifications are still in course the request state is Pending.
**Is a private method**.

~~~
evaluate_results(
  &self, 
  request: &VerificationRequest
) -> VerificationState
~~~

### unregister_as_validator

Status (deployed :ok:)

Sometimes a validator may want to remove itself from the validator pool.
~~~rust
unregister_as_validator() 
~~~

---
**Master methods**: 

This methods will be called by the Master account (probably identicon.near), when it's time comes depending of the state of one or more queues, or on the GW demands.

### assign_validators

Assigns the validators to this request. Will return a vector with the selected validators id's.

Status (deployed :ok:)

~~~rust
assign_validators(
	uid: RequestId,
  validators_set: Vec<String>
) -> Vec<String> 
~~~

Preconditions:
- The request `uid` must be an existent pending request.
- ValidatorIds in the `validators_set` must be already registered validators.

### pay_validators

Once every period of time (once per week, for example) we must pay each of the validators the corresponding compensation for the work done on that period. Validators which did not complete the verification will not receive payment.
~~~
pay_validators(
  period_from: ISODateTime,
  period_to: ISODateTime
) -> Result
~~~

NOTE: This may be triggered by an external CRON (such as CRONCAT) or by a cron process in the GW.

---

## FALTA

How to generate the Credential ?
