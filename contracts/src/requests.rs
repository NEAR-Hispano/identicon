use crate::definitions::*;
use crate::errors::*;
use near_sdk::near_bindgen;
use near_sdk::AccountId;
use near_sdk::{env, log};


#[near_bindgen]
impl VerificationContract {
    pub fn request_verification(
        // Registers the new request in the blockchain, but does not yet
        // assign the validators to verify it.
        &mut self,
        uid: RequestId,
        is_type: VerificationType,
        subject_id: SubjectId,
        payload: String,
    ) -> ReturnStatus<VerificationRequest> {
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
            !self.subjects.keys_as_vector().iter().any(|e| e == subject_id),
            "request_verification: Pending verification for subject_id"
        );

        let caller_account_id = env::predecessor_account_id();
        let timing = TimeWindow {
            // calculate when we can process this request according to the type
            starts: "2022-03-28 00:00:00".to_string(),
            ends: "2022-03-31 15:00:00".to_string(),
        };

        // verify if we have available requests and set state accordingly
        let spending = self.spendings.get(&caller_account_id);
        if !self.has_allowance(&spending) {
          return ReturnStatus::WillNotDo(AVAILABLE_REQUESTS_CONSUMED.to_string())
        }

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
        ReturnStatus::Done(request.clone())
    }

    fn has_allowance(
        // Check if we have enought allowed requests for this account
        // and return true if we do, false otherwise
        &mut self,
        spending: &Option<Spending>,
    ) -> bool {
        match spending {
            Some(available) => return available.free <= available.consumed,
            None => return true,
        }
    }

    fn update_allowance(
        // Update the consumed and available allowance of this account
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
}
