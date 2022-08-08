import * as React from "react";
import { useState, useEffect } from "react";
import { Stack, VStack, Box, Flex, Text, Link, Image, Button, useToast,
OrderedList, ListItem } from "@chakra-ui/react";
import { useRouter } from "next/router";

const HowDoesItWork = (props: any) => {

  const router = useRouter();
  const toast = useToast();

  const {
    isOpen: isOpenSignUp,
    onOpen: onOpenSignUp,
    onClose: onCloseSignUp,
  } = props.disclosureSignup;

  return (
    <Box bg="gray.100" py={24} borderBottom="0px #fff solid">
      <Flex alignItems="center"
        justify="center"
        direction={{ base: "column-reverse", md: "row" }}
        wrap="wrap"
        px={16}
        mx="auto"
        maxW="container.xl">

        <Box pr={16}>
          <Image 
            objectFit="cover"
            alt="Validator images"
            src="/images/SimplifiedGeneralFlow-round.png"
            boxSize={"500px"}
            />
        </Box>

        <Stack spacing={4} maxW="30rem">
          <Text  fontSize="4xl" color="indigo.600">
            <span className="feature-heading">Cómo funciona</span>
          </Text>        
          <Text fontSize="lg" lineHeight="1.6em">
            Es simple y solo necesitas tu móvil (con Whatsapp o Telegram) 
            para que podamos realizar la verificación.
          </Text>
          <Box fontSize="md" lineHeight="1.6em" pl={0}>
            <OrderedList spacing={3}>
              <ListItem>Realizas tu solicitud utilizando esta misma página web.</ListItem>
              <ListItem>Nuestro protocolo te asignará dos o tres validadores anónimos.
                Los validadores elegidos se contactarán contigo a tu móvil.</ListItem>
              <ListItem>Cada validador realizará una pequeña entrevista que será filmada, para
                 verificar tu estado y tomará fotos de tus documentos de identidad.</ListItem>
              <ListItem>Cuando los validadores aprueben tu verificación, emitiremos 
                una Credencial Verificable, con vigencia de un mes.</ListItem>
            </OrderedList>
          </Box>
          <VStack spacing={3} align="left" pl={2} fontWeight="bold">
            <Link color="blue.600" >Conceptos básicos</Link>
            <Link color="blue.600" >¿Cómo se realiza la entrevista?</Link>
            <Link color="blue.600" >¿Quiénes son los validadores?</Link>
            <Link color="blue.600" >¿Qué es la Credencial Verificable?</Link>
              <br/>
              <Button 
                onClick={onOpenSignUp}
                w="12rem" 
                colorScheme="indigo" variant="solid" borderRadius="xl">
                Solicítala ahora
              </Button>
          </VStack>
        </Stack>
      </Flex>
    </Box>
  )
}

export default HowDoesItWork;
