# The Identicon Protocol contracts

This folder contains the Rust contracts needed to operate the verification service in the NEAR Blockchain.

## Previous work

`9-May 2022`: It has been improved by applying NEAR best practices as detailed in: [NEAR SDK - Best practices](https://www.near-sdk.io/best-practices) but is still a simplified implementation, for the sole purpose of completing the required course tasks for the *NEAR CERTIFIED ARCHITECT 09-05-2022 bootcamp (NCAR)*. 

`28-Mar 2022`: This is a naive and incomplete implementation of some methods of the Verification Contract, produced by the Team#10 (Juan Mescher & Mario Zito) of the *NEAR CERTIFIED DEVELOPER 28-03-2022 course*, and for the sole purpose of completing the required course tasks.

**Conventions**

- All code documentation will use English as it is a globally used standard convention.

- BUT **personal ACTIVIY, CHANGELOG and commit messages** will be written in Spanish, following the requirements of the **NEAR Hispano course guides**, and to be useful for other future particpants whoy may review this project.

## Structures

~~~rust

// The Subject government identification as a string formed 
// using "{country}_{type}_{number}", ex: 'ar_dni_12488353'
// compatible with [NEAR DID](https://github.com/ontology-tech/DID-spec-near/blob/master/NEAR/DID-Method-NEAR.md)
// so we can have a NEAR DID like "did:near:ar_dni_12488353.near" 
type SubjectId = String;  

// A NEAR account ID, ex: 'juanmescher.near'
type ValidatorId = String; 

// A DateTime in ISO format 'AAAA-MM-DD hh:mm:ss', ex: '2022-03-27 00:00:00'
type ISODateTime = String; 

// The location coordinates as obtained from GoogleMaps/other
struct GPSCoordinates {
  long: u64,
  lat: u64
}

// A naive implementation for the Subject Contact info
struct ContactInfo {
  phones: String,
  email: String,
}

// A naive implementation for the subject Address location
struct Location {
  directions: String, // ex: 'Calle Las Lomitas Nro. 23 e/ Pampa y La Via'
  city: String,
  province: String,
  country: String, // ex 'mx', 'ar', 've', 'bo', cl', 'uy', ...
  coordinates: GPSCoordinates
}

// The Time Window in which the verification must be performed
struct TimeWindow {
  starts: ISODateTime,
  ends: ISODateTime
}

// All the relevant Subject information
struct SubjectInfo {
  age: u8,
  sex: String,
  contact: ContactInfo,
  address: LocationInfo,
}

// The different verification services 
enum VerificationType {
  /// Validates that the Subject is alive, and lives in the indicated Location.
  /// It also implies a ProofOfIdentity. This is a recurrent validation, 
  // meaning it must be repeated every month.
  ProofOfLife,
  
  /// Validates that the Subject is who he says he is, and that is (obviously) alive.
  ProofOfIdentity,

  // Not implemented, reserved for future use
  ProofOfExistence { asset: String },
  ProofOfState { asset: String },
  ProofOfOwnership { asset: String },
  ProofOfService { service: String },
}

enum VerificationState {
  /// Started but waiting for the validator results  
  Pending, // code: P

  /// Verification result is approved
  Approved, // code: AP

  /// Verification result is Rejected
  Rejected { why: String }, // code: RX

  /// It is not possible to do the verification, due to some reason which exceeds 
  /// the Validator possibilites, such as inaccesible area, weather, etc
  NotPossible { why: String }, // code: NP

  /// Validator will not do the verification, for some personal reason,
  /// but it requires a cause and explanation. Too many of this refusals 
  /// may eliminate the Validator from the validators pool.
  WillNotDo { why: String } // code: WND
  
  /// Verification was canceled by Requestor
  Canceled { why: String } // code: CX
}

// The min and max required validators to verify a given request
// it may vary randomly between MIN and MAX
const MIN_VALIDATORS = 3;
const MAX_VALIDATORS = 4;

struct VerificationResult {
  validator_id: ValidatorId,
  result: VerificationState,
  timestamp: ISODateTime,
}

struct VerificationRequest {
  // the verification service required, which may include additional info
  // for some types such as ProofOfOwnership(asset) or ProofOfService(service).
  is_type: VerificationType,
  
  // this is the account who requested the verification and will pay for it,
  // and is NOT the same as the subject to be verified.
  requestor_id: AccountId,
  
  // this is the subject to be verified, which is ALLWAYS a real human being,
  // cats, dogs and other pets may be considered in the future :-)
  subject_id: SubjectId,
  subject_info: SubjectInfo,
  when: TimeWindow,
  
  // the verification state of the whole request, as a result of the individual
  // verifications. If any of the individual verifications is Rejected, then the
  // whole verification is Rejected.
  state: VerificationState, 
  
  // the array [MIN_VALIDATORS..MAX_VALIDATORS] of individual validator verifications  
  results: Vec<VerificationResult> 
}

pub struct VerificationContract {
  // the pending verifications as a iterable Map keyed by SubjectId
  verifications: UnorderedMap<SubjectId, VerificationRequest>,
  
  // the assigned validations, as a Map keyed by ValidatorId
  // the value is a (variable) list of the SubjectIds to verify
  assignments: UnorderedMap<ValidatorId, Vec<SubjectId>>,
  
  // the Pool of validators, as an array of ValidatorIds
  validators: Vec<ValidatorId>,
}

~~~

## Methods

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

