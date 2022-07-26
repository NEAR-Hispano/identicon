const VerificationTypes = [
  'ProofOfLife', 'ProofOfIdentity', 'ProofOfExistence', 'ProofOfState', 
  'ProofOfOwnership', 'ProofOfService'
];

const VerificationStates = [
  'Unassigned','Pending', 'Approved', 'Rejected', 
  'NotPossible', 'WillNotDo','Canceled'
];

const isVerificationPending = (st) => {
  return ['Unassigned','Pending'].includes(st);
};

const isVerificationDone = (st) => {
  return [
    'Approved', 'Rejected', 'NotPossible', 'WillNotDo', 'Canceled'
  ].includes(st);
};

const ValidationTypes = [
  'Remote','Onsite', 'Review'
];

module.exports = {
  VerificationTypes,
  VerificationStates,
  isVerificationPending,
  isVerificationDone,
  ValidationTypes
};
