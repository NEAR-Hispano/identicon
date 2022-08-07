import * as React from "react";
import { useState, useEffect } from "react";
import { Stack, VStack, Box, Flex, Text, Link, Image, Button, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";

const CallToDevs = (props: any) => {

  const router = useRouter();
  const toast = useToast();

  const {
    isOpen: isOpenSignUp,
    onOpen: onOpenSignUp,
    onClose: onCloseSignUp,
  } = props.disclosureSignup;

  return (
    <Box bg="gray.200" pt={32} pb={24} borderBottom="0px #fff solid">
      <Flex alignItems="center"
        justify="center"
        direction={{ base: "column-reverse", md: "row" }}
        wrap="wrap"
        px={16}
        mx="auto"
        maxW="container.xl">

        <Stack spacing={4} maxW="30rem">
          <Text  fontSize="4xl" color="indigo.600" fontWeight={800}>
            ¿Eres desarrollador?
          </Text>        
          <Text fontSize="lg" lineHeight="1.6em">
            Puedes usar nuestra API para hacer solicitudes 
            desde tus aplicaciones.
          </Text>
          <Text fontSize="lg" lineHeight="1.6em">
            Solicita la verficación de una o más personas
            usando la API. Nosotros nos ocuparemos de la verificación
            y notificarte cuando estén finalizadas.
          </Text>
          <Text fontSize="lg" lineHeight="1.6em">
            Ideal cuando necesitas conocer a tus clientes 
            y consumidores (KYC) por razones regulatorias u otras.
          </Text>
          <VStack spacing={3} align="left" pl={2} fontWeight="bold">
            <Link color="blue.600" >¿Cómo puedes convertirte en un validador?</Link>
            <Link color="blue.600" >¡Qué tareas debes realizar como validador?</Link>
            <br/>
            <Button 
              variant={"solid"}
              colorScheme={"indigo"}
              onClick={onOpenSignUp}
              w="12rem" 
              borderRadius="xl">
              Solicítala ahora
            </Button>
          </VStack>
        </Stack>

        <Box pl={16} >
          <Image 
            objectFit="cover"
            alt="Validator images"
            src="/images/for-developers.png"
            boxSize={"360px"}
            />
        </Box>

      </Flex>
    </Box>
  )
}

export default CallToDevs;
