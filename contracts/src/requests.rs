use crate::definitions::*;
use near_sdk::near_bindgen;
use near_sdk::{env, log};
use near_sdk::AccountId;
use serde_json::json;

#[near_bindgen]
impl VerificationContract {
    // Registers the new request in the blockchain, but does not yet
    // assigns validators to verify it.
    pub fn request_verification(
        &mut self,
        uid: RequestId,
        is_type: VerificationType,
        subject_id: SubjectId,
        payload: String,
    ) -> VerificationRequest {
        log!(
            "request_verification: Called with ({:?}, {:?}, {:?}, {:?}, {:?})",
            env::predecessor_account_id(),
            uid,
            is_type,
            subject_id,
            payload
        );

        // check if 'uid' already exists
        assert!(
            !self.verifications.keys_as_vector().iter().any(|e| e == uid),
            "request_verification: Verification already exists for UID"
        );

        // check if 'subject_id' has pending varifications
        assert!(
            !self
                .subjects
                .keys_as_vector()
                .iter()
                .any(|e| e == subject_id),
            "request_verification: Pending verification for subject_id"
        );

        // calculate when we can process this request according to the type
        let mut timing = TimeWindow {
            starts: "2022-03-28 00:00:00".to_string(),
            ends: "2022-03-31 15:00:00".to_string(),
        };

        let caller_account_id = env::predecessor_account_id();

        let mut request = VerificationRequest {
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

        let expense = Spending {
          from: "2022-06-16".to_string(),
          to: "2022-06-16".to_string(),
          free: self.params.allowed_monthly_requests.clone(),
          consumed: 0,
        };

        if self.has_allowance(&caller_account_id) {
          self.spendings.insert(&caller_account_id, &expense);
        }

        // add this request to the verifications to do
        self.verifications.insert(&uid, &request);
        self.subjects.insert(&subject_id, &uid);
        log!("request_verification: Added {:?}", &request);
        
        // return the full Verification obj
        request.clone()
    }


    // Checks if we have enought allowed requests for this account
    fn has_allowance(
      &mut self, 
      account_id: &AccountId
    ) -> bool {
      let expenses = self.spendings.get(&account_id);
      match expenses {
        None => return true,
        Some(expense) => return { expense.free > expense.consumed }
      }
    }
}
