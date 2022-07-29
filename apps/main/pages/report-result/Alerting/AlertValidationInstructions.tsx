import React from "react";
import { Text, Box } from "@chakra-ui/react";
import { isVerificationPending } from "../../../constants/states";

const AlertValidationInstructions = (props: any) => {
  const { data } = props;
  if (data && isVerificationPending(data.result))
    return (
      <Box
        bg="yellow.50"
        mt={4}
        py={6}
        pr={8}
        pl={12}
        boxShadow="md"
        rounded="lg"
        lineHeight="1.rem"
      >
        <b>Por favor verifica qué:</b>
        <Text fontSize="sm">
          <ul>
            <li>
              Los datos del Documento de identidad coincidan con los informados
            </li>
            <li>
              La persona puede responder a tus preguntas en forma coherente
              <br /> y demuestra estar viva !
            </li>
            <li>
              Asegúrate que otra persona no la esté suplantando
              <br /> o haciendose pasar por ella
            </li>
            <li>Graba un pequeño video de tu conversación con ella</li>
            <li>Toma fotos de sus documentos (frente y dorso)</li>
          </ul>
        </Text>
      </Box>
    );
  return <></>;
};
export default AlertValidationInstructions;
