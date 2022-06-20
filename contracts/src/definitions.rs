use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::UnorderedMap;
use near_sdk::near_bindgen;
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::AccountId;
use near_sdk::PanicOnDefault;

// The Subject government identification as a string formed
// using 'type'+'number'+'country', ex: 'dni:12488353:ar'
pub type SubjectId = String;

// The NEAR account who requests the verification
pub type RequestorId = String;

// A NEAR account ID, ex: 'validator1.identicon.near'
pub type ValidatorId = AccountId;

// The request UUID, given by the App or GW.
pub type RequestId = String;

// A DateTime in ISO format 'AAAA-MM-DD hh:mm:ss', ex: '2022-03-27 00:00:00'
pub type ISODateTime = String;
pub type ISODate = String;

// A Unique ID key (IPFS content-hash) for files stored in Web3.storage or equivalent
pub type FileId = String;

// The Time Window in which the verification must be performed
#[derive(BorshDeserialize, BorshSerialize, Deserialize, Serialize, Debug, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct TimeWindow {
    pub starts: ISODateTime,
    pub ends: ISODateTime,
}

// Relevant request information, but fully encripted. It will usually be an
// encripted JSON object, whose contents will dependen on the VerificationType.
type RequestInfo = String;

// The different verification services
#[derive(BorshDeserialize, BorshSerialize, Deserialize, Serialize, Debug, Clone)]
#[serde(crate = "near_sdk::serde")]
pub enum VerificationType {
    /// Validates that the Subject is alive, and lives in the indicated Location.
    /// It also implies a ProofOfIdentity. This is a recurrent validation,
    // meaning it must be repeated every month.
    ProofOfLife,

    /// Validates that the Subject is who he says he is, and that is (obviously) alive.
    ProofOfIdentity,

    // Not implemented, reserved for future use
    ProofOfExistence,
    ProofOfState,
    ProofOfOwnership,
    ProofOfService,
}

#[derive(BorshDeserialize, BorshSerialize, Deserialize, Serialize, Debug, PartialEq, Clone)]
#[serde(crate = "near_sdk::serde")]
pub enum VerificationState {
    /// Started but waiting for the validator results  
    Pending, // code: P

    /// Verification result is approved
    Approved, // code: AP

    /// Verification result is Rejected
    Rejected, // code: RX

    /// It is not possible to do the verification, due to some reason which exceeds
    /// the Validator possibilites, such as inaccesible area, weather, etc
    NotPossible(String), // code: NP

    /// Validator will not do the verification, for some personal reason,
    /// but it requires a cause and explanation. Too many of this refusals
    /// may eliminate the Validator from the validators pool.
    WillNotDo(String), // code: WND

    /// Verification was canceled by Requestor
    Canceled(String), // code: CX
}

// The different validation task types which may perform a validator.
#[derive(BorshDeserialize, BorshSerialize, Deserialize, Serialize, Debug, Clone)]
#[serde(crate = "near_sdk::serde")]
pub enum ValidationType {
    /// Remote validation performed using a video chat or similar.
    Remote,

    /// Onsite validation performed visiting the subject location.
    Onsite,

    /// Revision done by and auditor reviewing work performed by other validators.
    Review,
}

// Describes a given Validator person
#[derive(BorshDeserialize, BorshSerialize, Debug, Clone)]
pub struct Validator {
  pub id: ValidatorId,

  // The different types of validation this Validator can perform
  pub can_do: Vec<ValidationType>,

  // reserved for future use
  pub status: String, 
  pub reputation: u8,
}


// This struct describes the state and result reported by a given validator.
// When he/she has not yet performed the validation it describes the assigned task.
#[derive(BorshDeserialize, BorshSerialize, Debug, Clone)]
pub struct ValidationTask {
    //	The validator account assigned to perform this validation.
    pub validator_id: ValidatorId,

    pub is_type: ValidationType, //	RESERVED for future use.

    // The result state. It may be in differente states, depending on the validator actions.
    pub result: VerificationState,

    // The timestamp when the validation was performed, or an empty timestamp otherwise.
    pub timestamp: ISODateTime,

    // An array of ContentIDs (photos and videos) attesting the work done.
    pub contents: Vec<FileId>,
    
    // Notes and remarks regarding the validation result
    pub remarks: String,
}


#[derive(BorshDeserialize, BorshSerialize, Debug, Clone)]
pub struct VerificationRequest {
    pub uid: RequestId,

    // the verification service required, which may include additional info
    // for some types such as ProofOfOwnership(asset) or ProofOfService(service).
    pub is_type: VerificationType,

    // this is the account who requested the verification and will pay for it,
    // and is NOT the same as the subject to be verified.
    pub requestor_id: AccountId,

    // this is the subject to be verified, which is ALLWAYS a real human being,
    // cats, dogs and other pets may be considered in the future :-)
    pub subject_id: SubjectId,
    pub info: RequestInfo,
    pub when: TimeWindow,

    // the verification state of the whole request, as a result of the individual
    // verifications. If any of the individual verifications is Rejected, then the
    // whole verification is Rejected.
    pub state: VerificationState,

    // the array [MIN_VALIDATORS..MAX_VALIDATORS] of individual validation
    pub validations: Vec<ValidationTask>,

    // validators where payed
    pub payed: bool,
}

// This struct describes the spending allowed and used in a given time period
// for a given requester. At the start of each time period (each month),
// depending on the requester type (RQ, VL or XA) we assign a free quota to
// each requester. Every time he/she makes a request we discount it from
// his/her free quota. When no more free quota is available, the requester
// account must be funded to continue using the service.
#[derive(BorshDeserialize, BorshSerialize, Debug)]
pub struct Spending {
    // Starting and ending date for the period, ex: '2022-01-06'.
    pub from: ISODate,
    pub to: ISODate,

    //	Quantity of free requests this account can do in the given time period.
    pub free: u16,

    // Quantity of requests this account did in the given time period.
    pub consumed: u16,
}

// A set of params modulating how the Contract must work
#[derive(BorshDeserialize, BorshSerialize, Debug, Clone)]
pub struct Parameters {
    // min validators required to verify a given request
    pub min_validators_needed: u8, // = 2,

    // the max reviewers needed: may vary randomly between 0 and this param
    pub max_reviewers_needed: u8, // = 1,

    // fee to be paid to validator when task is completed, in USD (stable coin)
    pub remote_validation_fee: f32, // = 1.0,
    pub onsite_validation_fee: f32, // = 1.0,
    pub review_validation_fee: f32, // = 1.0,

    // allowed requests per month according to requester type
    pub allowed_monthly_requests: u16, // = 2,
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault, Debug)]
pub struct VerificationContract {
    // the pending verifications as an iterable Map keyed by RequestId. When
    // a verification is completed, it must be removed. The value is the
    // VerificationRequest to be performed.
    pub verifications: UnorderedMap<RequestId, VerificationRequest>,

    // The pending verifications as an iterable Map but keyed by SubjectId, so
    // we avoid traversing the verifications Map to find if a given subject has
    // pending requests. The value is the pending RequestId.
    pub subjects: UnorderedMap<SubjectId, RequestId>,

    // the assigned validations, as an iterable Map keyed by ValidatorId. The
    // value is a (variable) array of the RequestIds to be verified
    // by this validator.
    pub assignments: UnorderedMap<ValidatorId, Vec<RequestId>>,

    // the Pool of validators, as an array of ValidatorIds
    pub validators: Vec<Validator>,

    // the spending as an iterable Map keyed by AccountId. The value is the
    // free and used requests quota of this particular account.
    pub spendings: UnorderedMap<AccountId, Spending>,

    // the set of params modulating contract behaviour, may be changed
    // by and IdenticonDAO request.
    pub params: Parameters,
}
