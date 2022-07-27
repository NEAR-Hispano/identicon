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
    pub fn report_validation_result(
        &mut self,
        request_uid: RequestId,
        result: VerificationState,
        contents: Vec<FileId>,
        remarks: String,
    ) {
        // MUST use the signer_account_id, see: 
        let signer_id = env::signer_account_id();
        log!("\nreport_verification_result: Called method ({:?} {:?} {:?} {:?} {:?})",
            signer_id, request_uid, result, contents, remarks);

        // check if request_uid exists 
        let requested = self.verifications.get(&request_uid);
        assert!(requested.is_some(),
            "{}", ERR_REQUEST_UID_DOES_NOT_EXIST);
    
        // check if validator exists
        assert!(self.validators.iter().any(|e| e.id == signer_id),
            "{}", ERR_VALIDATOR_DOES_NOT_EXIST);

        let mut requested = requested.unwrap();
        for j in 0..requested.validations.len() {
            if requested.validations[j].validator_id == signer_id {
                requested.validations[j] = ValidationTask {
                    validator_id: signer_id.clone(),
                    is_type: requested.validations[j].is_type.clone(),
                    result: result.clone(),
                    remarks: remarks.clone(),
                    contents: contents.clone(),
                    timestamp: "2022-03-31 16:00:00".to_string(),
                };
            }
        }

        // see if all tasks havecompleted and evaluate Verification state
        requested.state = self.evaluate_results(&requested);
        log!("{:?}",requested);
        self.verifications.insert(&request_uid, &requested);
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

    // Check if we have arrived at final consensus on this Verification
    fn evaluate_results(
        &mut self, 
        request: &VerificationRequest
    ) -> VerificationState {
        let mut approved: usize = 0;
        let mut rejected: usize = 0;
        let mut pending: usize = 0;
        let mut willnotdo: usize = 0;
        let mut notpossible: usize = 0;
        let min_consensus: usize = self.params.min_consensus_needed as usize;
        let len: f32 = request.validations.len() as f32;
        let mut consensus: usize = (2.0/3.0*len) as usize;
        consensus = if consensus < min_consensus { min_consensus } else { consensus };
        for t in request.validations.iter() {
            match t.result {
                VerificationState::Approved => approved = approved+1,
                VerificationState::Rejected => rejected = rejected+1,
                VerificationState::Pending => pending = pending+1,
                VerificationState::WillNotDo => willnotdo = willnotdo+1,
                VerificationState::NotPossible => notpossible = notpossible+1,
                _ => {}
            }
        }            
        if approved >= consensus { return VerificationState::Approved };  
        if rejected >= consensus { return VerificationState::Rejected };  
        if willnotdo >= consensus { return VerificationState::WillNotDo }; 
        if notpossible >= consensus { return VerificationState::NotPossible };  
        if pending >= consensus { return VerificationState::Pending };  
        (*request).state.clone() // return current state
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

    #[test]
    fn test_report_result() {
        setup_test("mazrq.testnet");
        let mut contract = VerificationContract::new();
        // add request
        let request_uid = "1234".to_string();
        let subject_id = "AR_DNI_12488353".to_string();
        let payload = "Some simulated encrypted payload".to_string();
        contract.request_verification(
            request_uid.clone(),
            VerificationType::ProofOfLife,
            subject_id.clone(),
            payload.clone(),
        );
        assert_eq!(contract.verifications.len(), 1);
        // add validator
        setup_test("maz1.testnet");
        let can_do = vec![ValidationType::Remote, ValidationType::Review];
        contract.register_as_validator(can_do.clone());
        setup_test("maz2.testnet");
        let can_do = vec![ValidationType::Remote, ValidationType::Review];
        contract.register_as_validator(can_do.clone());
        setup_test("maz3.testnet");
        let can_do = vec![ValidationType::Remote, ValidationType::Review];
        contract.register_as_validator(can_do.clone());
        assert_eq!(contract.validators.len(), 3);
        // assign validators
        setup_test("identicon.testnet");
        contract.assign_validators(
            request_uid.clone(),
            vec!["maz1.testnet".to_string(),"maz1.testnet".to_string(),
            "maz1.testnet".to_string(),"maz1.testnet".to_string(),
            "maz1.testnet".to_string(),"maz2.testnet".to_string(),
            "maz2.testnet".to_string(),"maz2.testnet".to_string(),
            "maz2.testnet".to_string(),"maz2.testnet".to_string(),
            "maz3.testnet".to_string(),"maz3.testnet".to_string()]
        );
        // NOW report
        setup_test("maz1.testnet");
        contract.report_validation_result(
            request_uid.clone(),
            VerificationState::Rejected,
            Vec::new(),
            "Done !".to_string()
        );
    }
}
