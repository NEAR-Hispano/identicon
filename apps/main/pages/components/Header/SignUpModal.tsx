import { useDisclosure } from "@chakra-ui/hooks";
import { useFormik } from "formik";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Flex,
  Center,
} from "@chakra-ui/react";
import React from "react";
import signUpSchemaValidation from "../../../validation/signUpSchemaValidation";
import { OTPData } from "../../../models/accounts";

const SignUpModal = (props: {
  onSignUp: any;
  isOpen: boolean;
  onOpen: any;
  onClose: any;
}) => {
  const { onSignUp, isOpen, onOpen, onClose } = props;

  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const initialValuesSignUp: OTPData = {
    email: "",
  };
  const form = useFormik({
    initialValues: initialValuesSignUp,
    validationSchema: signUpSchemaValidation,
    validateOnMount: true,
    enableReinitialize: true,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values: any) => {
      console.log("calling submit");
      const result = await onSignUp(values);
      console.log("sign up result:", result);
    },
  });

  return (
    <Modal
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create your account</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Center>
              <Input
                ref={initialRef}
                id="email"
                name="email"
                placeholder="my@email.com"
                value={form.values.email}
                onPaste={form.handleChange}
                onBlur={form.handleBlur}
                onChange={form.handleChange}
              />
            </Center>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={(e: any) => form.handleSubmit(e)}
          >
            Enviar
          </Button>
          <Button onClick={onClose}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SignUpModal;
