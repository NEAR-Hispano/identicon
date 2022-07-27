use near_sdk::collections::UnorderedMap;
use near_sdk::log;
use near_sdk::{env, near_bindgen};

pub mod definitions;
use definitions::*;
mod errors;

pub mod requests;
pub mod validators;
pub mod master;
pub mod utils;
// mod payments;
// mod upgrades;


#[near_bindgen]
impl VerificationContract {
  #[init]
  pub fn new() -> Self {
    assert!(!env::state_exists(), "Already initialized");
    log!("\nnew VerificationContract: Initialized contract state");
    Self {
      verifications: UnorderedMap::new(b"a"),
      subjects: UnorderedMap::new(b"b"),
      assignments: UnorderedMap::new(b"c"),
      spendings: UnorderedMap::new(b"d"),
      validators: Vec::new(),
      params: Parameters {
          min_validators_needed: 2,
          min_consensus_needed: 2,
          max_reviewers_needed: 1,
          remote_validation_fee: 1.0,
          onsite_validation_fee: 1.0,
          review_validation_fee: 1.0,
          allowed_monthly_requests: 20, // changed for testing
      },
    }
  }
}
