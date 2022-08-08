import * as Yup from "yup";

const signUpSchemaValidation = Yup.object().shape({
  email: Yup.string().email('Formato de email invalido'),
});

export default signUpSchemaValidation;
