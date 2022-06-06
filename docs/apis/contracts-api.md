
# Contract Methods

:warning: This is Work in progress.

### Called by *Requestor*

- `request_verification(requestor_id, is_type, subject_id, subject_info)` Registers the new request in the blockchain and assigns validators to verify it.

- `pay_validators(requestor_id, subject_id)`  After reception of all the validators results, we must pay each of the validators the corresponding compensation (0.5 NEAR). Validators which did not complete the verification will not receive payment.

### Called by *Validators*

- `report_verification_result(validator_id, subject_id, result, cause)` Report the result of the verification. If the verification was not possible, or the validator will not do it then  the validator must include a descriptive cause.

- `register_as_validator(validator_id)` The NEAR account owner registers itself as a validator.

### Private

- `assign_validators(self, subject_id) -> Validators` When the request is filled, we must select a number of validators at random from the validators pool, and assign them to the request-

- `evaluate_results(self, results) -> VerificationState`   Every time we receive a verification result we must evaluate if all verifications have been done, and which is the final result for the request. While the verifications are still in course the request state is Pending.

### Not implemented

- `cancel_verification(subject_id, cause)`

- `get_verification_transactions(requestor_id, subject_id)` 

- `get_all_verifications_history(requestor_id, filters)` 

- `mint_digital_passport(requestor_id, subject_id)`  

- `unregister_as_validator(validator_id, self)` 

- `get_my_assigned_verifications(validator_id)` 

- `get_my_verifications_history(validator_id, filters)` 

