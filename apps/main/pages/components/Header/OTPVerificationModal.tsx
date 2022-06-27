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
  PinInputField,
} from "@chakra-ui/react";
import React, { useState } from "react";
import signUpSchemaValidation from "../../../validation/signUpSchemaValidation";
import { OTPData } from "../../../models/accounts";
import { useStore } from "../../../stores/authSession";
import { useRouter } from 'next/router'
const OtpModal = (props: {
  data: any;
  setisSignedIn: any;
  setSignInAccountId: any;
  onLogin: any;
  isOpen: boolean;
  onOpen: any;
  onClose: any;
}) => {
  const { data, setisSignedIn, setSignInAccountId, onLogin, isOpen, onOpen, onClose } = props;
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const [value, setValue] = useState("");
  const { session, setSession } = useStore();
  const router = useRouter()

  const handleChange = (value: string) => {
    setValue(value);
  };

  const handleComplete = async (value: string) => {
    console.log("session_key", data.session);
    const result = await onLogin({
      session_key: data.session,
      passcode: value,
    });
    console.log("login result", result);
    setSession(result)
    setisSignedIn(true)
    setSignInAccountId(result.id)
    onClose();
    router.push('/dashboard')
  };

  return (
    <Modal
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Enter the OTP</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl as="fieldset">
            <Center>
              <FormLabel>OTP</FormLabel>
              <PinInput
                otp
                value={value}
                onChange={handleChange}
                onComplete={handleComplete}
              >
                <PinInputField />
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
            onClick={(e: any) => handleComplete(e)}
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
