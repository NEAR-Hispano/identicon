use crate::definitions::*;
use near_sdk::env;
//use near_sdk::serde_json;
//use near_sdk::{log, Gas, Promise, PromiseResult};

/*
 * the rest of this file sets up unit tests
 * to run these, the command will be:
 * cargo test --package identicon -- --nocapture
 * Note: 'identicon' comes from Cargo.toml's 'name' key
 */

// use the attribute below for unit tests
#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::test_utils::VMContextBuilder;
    use near_sdk::{testing_env, AccountId};

    // part of writing unit tests is setting up a mock context
    // provide a `predecessor` here, it'll modify the default context
    #[allow(dead_code)]
    fn get_context(predecessor: AccountId) -> VMContextBuilder {
        let mut builder = VMContextBuilder::new();
        builder.predecessor_account_id(predecessor);
        builder
    }

    #[test]
    fn test_request_verification() {
        // Set up the testing context and unit test environment
        let requestor = AccountId::new_unchecked("maz.testnet".to_string());
        let context = get_context(requestor);
        testing_env!(context.build());

        let request_uid = "1234".to_string();
        let subject_id = "AR_DNI_12488353".to_string();
        let payload = "Some simulated encrypted payload".to_string();

        let mut contract = VerificationContract::new();
        let requested: VerificationRequest = contract.request_verification(
            request_uid.clone(),
            VerificationType::ProofOfLife,
            subject_id.clone(),
            payload.clone(),
        );

        let rq = contract
            .verifications
            .get(&request_uid.to_string())
            .unwrap();
        assert_eq!(rq.requestor_id, env::predecessor_account_id());
        assert_eq!(rq.subject_id, subject_id);
        assert_eq!(rq.uid, request_uid);
        assert_eq!(rq.validations.len(), 0);
        assert_eq!(contract.verifications.len(), 1);
        assert_eq!(contract.assignments.len(), 0);
    }
}
