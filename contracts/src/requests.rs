use crate::definitions::*;
use crate::errors::*;
use near_sdk::near_bindgen;
use near_sdk::AccountId;
use near_sdk::{env, log};


#[near_bindgen]
impl VerificationContract {

    /// Registers the new request in the blockchain, but does not yet
    /// assign the validators to verify it.
    pub fn request_verification(
        &mut self,
        uid: RequestId,
        is_type: VerificationType,
        subject_id: SubjectId,
        payload: String,
    ) -> VerificationRequest {
        // MUST use the signer_account_id, see: 
        let caller_account_id = env::signer_account_id();
        log!("\nrequest_verification: Called with ({:?}, {:?}, {:?}, {:?}, {:?})",
            caller_account_id,  uid, is_type, subject_id, payload);

        // check if 'uid' already exists
        assert!(self.verifications.get(&uid).is_none(),
            "{}", ERR_REQUEST_UID_ALREADY_EXIST);

        // check if 'subject_id' has pending verifications
        assert!(self.subjects.get(&subject_id).is_none(),
            "{}", ERR_SUBJECT_HAS_PENDING_VERIFICATION);

        // check if we have available requests 
        let spending = self.spendings.get(&caller_account_id);
        assert!(self.has_allowance(&spending), 
            "{}", ERR_AVAILABLE_REQUESTS_CONSUMED);

        let timing = TimeWindow {
            // calculate when we can process this request according to the type
            starts: "2022-03-28 00:00:00".to_string(),
            ends: "2022-03-31 15:00:00".to_string(),
        };

        // build the request using existent state
        let request = VerificationRequest {
            uid: uid.clone(),
            is_type: is_type.clone(),
            requestor_id: caller_account_id.clone(),
            subject_id: subject_id.clone(),
            info: payload.to_string(),
            when: timing.clone(),
            state: VerificationState::Pending,
            validations: Vec::new(),
            payed: false,
        };

        // now we can update Contract state
        self.verifications.insert(&uid, &request);
        self.subjects.insert(&subject_id, &uid);
        self.update_allowance(&caller_account_id, &spending);
        log!("request_verification: Added {:?}", &request);

        // return the full Verification obj
        request.clone()
    }


    /// Cancels an existent verification
    fn cancel_verification(
        &mut self,
        uid: RequestId,
        cause: String
    ) {
        // MUST use the signer_account_id, see: 
        let signer_id = env::signer_account_id();
        log!("\ncancel_verification: Called with ({:?}, {:?}, {:?})",
            signer_id, uid, cause);

        // remove it and check if 'uid' already existed
        let removed = self.verifications.remove(&uid);
        assert!(removed.is_some(), 
            "{}", ERR_REQUEST_UID_DOES_NOT_EXIST);

        // we must also cleanup all pending assignments
        let rq = removed.unwrap();
        for task in rq.validations.iter() {
            println!("Got {:?}", task);
            self.remove_task_from_assignments(uid.clone(), &task);
        }
    }
      
      
    // Check if we have enought allowed requests for this account
    // and return true if we do, false otherwise
    fn has_allowance(
        &mut self,
        spending: &Option<Spending>,
    ) -> bool {
        match spending {
            Some(available) => {
              log!("has_allowance: Available free={} used={}", available.free, available.consumed); 
              return available.free > available.consumed
            },
            None => return true,
        }
    }

    // Update the consumed and available allowance of this account
    fn update_allowance(
        &mut self,
        account_id: &AccountId,
        allowance: &Option<Spending>,
    ) {
        let renewed: Spending = match allowance {
            Some(available) => Spending {
                from: available.from.clone(),
                to: available.to.clone(),
                free: available.free,
                consumed: available.consumed + 1,
            },
            None => Spending {
                from: "2022-06-16".to_string(),
                to: "2022-06-16".to_string(),
                free: self.params.allowed_monthly_requests.clone(),
                consumed: 1,
            },
        };
        self.spendings.insert(account_id, &renewed);
    }

    // Removes this task from the list of validator assignments
    fn remove_task_from_assignments(
        &mut self,
        request_uid: RequestId,
        task: &ValidationTask
    ) {
        let validator_id = &task.validator_id;
        let assigned = self.assignments.get(&validator_id).unwrap();
        let remaining: Vec<RequestId> = Vec::new();
        log!("assigned={:?}", assigned);
        for assigned_uid in assigned.iter() {
            log!("assigned_uid={:?}", assigned_uid);
            // if request_uid != assigned_uid {
            //     remaining.push(assigned_uid)
            // }
        } 
        self.assignments.insert(&validator_id, &remaining);
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
    fn test_insert_request() {
        setup_test("maz.testnet");
        let mut contract = VerificationContract::new();
        
        //log!("\nFirst request inserted => OK");
        let request_uid = "1234".to_string();
        let subject_id = "AR_DNI_12488353".to_string();
        let payload = "Some simulated encrypted payload".to_string();
        let ret = contract.request_verification(
            request_uid.clone(),
            VerificationType::ProofOfLife,
            subject_id.clone(),
            payload.clone(),
        );
        let rq = contract.verifications.get(&request_uid.to_string()).unwrap();
        assert_eq!(rq.requestor_id, env::signer_account_id());
        assert_eq!(rq.subject_id, subject_id);
        assert_eq!(rq.uid, ret.uid);
        assert_eq!(rq.validations.len(), 0);
        assert_eq!(contract.verifications.len(), 1);
        assert_eq!(contract.assignments.len(), 0);
    }

    #[test]
    fn test_cancel_request() {
        setup_test("maz.testnet");
        let mut contract = VerificationContract::new();
        let request_uid = "1234".to_string();
        let subject_id = "AR_DNI_12488353".to_string();
        let payload = "Some simulated encrypted payload".to_string();
        // insert it first
        let ret = contract.request_verification(
            request_uid.clone(),
            VerificationType::ProofOfLife,
            subject_id.clone(),
            payload.clone(),
        );
        // now remove it
        contract.cancel_verification(
            request_uid.clone(), "Just testing".to_string()
        );
        assert_eq!(contract.verifications.len(), 0);
    }

    #[test]
    #[should_panic]
    fn test_duplicate_request_uid() {
        // Set up the testing context and unit test environment
        let requestor = AccountId::new_unchecked("maz.testnet".to_string());
        let context = get_context(requestor);
        testing_env!(context.build());
        let mut contract = VerificationContract::new();
        
        //log!("\nSecond request has duplicate UID => PANIC");
        let request_uid = "1234".to_string();
        let subject_id = "AR_DNI_12488353".to_string();
        let payload = "Some simulated encrypted payload".to_string();
        let ret = contract.request_verification(
            request_uid.clone(),
            VerificationType::ProofOfLife,
            subject_id.clone(),
            payload.clone(),
        );

        let request_uid = "1234".to_string();
        let ret = contract.request_verification(
          request_uid.clone(),
          VerificationType::ProofOfLife,
          subject_id.clone(),
          payload.clone(),
        );
    }

    #[test]
    #[should_panic]
    fn test_subject_request_pending() {
        // Set up the testing context and unit test environment
        let requestor = AccountId::new_unchecked("maz.testnet".to_string());
        let context = get_context(requestor);
        testing_env!(context.build());
        let mut contract = VerificationContract::new();
        
        //log!("\nSecond request has subject Pending => PANIC");
        let request_uid = "1234".to_string();
        let subject_id = "AR_DNI_12488353".to_string();
        let payload = "Some simulated encrypted payload".to_string();
        let ret = contract.request_verification(
            request_uid.clone(),
            VerificationType::ProofOfLife,
            subject_id.clone(),
            payload.clone(),
        );

        let request_uid = "123456".to_string();
        let subject_id = "AR_DNI_12488353".to_string();
        let ret = contract.request_verification(
          request_uid.clone(),
          VerificationType::ProofOfLife,
          subject_id.clone(),
          payload.clone(),
        );
    }

    #[test]
    #[should_panic]
    fn test_all_requests_consumed() {
        // Set up the testing context and unit test environment
        let requestor = AccountId::new_unchecked("maz.testnet".to_string());
        let context = get_context(requestor);
        testing_env!(context.build());
        let mut contract = VerificationContract::new();
        
        //log!("\nThird request has all consumed => PANIC");
        let request_uid = "1234".to_string();
        let subject_id = "AR_DNI_12488353".to_string();
        let payload = "Some simulated encrypted payload".to_string();
        let ret = contract.request_verification(
            request_uid.clone(),
            VerificationType::ProofOfLife,
            subject_id.clone(),
            payload.clone(),
        );

        let request_uid = "12345".to_string();
        let subject_id = "AR_DNI_124883536".to_string();
        let ret = contract.request_verification(
          request_uid.clone(),
          VerificationType::ProofOfLife,
          subject_id.clone(),
          payload.clone(),
        );

        let request_uid = "123456".to_string();
        let subject_id = "AR_DNI_1248835367".to_string();
        let ret = contract.request_verification(
          request_uid.clone(),
          VerificationType::ProofOfLife,
          subject_id.clone(),
          payload.clone(),
        );
    }
}
