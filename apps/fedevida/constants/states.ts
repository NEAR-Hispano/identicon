const VerificationStates = [
  "Unassigned",
  "Pending",
  "Approved",
  "Rejected",
  "NotPossible",
  "WillNotDo",
  "Canceled",
];

const isVerificationPending = (st: string) => {
  return ["Unassigned", "Pending"].includes(st);
};

const isVerificationDone = (st: string) => {
  return [
    "Approved",
    "Rejected",
    "NotPossible",
    "WillNotDo",
    "Canceled",
  ].includes(st);
};

const VerificationStateDescriptions = {
  Unassigned: "Todavía no te han asignado validadores.",
  Pending:
    "Pendiente. Ya tienes validadores asignados, espera que te contacten.",
  Approved: "La solicitud está Aprobada.",
  Rejected: "Rechazada. Ver comentarios para entender porqué.",
  NotPossible: "No es posible realizarla por causas ajenas al validador.",
  WillNotDo: "Validador no realizará. Ver comentarios.",
  Canceled: "Cancelada por el solicitante.",
};

const VerificationStateShortDescriptions = {
  Unassigned: "Pendiente",
  Pending: "Pendiente",
  Approved: "Aprobada",
  Rejected: "Rechazada",
  NotPossible: "No es posible",
  WillNotDo: "No se realizará",
  Canceled: "Cancelada",
};

const stateDescription = (st: string) => {
  let result = "Sin descripcion";
  Object.entries(VerificationStateDescriptions).find(([key, value]) => {
    if (key == st) {
      result = value;
      return true;
    }

    return false;
  });
  return result;
};

const shortStateDescription = (st: string) => {
  let result = "Sin descripcion";
  Object.entries(VerificationStateShortDescriptions).find(([key, value]) => {
    if (key == st) {
      result = value;
      return true;
    }

    return false;
  });
  return result;
};

export {
  VerificationStates,
  isVerificationPending,
  isVerificationDone,
  stateDescription,
  shortStateDescription,
};
