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
  Stack,
  Heading,
  useBreakpointValue,
  Box,
  useColorModeValue,
  Text,
  HStack,
} from "@chakra-ui/react";
import { Radio, RadioGroup } from '@chakra-ui/react';
import React, { useEffect } from "react";
import signUpSchemaValidation from "../../validation/signUpSchemaValidation";
import { OTPData } from "../../models/accounts";
import { useSignUp } from "../../hooks/sessions";

const SignUpModal = (props: {
  onSuccess: any;
  isOpen: boolean;
  onOpen: any;
  onClose: any;
}) => {
  const { onSuccess, isOpen, onOpen, onClose } = props;
  const {
    signUp,
    isSigningUp,
    isSignUpSuccess,
    signUpData,
    isSignUpError,
    signUpError,
  } = useSignUp();
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const initialValuesSignUp: OTPData = {
    email: "",
    type: "RQ",
  };
  const form = useFormik({
    initialValues: initialValuesSignUp,
    validationSchema: signUpSchemaValidation,
    validateOnMount: true,
    enableReinitialize: true,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values: any) => {
      // alert(JSON.stringify(values,null,2))
      signUp(values);
    },
  });

  useEffect(() => {
    if (isSignUpSuccess) {
      onSuccess(signUpData);
    }
  }, [isSignUpSuccess]);

  return (
    <Modal
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {" "}
          <Stack spacing={{ base: "2", md: "3" }} textAlign="center">
            <Heading size={useBreakpointValue({ base: "xs", md: "sm" })}>
              Crea tu cuenta
            </Heading>
          </Stack>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody pb={4}>
          <FormControl>
            <Stack>
              <FormLabel><b>Qué deseas hacer ?</b></FormLabel>
              <RadioGroup
                  id="type"
                  name="type"
                  // value={form.values.type} // si activo esto no anda !
                  defaultValue='RQ'
                  onPaste={form.handleChange}
                  onBlur={form.handleBlur}
                  onChange={form.handleChange}
                  >
                <Stack direction='column'>
                  <Radio value='RQ'>Solicitar la fé de vida para mí o mis familiares</Radio>
                  <Radio value='VL'>Actuar como validador</Radio>
                  <Radio 
                    value='XA'>Usar el servicio desde mis Apps</Radio>
                </Stack>
              </RadioGroup>
              {!!form.values.type &&
                !!form.touched.type &&
                !!form.errors.type && (
                  <p className="error-text"> {form.errors.type}</p>
                )}
            </Stack>
          </FormControl>

          <FormControl>
            <Stack>
              <br/>
              <FormLabel><b>Necesitamos tu Email</b></FormLabel>
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
              {!!form.values.email &&
                !!form.touched.email &&
                !!form.errors.email && (
                  <p className="error-text"> {form.errors.email}</p>
                )}
            </Stack>
            <Stack spacing="1" mt={4} justify="center">
              <Text fontSize="md" color="muted">
                A continuación te enviaremos un código
                numérico que deberás ingresar para completar el registro
              </Text>
            </Stack>
          </FormControl>

          {/* <Stack spacing="1" justify="center">
          
            <Button variant="link" colorScheme="blue">
              Sign up
            </Button>
          </Stack> */}
        </ModalBody>

        <ModalFooter>
          <Stack spacing="6">
            <HStack spacing="6">
              <Button onClick={onClose}>Cancelar</Button>
              <Button
                colorScheme="blue"
                mr={3}
                onClick={(e: any) => form.handleSubmit(e)}
              >
                Continuar con el email
              </Button>
            </HStack>
          </Stack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SignUpModal;
