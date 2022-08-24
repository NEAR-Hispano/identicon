import moment from "moment";
import * as Yup from "yup";
import { parse, isDate } from "date-fns";

Yup.setLocale({
  date: {
    max: "Debe ser mayor de 18 años",
  },
});

const requestVerificationSchemaValidation = Yup.object().shape({
  full_name: Yup.string().required("Nombre completo es requerido"),
  birthday: Yup.date()
    .required("Fecha de nacimiento es requerido")

    .max(moment().subtract(18, "years").toDate()),
  dni: Yup.number().required("DNI es requerido"),
  email: Yup.string().email("Formato de email invalido"),
  phone: Yup.number().nullable(),
});

export default requestVerificationSchemaValidation;
