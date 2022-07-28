
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
  'Unassigned': 'Todavía no te han asignado validadores.',
  'Pending': 'Pendiente. Ya tienes validadores asignados, espera que te contacten.',
  'Approved': '¡ Tu solicitud fue Aprobada !',
  'Rejected': 'Rechazada. Ver comentarios para entender porqué.', 
  'NotPossible': 'No es posible realizarla por causas ajenas al validador.', 
  'WillNotDo': 'Validador no realizará. Ver comentarios.', 
  'Canceled': 'Cancelada por el solicitante.'
};

const VerificationStateShortDescriptions = {
  'Unassigned': 'Pendiente',
  'Pending': 'Pendiente',
  'Approved': 'Aprobada',
  'Rejected': 'Rechazada', 
  'NotPossible': 'No es posible', 
  'WillNotDo': 'No se realizará', 
  'Canceled': 'Cancelada'
};

const stateDescription = (st) => {
  return VerificationStateDescriptions[st] || 'Sin descripcion';
};

const shortStateDescription = (st) => {
  return VerificationStateShortDescriptions[st] || 'Sin descripcion';
};

export {
  VerificationStates,
  isVerificationPending,
  isVerificationDone,
  stateDescription,
  shortStateDescription
};