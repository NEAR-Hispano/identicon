import moment from "moment";
import * as Yup from "yup";
import { parse, isDate } from "date-fns";

function parseDateString(value: any, originalValue:any) {
  const parsedDate = isDate(originalValue)
    ? originalValue
    : parse(originalValue, "yyyy-MM-dd", new Date());

  return parsedDate;
}
function formatDate(date: string) {
  return new Date(date).toLocaleDateString()
}
Yup.setLocale({
  date: {
    max:  "Debe ser mayor de 18 años"
  }    
});
const today = new Date();
const schemaValidation = Yup.object().shape({
  full_name: Yup.string().required(),
  birthday: Yup
  .date()
  .required('Fecha de nacimiento es requerido')

  .max(moment().subtract(18, 'years').toDate()),
  dni:Yup.number().required(),
  email: Yup.string().email('Formato de email invalido'),
  phone: Yup.number().nullable()
});

export default schemaValidation;
