const VerificationTypes = [
  "ProofOfLife",
  "ProofOfIdentity",
  "ProofOfExistence",
  "ProofOfState",
  "ProofOfOwnership",
  "ProofOfService",
];

const VerificationStates = [
  "Unassigned",
  "Pending",
  "Approved",
  "Rejected",
  "NotPossible",
  "WillNotDo",
  "Canceled",
];

const isVerificationPending = (st) => {
  return ["Unassigned", "Pending"].includes(st);
};

const isVerificationDone = (st) => {
  return [
    "Approved",
    "Rejected",
    "NotPossible",
    "WillNotDo",
    "Canceled",
  ].includes(st);
};

const isVerificationApproved = (st) => {
  return st === "Approved";
};

const initialVerificationState = "Pending";

const ValidationTypes = ["Remote", "Onsite", "Review"];
const defaultValidationType = "Remote";

const TaskStates = ["P", "F", "X"];
const initialTaskState = "P";
const finalTaskState = "F";

module.exports = {
  VerificationTypes,
  VerificationStates,
  isVerificationPending,
  isVerificationDone,
  isVerificationApproved,
  ValidationTypes,
  defaultValidationType,
  initialVerificationState,
  TaskStates,
  initialTaskState,
  finalTaskState,
};
