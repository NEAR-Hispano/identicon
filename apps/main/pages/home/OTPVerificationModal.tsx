import { useDisclosure } from "@chakra-ui/hooks";
import { useFormik } from "formik";
import {
  Button,
  Center,
  Flex,
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
  PinInput,
  PinInputField
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import signUpSchemaValidation from "../../validation/signUpSchemaValidation";
import { OTPData } from "../../models/accounts";
import { useStore } from "../../stores/authSession";
import { useRouter } from "next/router";
import { useLogin } from "../../hooks/sessions";
const OtpModal = (props: {
  data: any;
  setisSignedIn: any;
  setSignInAccountId: any;
  isOpen: boolean;
  onOpen: any;
  onClose: any;
}) => {
  const { data, setisSignedIn, setSignInAccountId, isOpen, onOpen, onClose } =
    props;
  const { login, isLogginIn, isLoginSuccess, loginData, isLoginError } =
    useLogin();
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const [value, setValue] = useState("");
  const { session, setSession } = useStore();
  const router = useRouter();

  const handleChange = (value: string) => {
    setValue(value);
  };

  const handleComplete = async (value: string) => {
    const result = await login({
      session_key: data.session,
      passcode: value,
    });
  };

  useEffect(() => {
    if (isLoginSuccess) {
      setSession(loginData);
      setisSignedIn(true);
      setSignInAccountId(loginData.id);
      onClose();
      router.push("/dashboard");
    }
  }, [isLoginSuccess]);

  return (
    <Modal
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Verificación de password de un solo uso</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl as="fieldset">
            <Center>
              <FormLabel>
                Ingresa el código que te enviamos por correo
              </FormLabel>
            </Center>
            <Center>
              <PinInput
                otp
                value={value}
                onChange={handleChange}
                onComplete={handleComplete}
                placeholder=''
              >
                <PinInputField  />
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
              </PinInput>
            </Center>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={(e: any) => handleComplete(value)}
          >
            Enviar
          </Button>
          <Button onClick={onClose}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default OtpModal;
