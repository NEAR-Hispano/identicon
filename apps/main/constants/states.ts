
const VerificationStates = [
  'Unassigned','Pending', 'Approved', 'Rejected', 
  'NotPossible', 'WillNotDo','Canceled'
];

const isVerificationPending = (st) => {
  return ['Unassigned','Pending'].includes(st);
}

const isVerificationDone = (st) => {
  return [
    'Approved', 'Rejected', 'NotPossible', 'WillNotDo', 'Canceled'
  ].includes(st);
}

const VerificationStateDescriptions = {
  'Unassigned': 'Todavía no te han asignado validadores',
  'Pending': 'Ya tienes validadores asignados, espera que te contacten',
};

const stateDescription = (st) => {
  return VerificationStateDescriptions[st] || 'Sin descripcion';
};

export {
  VerificationStates,
  isVerificationPending,
  isVerificationDone,
  stateDescription
};