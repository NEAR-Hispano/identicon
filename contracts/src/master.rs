use crate::definitions::*;
use crate::errors::*;
use near_sdk::near_bindgen;
use near_sdk::{env, log};
use rand::{thread_rng, Rng};

#[near_bindgen]
impl VerificationContract {

    /// Registers the new request in the blockchain, but does not yet
    /// assign the validators to verify it.
    pub fn assign_validators(
        &mut self,
        uid: RequestId,
        validators_set: Vec<String>
    ) {
        // MUST use the signer_account_id, see: 
        let contract_account_id = env::current_account_id();
        let signer_account_id = env::signer_account_id();
        log!("\nassign_validators: Called with ({:?}, {:?}, {:?}, {:?})",
            contract_account_id, signer_account_id, uid, validators_set);

        // check if 'identicon.testnet' is signing account
        assert!(signer_account_id.to_string() == "identicon.testnet".to_string(),
            "{}", ERR_ONLY_MASTER_CAN_CALL_THIS);

        // check if 'uid' already exists
        let request = self.verifications.get(&uid);
        assert!(request.is_some(),
            "{}", ERR_REQUEST_UID_DOES_NOT_EXIST);

        // Select random validators from validators vec
        let selected: Vec<ValidatorId> = self.select_random(
            &validators_set, self.params.min_validators_needed as usize);
        assert!(selected.len() == self.params.min_validators_needed as usize,
            "{}", "Failed assigning MIN validators");

        // Finally update state
        self.update_assignments(uid.to_string(), &selected);
        self.build_tasks(uid.to_string(), &selected);
    }

    // Select a number of validator Ids from the set of allowed validators
    fn select_random(
        &mut self, 
        the_set: &Vec<String>,
        number: usize
    ) -> Vec<ValidatorId> {
        // create a vector of randomly selected items from the_set
        let mut v: Vec<String> = Vec::new();
        let mut rng = thread_rng();
        for j in 0..number {
            let index: usize = rng.gen_range(0..the_set.len());
            v.push(the_set[index].to_string());
        }    
        log!("Random selected={:?}", v);

        // now filter them so we can assure they are all included 
        // in the registred validators array
        let mut ret: Vec<ValidatorId> = Vec::new();
        for validator in self.validators.iter() {
            for j in 0..number {
                if validator.id.to_string() == v[j] {
                   ret.push(validator.id.clone()); 
                }
            }
        }
        ret
    }

    // Rebuild the assignments of a given validator
    fn update_assignments(
        &mut self,
        uid: RequestId,
        selected: &Vec<ValidatorId>
    ) {
        for validator_id in selected {
            let assigned = self.assignments.get(&validator_id);
            match assigned {
                Some(mut items) => {
                    items.push(uid.to_string());
                    self.assignments.insert(&validator_id, &items);
                }
                None => {
                    let first: Vec<RequestId> = vec![uid.to_string()];
                    self.assignments.insert(&validator_id, &first);
                }
            }
        }
    }

    // Builds the array of ValidationTasks
    fn build_tasks(
        &mut self,
        uid: RequestId,
        selected: &Vec<ValidatorId>
    ) {
        let mut tasks: Vec<ValidationTask> = Vec::new();
        for validator_id in selected {
            let task = ValidationTask {
                validator_id: validator_id.clone(),
                is_type: ValidationType::Remote, //	RESERVED for future use.
                result: VerificationState::Pending,
                timestamp: "".to_string(),
                contents: Vec::new(),
                remarks: "".to_string()
            };
            tasks.push(task);
        }
        
        let mut rq = self.verifications.get(&uid).unwrap();
        rq.validations = tasks;
        self.verifications.insert(&uid, &rq);
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
    fn test_assign_validators() {
        setup_test("mazrq.testnet");
        let mut contract = VerificationContract::new();
        let request_uid = "ABCD1234";
        let subject_id = "AR_DNI_12488353".to_string();
        let payload = "Some simulated encrypted payload".to_string();
        let ret = contract.request_verification(
            request_uid.to_string(),
            VerificationType::ProofOfLife,
            subject_id.clone(),
            payload.clone(),
        );
        assert_eq!(contract.verifications.len(), 1);

        // create some validators 
        setup_test("val1.identicon.testnet");
        contract.register_as_validator(vec![ValidationType::Remote, ValidationType::Review]);
        setup_test("val2.identicon.testnet");
        contract.register_as_validator(vec![ValidationType::Remote, ValidationType::Review]);
        setup_test("val3.identicon.testnet");
        contract.register_as_validator(vec![ValidationType::Remote, ValidationType::Review]);
        setup_test("val4.identicon.testnet");
        contract.register_as_validator(vec![ValidationType::Remote, ValidationType::Review]);
        setup_test("val5.identicon.testnet");
        contract.register_as_validator(vec![ValidationType::Remote, ValidationType::Review]);
        setup_test("val6.identicon.testnet");
        contract.register_as_validator(vec![ValidationType::Remote, ValidationType::Review]);
        setup_test("val7.identicon.testnet");
        contract.register_as_validator(vec![ValidationType::Remote, ValidationType::Review]);
        setup_test("val8.identicon.testnet");
        contract.register_as_validator(vec![ValidationType::Remote, ValidationType::Review]);
        assert_eq!(contract.validators.len(), 8);

        //now assign two random validators
        setup_test("identicon.testnet");
        contract.assign_validators(request_uid.to_string(), vec![
            "val1.identicon.testnet".to_string(), "val2.identicon.testnet".to_string(),
            "val3.identicon.testnet".to_string(), "val4.identicon.testnet".to_string(),
            "val5.identicon.testnet".to_string(), "val6.identicon.testnet".to_string(),
            "val7.identicon.testnet".to_string(), "val8.identicon.testnet".to_string()
        ]);            

        let rq = contract.verifications.get(&request_uid.to_string()).unwrap();
        assert_eq!(rq.validations.len(), 2);
        assert_eq!(contract.assignments.len(), 2);
    }
}
