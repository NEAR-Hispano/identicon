import * as Yup from "yup";

const signUpSchemaValidation = Yup.object().shape({
  email: Yup.string().email('Invalid email format'),
});

export default signUpSchemaValidation;
