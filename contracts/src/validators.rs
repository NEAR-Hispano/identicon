use crate::definitions::*;
use crate::errors::*;
use near_sdk::{env, log};
use near_sdk::near_bindgen;

#[near_bindgen]
impl VerificationContract {

    // The account registers itself as a validator. indicating what types 
    // of work he/she can perform.
    pub fn register_as_validator(
        &mut self, 
        can_do: Vec<ValidationType>
    ) {
        // MUST use the signer_account_id, see: 
        let validator_id = env::signer_account_id();

        log!("\nregister_as_validator: Called with ({:?}, {:?})",
            validator_id, can_do);

        // check if 'id' already exists in Vec, we must traverse the full array
        assert!(!self.validators.iter().any(|e| e.id == validator_id),
            "{}", ERR_VALIDATOR_ALREADY_REGISTERED);

        self.validators.push(Validator {
        id: validator_id.clone(),
        can_do: can_do.clone(),
        status: "Active".to_string(),
        reputation: 1,
        })
    }


    /// Sometimes a validator may want to remove itself from the validator pool.
    pub fn unregister_as_validator(
        &mut self
    ) {
        // MUST use the signer_account_id, see: 
        let signer_id = env::signer_account_id();
        log!("\nunregister_as_validator: Called with ({:?})",
        signer_id);

        // check if 'id' already exists in Vec, we must traverse the full array
        assert!(self.validators.iter().any(|e| e.id == signer_id),
            "{}", ERR_VALIDATOR_DOES_NOT_EXIST);

        // retains all others, but remove this validator fom the list 
        self.validators.retain(|e| e.id != signer_id); 
    }    


    /// Called by a given validator to get all of its assigned tasks.
    fn get_assigned_validations(
        &mut self
    ) -> Vec<VerificationRequest> {
        // MUST use the signer_account_id, see: 
        let signer_id = env::signer_account_id();
        log!("\nget_assigned_validations: Called with ({:?})",
            signer_id);

        // check if 'id' already exists in Vec, we must traverse the full array
        assert!(self.validators.iter().any(|e| e.id == signer_id),
            "{}", ERR_VALIDATOR_DOES_NOT_EXIST);

        let assigns = self.assignments.get(&signer_id);
        assert!(assigns.is_some(), 
            "{}", ERR_NO_TASKS_ASSIGNED_TO_VALIDATOR);

        let assigned: Vec<RequestId> = assigns.unwrap();
        let mut results: Vec<VerificationRequest> = Vec::new();
        for request_id in assigned {
            let rq = self.filtered_request(request_id, signer_id.clone());
            results.push(rq);
        }
        results
    }   


    // Report the result of the verification. If the verification was not possible,
    // or the validator will not do it then  the validator must include a
    // descriptive cause.
    /* Called by *Validators* */
    pub fn report_validation_result(
        &mut self,
        request_uid: RequestId,
        result: VerificationState,
        contents: Vec<FileId>,
        remarks: String,
    ) {
        log!(
            "\nreport_verification_result: Called method ({:?} {:?} {:?} {:?})",
            request_uid, result, contents, remarks
        );

    //     // check if subject_id exists in verifications
    //     assert!(
    //         self.verifications
    //             .keys_as_vector()
    //             .iter()
    //             .any(|e| e == subject_id),
    //         "report_verification_result: Request not found for subject_id"
    //     );
    // 
    //     let mut requested = self.verifications.get(&subject_id).unwrap();
    //     let mut changed: Vec<VerificationResult> = Vec::new();
    //     for before in requested.results.iter() {
    //         if before.validator_id == validator_id {
    //             changed.push(VerificationResult {
    //                 validator_id: validator_id.to_string(),
    //                 result: stated.clone(),
    //                 timestamp: "2022-03-31 16:00:00".to_string(),
    //             });
    //         } else {
    //             changed.push(before.clone());
    //         }
    //     }
    // 
    //     // and update the full request state
    //     requested.results = changed.clone();
    //     self.verifications.insert(&subject_id, &requested);
    }

    // Filters the request leaving only this validator tasks
    fn filtered_request(
        &mut self,
        request_id: RequestId,
        validator_id: ValidatorId
    ) ->  VerificationRequest {
        let mut rq: VerificationRequest = self.verifications.get(&request_id)
            .expect(ERR_REQUEST_UID_DOES_NOT_EXIST);
        rq.validations.retain(|t| t.validator_id == validator_id);
        rq
    }
}


#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::test_utils::VMContextBuilder;
    use near_sdk::{testing_env, AccountId};

    // part of writing unit tests is setting up a mock context
    // provide a `predecessor` here, it'll modify the default context
    #[allow(dead_code)]
    fn get_context(signer: AccountId) -> VMContextBuilder {
        let mut builder = VMContextBuilder::new();
        builder.signer_account_id(signer);
        builder
    }

    fn setup_test(signer: &str) {
        // Set up the testing context and unit test environment
        let signer = AccountId::new_unchecked(signer.to_string());
        let context = get_context(signer);
        testing_env!(context.build());
    }

    #[test]
    fn test_register_validator() {
        setup_test("maz1.testnet");
        let mut contract = VerificationContract::new();
        let can_do = vec![ValidationType::Remote, ValidationType::Review];
        contract.register_as_validator(can_do.clone());
        assert_eq!(contract.validators.len(), 1);
    }

    #[test]
    #[should_panic]
    fn test_duplicate_validator() {
        setup_test("maz1.testnet");
        let mut contract = VerificationContract::new();
        let can_do = vec![ValidationType::Remote, ValidationType::Review];
        contract.register_as_validator(can_do.clone());
        // Second call MUST fail because already registered
        contract.register_as_validator(can_do.clone());
    }

    #[test]
    fn test_unregister_validator() {
        setup_test("maz1.testnet");
        let mut contract = VerificationContract::new();
        let can_do = vec![ValidationType::Remote, ValidationType::Review];
        contract.register_as_validator(can_do.clone());
        assert_eq!(contract.validators.len(), 1);
        contract.unregister_as_validator();
        assert_eq!(contract.validators.len(), 0);
    }

    #[test]
    #[should_panic]
    fn test_unregister_nonexistent() {
        setup_test("maz1.testnet");
        let mut contract = VerificationContract::new();
        contract.unregister_as_validator();
    }
}
