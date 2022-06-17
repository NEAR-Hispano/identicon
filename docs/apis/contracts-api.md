
# Contract Methods

:warning: This is Work in progress.

**Requester methods** This methods will be called by Requester or External accounts, never by a Validator.

### request_verification

Registers the new request in the blockchain, but does not yet assigns validators to verify it. 
~~~rust
request_verification(
  uid: RequestId,
  is_type: VerificationType 
  subject_id: SubjectId, 
  payload: RequestInfo
) -> ReturnStatus<VerificationRequest>
~~~

If success returns the registered `VerificationRequest` completed. In case the request was not allowed, response `WillNotDo` contains the reason.

### cancel_verification
~~~rust
cancel_verification(
  request_uid, 
  cause
) -> ReturnStatus<String>
~~~

---
**Validator methods**: This methods will be called only by a Validator account.

### register_as_validator

The account registers itself as a validator. indicating what types of work he/she can perform.
~~~ 
register_as_validator(
  can_do: Vec<ValidattionType>
) -> Result 
~~~

### get_assigned_validations

Called by a given validator to get all of its assigned tasks.
~~~rust
get_assigned_validations(
) -> Vec<AssignedValidation>
~~~

Returns: A `Vec` of  `AssignedValidation` objs each containing `{request_uid, type, result, must_start, must_end}`

### report_validation_result

Report the result of the verification. If the verification was not possible, or the validator will not do it then  the validator must include a descriptive cause.
~~~rust
report_validation_result(
  request_uid: RequestId, 
  result: VerificationState, 
  contents: Vec<ContentID>, 
  remarks: String
) -> VerificationState
~~~

Every time we receive a verification result we must also evaluate if all validations have been done, and which is the final result for the request. While the verifications are still in course the request state is Pending.

### unregister_as_validator

Sometimes a validator may want to remove itself from the validator pool.
~~~rust
unregister_as_validator(
) -> Result
~~~

---
**Master methods**: This methods will be called by the Master account (probably identicon.near), when it's time comes depending of the state of one or more queues, or on the GW demands.

### assign_validators

Assigns the validators to this request. 
~~~rust
assign_validator(
  request_uid: RequestId,
  validators_set: Vec<ValidatorId>
) -> Vec<ValidatorId>
~~~

Preconditions:
- The request_uid must be a pending request.

Returns: The list of validators assigned to this request, or an empty Vec.

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
**Private methods**: Used by the other methods.

### evaluate_results

Every time we receive a verification result we must evaluate if all verifications have been done, and which is the final result for the request. While the verifications are still in course the request state is Pending.
~~~
evaluate_results(
  &self, 
  results: Vec<ValidationTask>
) -> VerificationState
~~~

## FALTA

How to generate the Credential ?
