import * as Yup from "yup";

const signUpSchemaValidation = Yup.object().shape({
  email: Yup.string().required('El email es requerido').email('Formato de email invalido'),
});

export default signUpSchemaValidation;
