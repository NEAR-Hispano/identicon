import React from "react";
import {
  Alert,
  AlertIcon,
  Text,
} from "@chakra-ui/react";
import {
  isVerificationPending
} from "../../../constants/states";

const AlertProtectData = (props: any) => {
  const { data } = props;
  if (data && isVerificationPending(data.result))
    return (
      <Alert status="warning" borderRadius="lg" mx="auto">
        <AlertIcon boxSize="32px" mr={4} />
        <Text fontSize="sm">
          Los siguiente son los datos de la persona que será verificada.
          <br />
          <b>
            Debes tratar estos datos respetando las leyes de Protección de Datos
            Personales y la confidencialidad de los mismos.
          </b>
        </Text>
      </Alert>
    );
  return <></>;
};

export default AlertProtectData;
