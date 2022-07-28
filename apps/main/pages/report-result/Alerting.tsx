import React, { useEffect } from "react";
import { Alert, AlertIcon,
  IconButton, useToast, Container, Spacer, Flex, 
  Text, Box } from "@chakra-ui/react";
import { StatusNotice } from '../../components/Notice';
import { isVerificationPending, isVerificationDone } from "../../constants/states";


export const AlertProtectData = (props) => {
  const { data } = props;
  if (data && isVerificationPending(data.result)) return (
    <Alert status='warning' borderRadius="lg" mx="auto">
      <AlertIcon  boxSize='32px' mr={4}/>
      <Text fontSize="sm">
        Los siguiente son los datos de la persona que será verificada. 
        <br/>
        <b>Debes tratar estos datos respetando las leyes de Protección de Datos Personales y la confidencialidad de los mismos.</b>
      </Text>
    </Alert>
  )
  return (<></>);
}  


export const AlertValidationInstructions = (props) => {
  const { data } = props;
  if (data && isVerificationPending(data.result)) return (
    <Box bg="yellow.50" mt={4} py={6} pr={8} pl={12} boxShadow="md" rounded="lg" lineHeight="1.rem">
      <b>Por favor verifica qué:</b>
      <Text fontSize="sm">
        <ul>
          <li>Los datos del Documento de identidad coincidan con los informados</li>
          <li>La persona puede responder a tus preguntas en forma coherente<br/> y demuestra estar viva !</li>
          <li>Asegúrate que otra persona no la esté suplantando<br/> o haciendose pasar por ella</li>
          <li>Graba un pequeño video de tu conversación con ella</li>
          <li>Toma fotos de sus documentos (frente y dorso)</li>
        </ul> 
      </Text>
    </Box>
  )
  return (<></>);
}  


export const AlertDone = (props) => {
  const { data } = props;
  if (data && isVerificationDone(data.result)) return (
    <StatusNotice state={data.result} />
  )
  return (<></>);
}  
